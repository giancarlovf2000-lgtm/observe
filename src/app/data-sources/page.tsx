import { Metadata } from 'next'
import Link from 'next/link'
import { Globe, CheckCircle2, AlertCircle, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Data Sources',
  description: 'All data sources powering OBSERVE — their licenses, coverage, and attribution requirements.',
}

function NavHeader() {
  return (
    <header className="border-b border-border/30 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--obs-teal)] flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-bold text-sm tracking-wider uppercase">OBSERVE</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link>
          <Link href="/api-reference" className="hover:text-foreground transition-colors">API Reference</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
        </div>
      </div>
    </header>
  )
}

const PLATFORM_SOURCES = [
  {
    name: 'USGS Earthquake Hazards Program',
    url: 'https://earthquake.usgs.gov',
    module: 'Weather & Disasters',
    coverage: 'Global — significant earthquakes updated in real time',
    license: 'US Federal Government — Public Domain (17 U.S.C. § 105)',
    commercial: true,
    attribution: 'Courtesy attribution recommended',
    notes: 'USGS data is produced by federal employees and carries no copyright. Free for any use.',
  },
  {
    name: 'NOAA / National Weather Service',
    url: 'https://www.weather.gov',
    module: 'Weather & Disasters',
    coverage: 'United States — Severe and Extreme active alerts',
    license: 'US Federal Government — Public Domain',
    commercial: true,
    attribution: 'Do not imply NWS endorsement',
    notes: 'NWS data is explicitly public domain. Cannot be used in a way that implies government endorsement.',
  },
  {
    name: 'GDELT Project',
    url: 'https://www.gdeltproject.org',
    module: 'News Intelligence',
    coverage: 'Global — English-language news, filtered for geopolitical relevance',
    license: 'Open — unrestricted commercial use with attribution',
    commercial: true,
    attribution: 'Required — link to gdeltproject.org',
    notes: 'GDELT explicitly grants unlimited use for any academic, commercial, or governmental purpose. Citation + link required.',
  },
  {
    name: 'CoinCap',
    url: 'https://coincap.io',
    module: 'Markets',
    coverage: 'Global — Bitcoin, Ethereum, Solana, Ripple, Cardano, Polkadot',
    license: 'Free — commercial use allowed',
    commercial: true,
    attribution: 'Attribution displayed on Markets page',
    notes: 'CoinCap provides free market data with no commercial restrictions on the free tier.',
  },
  {
    name: 'ExchangeRate-API',
    url: 'https://www.exchangerate-api.com',
    module: 'Markets',
    coverage: 'Global — 10 major USD currency pairs',
    license: 'Free tier — commercial display use allowed',
    commercial: true,
    attribution: 'Attribution displayed on Markets page',
    notes: 'Used for display purposes only within a broader dashboard. Data is not resold or redistributed as a standalone product.',
  },
  {
    name: 'OpenWeatherMap',
    url: 'https://openweathermap.org',
    module: 'Weather (optional)',
    coverage: 'Global cities — current conditions, severe weather only',
    license: 'ODbL — commercial use allowed with attribution',
    commercial: true,
    attribution: '© OpenWeather displayed on Weather page',
    notes: 'Requires user-provided API key (BYOK). ODbL share-alike applies to the database, not application code.',
  },
]

