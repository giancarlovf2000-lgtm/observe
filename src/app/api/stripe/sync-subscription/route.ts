/**
 * POST /api/stripe/sync-subscription
 * One-time fix: reads the authenticated user's Stripe subscription
 * and updates their profile so they can access the platform.
 * Only works for the currently logged-in user's own data.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id && !profile?.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'No Stripe customer found for your account. Have you subscribed?' },
      { status: 404 }
    )
  }

  // Try to get subscription by subscription ID first, then by customer
  let subscription = null

  if (profile.stripe_subscription_id) {
    try {
      subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
    } catch {
      // subscription ID stale — fall through to customer lookup
    }
  }

  if (!subscription && profile.stripe_customer_id) {
    const { data: subs } = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      limit: 1,
      status: 'all',
    })
    subscription = subs[0] ?? null
  }

  if (!subscription) {
    return NextResponse.json(
      { error: 'No subscription found in Stripe for your account.' },
      { status: 404 }
    )
  }

  const isActive = subscription.status === 'active' || subscription.status === 'trialing'

  await admin
    .from('profiles')
    .update({
      tier: isActive ? 'pro' : 'free',
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      subscription_period_end: new Date(
        (subscription.items.data[0]?.current_period_end ?? 0) * 1000
      ).toISOString(),
    })
    .eq('id', user.id)

  return NextResponse.json({
    ok: true,
    status: subscription.status,
    tier: isActive ? 'pro' : 'free',
    message: isActive
      ? 'Subscription synced. You can now access the platform.'
      : `Subscription found but status is "${subscription.status}" — not active.`,
  })
}
