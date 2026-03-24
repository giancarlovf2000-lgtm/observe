import Link from 'next/link'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingLayers } from '@/components/landing/LandingLayers'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingAI } from '@/components/landing/LandingAI'
import { LandingPricing } from '@/components/landing/LandingPricing'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingLayers />
      <LandingAI />
      <LandingPricing />
      <LandingFooter />
    </div>
  )
}