const BYOK_SOURCES = [
  {
    name: 'NewsAPI',
    url: 'https://newsapi.org',
    module: 'News Intelligence',
    coverage: 'Global — top headlines and article search from 80,000+ sources',
    license: 'Developer (free) tier: development only. Commercial use requires paid plan.',
    commercial: false,
    notes: 'Users must have an appropriate paid NewsAPI plan for production use. OBSERVE does not use a platform-wide NewsAPI key.',
  },
  {
    name: 'ACLED (Armed Conflict Location & Event Data)',
    url: 'https://acleddata.com',
    module: 'Conflicts',
    coverage: 'Global — conflict events, protests, explosions, battles',
    license: 'Free registration required. Commercial entities need a corporate license.',
    commercial: false,
    notes: 'Users register their own ACLED account. Each user is responsible for their own ACLED terms compliance.',
  },
  {
    name: 'OpenSky Network',
    url: 'https://opensky-network.org',
    module: 'Transport — Flights',
    coverage: 'Europe & Middle East — real-time flight state vectors',
    license: 'Research/non-commercial. Commercial use requires a separate license from OpenSky.',
    commercial: false,
    notes: 'Users connect their own OpenSky credentials. OBSERVE does not use a shared platform key for OpenSky.',
  },
  {
    name: 'Perplexity AI',
    url: 'https://perplexity.ai',
    module: 'AI Briefings',
    coverage: 'AI-generated intelligence analysis using sonar models',
    license: 'Pay-as-you-go API. Standard Perplexity API terms apply.',
    commercial: true,
    notes: 'Users provide their own Perplexity API key. Costs depend on usage; typical briefing is under $0.01.',
  },
]

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            OBSERVE aggregates data exclusively from open, public, and lawfully licensed sources.
            No private surveillance, no hacking, no personal data collection.
            Below is a complete list of every data source used, its license, and how it is attributed.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--obs-green)]" />
            Included with subscription — no setup required
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
            BYOK — connect your own key in Settings → Integrations
          </div>
        </div>

        {/* Platform sources */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--obs-green)]" />
            <h2 className="text-xl font-semibold text-foreground">Platform-Included Sources</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            These sources are active for all subscribers with no additional setup. All are open/public data with no commercial restrictions.
          </p>
          <div className="space-y-3">
            {PLATFORM_SOURCES.map(src => (
              <div key={src.name} className="rounded-xl border border-border/20 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <a href={src.url} target="_blank" rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:text-[var(--obs-teal)] transition-colors">
                      {src.name}
                    </a>
                    <div className="text-xs text-[var(--obs-teal)] mt-0.5">{src.module}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[var(--obs-green)] flex-shrink-0 mt-0.5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground/60 uppercase tracking-wider font-mono">Coverage</span>
                    <div className="text-muted-foreground mt-0.5">{src.coverage}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 uppercase tracking-wider font-mono">License</span>
                    <div className="text-muted-foreground mt-0.5">{src.license}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground/60 border-t border-border/10 pt-2">{src.notes}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BYOK sources */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--obs-amber)]" />
            <h2 className="text-xl font-semibold text-foreground">Bring Your Own Key (BYOK) Sources</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            These sources require you to register for a free account with the provider and connect your own API key in Settings → Integrations.
            Your keys are encrypted and never used outside your account.
          </p>
          <div className="space-y-3">
            {BYOK_SOURCES.map(src => (
              <div key={src.name} className="rounded-xl border border-[var(--obs-amber)]/15 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <a href={src.url} target="_blank" rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:text-[var(--obs-teal)] transition-colors">
                      {src.name}
                    </a>
                    <div className="text-xs text-[var(--obs-amber)] mt-0.5">{src.module}</div>
                  </div>
                  <Lock className="w-4 h-4 text-[var(--obs-amber)] flex-shrink-0 mt-0.5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground/60 uppercase tracking-wider font-mono">Coverage</span>
                    <div className="text-muted-foreground mt-0.5">{src.coverage}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 uppercase tracking-wider font-mono">License</span>
                    <div className="text-muted-foreground mt-0.5">{src.license}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground/60 border-t border-border/10 pt-2">{src.notes}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Ethics note */}
        <section className="rounded-xl border border-[var(--obs-green)]/20 bg-[var(--obs-green)]/5 p-6 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[var(--obs-green)]" />
            <h3 className="font-semibold text-foreground">Our Data Ethics Commitment</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            OBSERVE uses only lawfully obtained, publicly available data. We do not scrape private systems,
            exploit API terms of service, collect personal location data, or enable surveillance of individuals.
            All platform-level data sources have been reviewed for commercial use compatibility.
            BYOK sources are the responsibility of each user under their own agreements with the respective providers.
          </p>
        </section>

        <div className="border-t border-border/30 pt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link>
          <Link href="/api-reference" className="hover:text-foreground transition-colors">API Reference</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </div>
      </main>
    </div>
  )
}
