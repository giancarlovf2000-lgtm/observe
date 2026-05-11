import { Metadata } from 'next'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingPricing } from '@/components/landing/LandingPricing'
import { LandingFooter } from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'One plan. Full access to the OBSERVE global intelligence platform for $29/month.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <div className="pt-20">
        <LandingPricing />
      </div>
      <LandingFooter />
    </div>
  )
}
