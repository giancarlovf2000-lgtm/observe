/**
 * POST /api/stripe/webhook
 * Handles Stripe events to keep subscription status in sync.
 *
 * Stripe dashboard: add this URL as a webhook endpoint and select:
 *   checkout.session.completed
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   invoice.payment_failed
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not set' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const uid  = session.metadata?.supabase_uid
      const plan = session.metadata?.plan ?? 'pro'
      if (!uid) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      await supabase
        .from('profiles')
        .update({
          tier:                    plan,
          stripe_customer_id:      session.customer as string,
          stripe_subscription_id:  session.subscription as string,
          subscription_status:     subscription.status,
          subscription_period_end: new Date(
            (subscription.items.data[0]?.current_period_end ?? 0) * 1000
          ).toISOString(),
        })
        .eq('id', uid)

      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const uid = sub.metadata?.supabase_uid
      if (!uid) break

      const isActive = sub.status === 'active' || sub.status === 'trialing'

      await supabase
        .from('profiles')
        .update({
          subscription_status:     sub.status,
          tier:                    isActive ? (sub.metadata?.plan ?? 'pro') : 'free',
          subscription_period_end: new Date(
            (sub.items.data[0]?.current_period_end ?? 0) * 1000
          ).toISOString(),
        })
        .eq('stripe_subscription_id', sub.id)

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({
          tier:                   'free',
          subscription_status:    'canceled',
          stripe_subscription_id: null,
        })
        .eq('stripe_subscription_id', sub.id)

      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      // In Stripe API 2025+, subscription ref is nested under parent
      const subId =
        (invoice as unknown as { subscription?: string }).subscription ??
        (invoice.parent as { subscription_details?: { subscription?: string } } | null)
          ?.subscription_details?.subscription
      if (!subId) break
      await supabase
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_subscription_id', subId)

      break
    }
  }

  return NextResponse.json({ received: true })
}
