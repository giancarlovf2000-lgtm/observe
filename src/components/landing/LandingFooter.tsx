import Link from 'next/link'
import { Globe } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/30 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[var(--obs-teal)] flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="font-bold text-sm tracking-wider uppercase">OBSERVE</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Advanced global situational awareness platform.
              Legal, ethical, public-source intelligence only.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Platform</div>
            <ul className="space-y-2">
              {['Map', 'Briefings', 'Conflicts', 'Markets', 'Weather', 'Transport'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Resources</div>
            <ul className="space-y-2">
              {['Documentation', 'API Reference', 'Data Sources', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Ethics</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              OBSERVE uses only lawful, public, and ethically sourced data.
              No private surveillance. No unlawful targeting. No hacking.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--obs-green)] bg-[var(--obs-green)]/10 border border-[var(--obs-green)]/20 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--obs-green)]" />
              Public Sources Only
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OBSERVE Platform. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Intelligence data is for informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
