/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session and returns the URL.
 * Body: { plan: 'pro' }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json() as { plan: PlanKey }
  if (!plan || !(plan in PLANS)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const planConfig = PLANS[plan]
  if (!planConfig.priceId) {
    return NextResponse.json(
      { error: `STRIPE_${plan.toUpperCase()}_PRICE_ID env var is not set` },
      { status: 500 }
    )
  }

  // Fetch or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, full_name')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id ?? null

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? '',
      name:  profile?.full_name ?? undefined,
      metadata: { supabase_uid: user.id },
    })
    customerId = customer.id

    // Persist customer ID
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    customer:             customerId,
    mode:                 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price:    planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/onboarding?checkout=success`,
    cancel_url:  `${appUrl}/#pricing`,
    metadata: { supabase_uid: user.id, plan },
    subscription_data: {
      metadata: { supabase_uid: user.id, plan },
    },
  })

  return NextResponse.json({ url: session.url })
}
