import Stripe from 'stripe'

const stripeKey = (process.env.STRIPE_SECRET_KEY ?? '').replace(/\s/g, '')

if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
})

export const PLANS = {
  pro: {
    priceId: (process.env.STRIPE_PRO_PRICE_ID ?? '').replace(/\s/g, ''),
    name: 'Pro',
    amount: 2900, // $29.00
  },
} as const

export type PlanKey = keyof typeof PLANS
