import { Metadata } from 'next'
import Link from 'next/link'
import { Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using the OBSERVE platform.',
}

const LAST_UPDATED = 'May 11, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/30 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--obs-teal)] flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="font-bold text-sm tracking-wider uppercase">OBSERVE</span>
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of OBSERVE (&quot;the Service&quot;),
          operated by OBSERVE Platform (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By creating an account or
          using the Service, you agree to these Terms in full. If you do not agree, do not use the Service.
        </p>

        <Section title="1. Eligibility">
          <p>You must be at least 18 years old and legally capable of entering into a binding contract to use OBSERVE. By using the Service you represent that you meet these requirements.</p>
        </Section>

        <Section title="2. Subscription and Payment">
          <p><strong className="text-foreground">Plan:</strong> OBSERVE is offered as a monthly subscription at $29/month (or as otherwise displayed at checkout).</p>
          <p><strong className="text-foreground">Billing:</strong> Payments are charged automatically at the start of each billing period via Stripe. All prices are in USD.</p>
          <p><strong className="text-foreground">Cancellation:</strong> You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period — you retain access until then. We do not provide prorated refunds for partial periods.</p>
          <p><strong className="text-foreground">Refunds:</strong> Refund requests within 7 days of your first payment may be considered on a case-by-case basis. Contact <a href="mailto:support@observe.center" className="text-[var(--obs-teal)] hover:underline">support@observe.center</a>.</p>
          <p><strong className="text-foreground">Price changes:</strong> We will provide at least 30 days notice before any price increase, which will take effect at your next renewal.</p>
        </Section>

        <Section title="3. Acceptable Use">
          <p>You agree to use OBSERVE only for lawful purposes. You must not:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Resell, redistribute, or sublicense access to the Service or its data to third parties</li>
            <li>Automate bulk extraction (scraping) of platform content or data</li>
            <li>Use the Service to target, surveil, harass, or harm any individual or group</li>
            <li>Attempt to reverse-engineer, decompile, or access non-public parts of the platform</li>
            <li>Share your account credentials with others</li>
            <li>Use the Service to violate any applicable law or the terms of any third-party API you connect</li>
          </ul>
          <p>Violation of these terms may result in immediate termination of your account without refund.</p>
        </Section>

        <Section title="4. Third-Party API Keys (BYOK)">
          <p>Certain features (News Intelligence, Conflict Tracking, AI Briefings, Flight Tracking) require you to connect your own API keys from third-party providers. You are solely responsible for:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Complying with the terms of service of each third-party provider</li>
            <li>Ensuring your API plan level permits use within OBSERVE (e.g., production use, not just development)</li>
            <li>Any charges incurred on your third-party API accounts</li>
          </ul>
          <p>We are not responsible for third-party API outages, rate limits, or ToS changes that affect functionality.</p>
        </Section>

        <Section title="5. Intelligence Data Disclaimer">
          <p>All intelligence data provided by OBSERVE (news, events, weather, market prices, flight/vessel positions) is for <strong className="text-foreground">informational purposes only</strong>. It is sourced from public data providers and may be incomplete, delayed, or inaccurate.</p>
          <p>OBSERVE data is <strong className="text-foreground">not</strong> financial advice, legal advice, or a basis for any high-stakes decision-making. We make no warranties regarding accuracy, completeness, or fitness for any particular purpose.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>The OBSERVE platform, including its code, design, and proprietary features, is owned by OBSERVE Platform and protected by applicable intellectual property laws. The underlying intelligence data belongs to the respective data providers (USGS, NOAA, GDELT, CoinCap, etc.) and is subject to their respective licenses.</p>
          <p>You retain ownership of any content or API credentials you provide. You grant us a limited license to use them solely to provide the Service to you.</p>
        </Section>

        <Section title="7. Service Availability">
          <p>We aim for high availability but do not guarantee uninterrupted access. We may perform maintenance, updates, or emergency fixes that temporarily affect the Service. We are not liable for losses caused by downtime.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>To the maximum extent permitted by law, OBSERVE Platform shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.</p>
          <p>Our total aggregate liability to you for any claim arising from these Terms or your use of the Service shall not exceed the amount you paid us in the 3 months preceding the claim.</p>
        </Section>

        <Section title="9. Indemnification">
          <p>You agree to indemnify and hold harmless OBSERVE Platform and its operators from any claims, damages, or expenses (including legal fees) arising from your violation of these Terms, your use of the Service, or your violation of any third party&apos;s rights.</p>
        </Section>

        <Section title="10. Termination">
          <p>We may suspend or terminate your account at any time if you violate these Terms. You may terminate your account at any time by canceling your subscription and contacting support. Upon termination, your access ends immediately and your data will be deleted per our Privacy Policy.</p>
        </Section>

        <Section title="11. Changes to Terms">
          <p>We may update these Terms from time to time. We will notify you by email at least 14 days before material changes take effect. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </Section>

        <Section title="12. Governing Law">
          <p>These Terms are governed by and construed in accordance with the laws of the United States. Any disputes shall be resolved through binding arbitration under the rules of the American Arbitration Association, except you may bring individual claims in small claims court.</p>
        </Section>

        <Section title="13. Contact">
          <p>For questions about these Terms, contact us at <a href="mailto:support@observe.center" className="text-[var(--obs-teal)] hover:underline">support@observe.center</a>.</p>
        </Section>

        <div className="border-t border-border/30 pt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </div>
      </main>
    </div>
  )
}
