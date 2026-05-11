import { Metadata } from 'next'
import Link from 'next/link'
import { Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How OBSERVE collects, uses, and protects your personal data.',
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

export default function PrivacyPage() {
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
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          OBSERVE (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal information.
          This Privacy Policy explains what data we collect, how we use it, and your rights regarding it.
          By using OBSERVE, you agree to the practices described here.
        </p>

        <Section title="1. Data We Collect">
          <p><strong className="text-foreground">Account data:</strong> Your email address and display name when you create an account.</p>
          <p><strong className="text-foreground">Payment data:</strong> Billing is processed entirely by Stripe. We never receive or store your full credit card number. We only store your Stripe customer ID and subscription status.</p>
          <p><strong className="text-foreground">API credentials:</strong> If you connect third-party API keys (NewsAPI, ACLED, Perplexity, OpenSky), they are stored encrypted in our database. We only use them to make requests on your behalf — never shared or used outside your account.</p>
          <p><strong className="text-foreground">Usage data:</strong> Basic usage logs (page visits, feature interactions) collected by Vercel and Supabase infrastructure for performance and error monitoring. We do not sell this data.</p>
          <p><strong className="text-foreground">Preferences:</strong> Language, theme, and notification settings stored in your account profile.</p>
        </Section>

        <Section title="2. How We Use Your Data">
          <p>We use your data solely to operate and improve OBSERVE:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Authenticate your account and manage your session</li>
            <li>Process subscription payments via Stripe</li>
            <li>Deliver platform intelligence features (map, briefings, alerts)</li>
            <li>Send transactional emails (password reset, billing receipts)</li>
            <li>Diagnose technical errors and improve performance</li>
          </ul>
          <p>We do <strong className="text-foreground">not</strong> use your data for advertising, profiling, or any purpose unrelated to running the OBSERVE service.</p>
        </Section>

        <Section title="3. Third-Party Services">
          <p>OBSERVE relies on the following sub-processors to deliver the service:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-foreground">Supabase</strong> — authentication and database hosting (EU/US data centers)</li>
            <li><strong className="text-foreground">Stripe</strong> — payment processing (PCI-DSS Level 1 certified)</li>
            <li><strong className="text-foreground">Vercel</strong> — application hosting and edge infrastructure</li>
          </ul>
          <p>Each provider has its own privacy policy and data processing agreements. We do not share your data with any other third parties.</p>
        </Section>

        <Section title="4. Data Retention">
          <p>We retain your account data for as long as your account is active. If you cancel your subscription and request account deletion, we will delete your personal data within 30 days, except where retention is required by law (e.g., financial records required for tax compliance, retained for 7 years).</p>
        </Section>

        <Section title="5. Your Rights">
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-foreground">Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong className="text-foreground">Correction:</strong> Update inaccurate data via your account settings</li>
            <li><strong className="text-foreground">Deletion:</strong> Request erasure of your account and personal data</li>
            <li><strong className="text-foreground">Portability:</strong> Request your data in a machine-readable format</li>
            <li><strong className="text-foreground">Objection:</strong> Object to processing where we rely on legitimate interests</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href="mailto:privacy@observe.center" className="text-[var(--obs-teal)] hover:underline">privacy@observe.center</a>.</p>
        </Section>

        <Section title="6. Cookies">
          <p>OBSERVE uses only essential cookies required for authentication (session tokens managed by Supabase). We do not use tracking cookies, advertising cookies, or analytics cookies beyond what is embedded in our infrastructure providers.</p>
        </Section>

        <Section title="7. Data Security">
          <p>All data is transmitted over HTTPS/TLS. API credentials are encrypted at rest. Supabase enforces Row-Level Security (RLS) ensuring each user can only access their own data. We perform regular dependency updates and security reviews.</p>
        </Section>

        <Section title="8. International Transfers">
          <p>OBSERVE is hosted on infrastructure in the United States and European Union. If you are located outside these regions, your data may be transferred to and processed in these jurisdictions. We rely on Supabase&apos;s and Vercel&apos;s Standard Contractual Clauses for GDPR-compliant transfers.</p>
        </Section>

        <Section title="9. Children">
          <p>OBSERVE is not directed at children under 16. We do not knowingly collect personal data from minors. If you believe a minor has provided us data, contact us immediately at <a href="mailto:privacy@observe.center" className="text-[var(--obs-teal)] hover:underline">privacy@observe.center</a>.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify subscribers by email of any material changes at least 14 days before they take effect. Continued use of the platform after changes constitutes acceptance.</p>
        </Section>

        <Section title="11. Contact">
          <p>For privacy questions or requests, contact us at <a href="mailto:privacy@observe.center" className="text-[var(--obs-teal)] hover:underline">privacy@observe.center</a>.</p>
        </Section>

        {/* Footer nav */}
        <div className="border-t border-border/30 pt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/tos" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </div>
      </main>
    </div>
  )
}
