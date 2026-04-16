/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session and returns the URL.
 * Body: { plan: 'pro' }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLANS, type PlanKey } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as { plan?: PlanKey }
    const { plan } = body

    if (!plan || !(plan in PLANS)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const planConfig = PLANS[plan]
    if (!planConfig.priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID is not configured. Contact support.' },
        { status: 500 }
      )
    }

    // Import stripe lazily so a missing key gives a clean JSON error, not a crash
    const { stripe } = await import('@/lib/stripe')

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.observe.center').replace(/\n/g, '').trim()

    // Fetch or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id ?? null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    profile?.email ?? user.email ?? '',
        name:     profile?.full_name ?? undefined,
        metadata: { supabase_uid: user.id },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer:             customerId,
      mode:                 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${appUrl}/onboarding?checkout=success`,
      cancel_url:  `${appUrl}/#pricing`,
      metadata:    { supabase_uid: user.id, plan },
      subscription_data: {
        metadata: { supabase_uid: user.id, plan },
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[stripe/checkout]', message)
    return NextResponse.json(
      { error: `Checkout failed: ${message}` },
      { status: 500 }
    )
  }
}
