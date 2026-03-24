'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, Sword, CloudLightning, Newspaper, Bell,
  TrendingUp, Globe2, Map, Brain, Clock, AlertTriangle, RefreshCw
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { PulseIndicator } from '@/components/shared/PulseIndicator'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { SeverityLevel } from '@/types'

interface DashboardEvent {
  id: string
  type: string
  title: string
  summary: string | null
  severity: SeverityLevel
  country_id: string | null
  region: string | null
  lat: number | null
  lng: number | null
  occurred_at: string
  tags: string[]
}

interface DashboardBriefing {
  id: string
  type: string
  title: string
  executive_summary: string | null
  briefing_date: string
  created_at: string
}

interface DashboardClientProps {
  recentEvents: DashboardEvent[]
  conflictCount: number
  latestBriefing: DashboardBriefing | null
  weatherEvents: DashboardEvent[]
}

const EVENT_TYPE_ICON: Record<string, React.ElementType> = {
  conflict: Sword,
  news: Newspaper,
  weather: CloudLightning,
  market: TrendingUp,
  political: Globe2,
  default: Bell,
}

const EVENT_TYPE_COLOR: Record<string, string> = {
  conflict: 'var(--obs-red)',
  news: '#f97316',
  weather: 'var(--obs-blue)',
  market: 'var(--obs-amber)',
  political: 'var(--obs-purple)',
}

const REGION_RISK_DATA = [
  { region: 'Eastern Europe', score: 90, active: 2, trend: 'up' },
  { region: 'Middle East', score: 85, active: 4, trend: 'stable' },
  { region: 'East Africa', score: 80, active: 3, trend: 'up' },
  { region: 'South China Sea', score: 68, active: 1, trend: 'up' },
  { region: 'Central Asia', score: 55, active: 1, trend: 'stable' },
  { region: 'Latin America', score: 48, active: 2, trend: 'stable' },
]

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub: string
  color: string
  href: string
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="glass rounded-xl p-5 border border-white/5 hover:glass-elevated transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
          >
            <Icon className="w-4.5 h-4.5" style={{ color }} />
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
        </div>
        <div className="text-2xl font-bold text-foreground mb-0.5">{value}</div>
        <div className="text-sm font-medium text-foreground/80">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </motion.div>
    </Link>
  )
}

export function DashboardClient({
  recentEvents,
  conflictCount,
  latestBriefing,
  weatherEvents,
}: DashboardClientProps) {
  const criticalCount = recentEvents.filter(e => e.severity === 'critical').length
  const newsCount = recentEvents.filter(e => e.type === 'news').length
  const [clockStr, setClockStr] = useState('')
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const tick = () => setClockStr(new Date().toUTCString().slice(0, 25))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  function handleRefresh() {
    startTransition(() => {
      router.refresh()
      setLastRefreshed(new Date())
    })
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground">Command Center</h1>
          <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <PulseIndicator />
            Live global situational awareness
            <span className="font-mono">·</span>
            <span className="font-mono text-xs">{clockStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-border/50 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', isPending && 'animate-spin')} />
            {isPending ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Link href="/map" className={cn(buttonVariants(), 'bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90')}>
            <Map className="w-4 h-4 mr-2" />
            Open World Map
          </Link>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={Sword}
          label="Active Conflicts"
          value={conflictCount}
          sub="Globally tracked"
          color="var(--obs-red)"
          href="/conflicts"
        />
        <StatCard
          icon={AlertTriangle}
          label="Critical Events"
          value={criticalCount}
          sub="Last 24 hours"
          color="var(--obs-amber)"
          href="/map"
        />
        <StatCard
          icon={CloudLightning}
          label="Weather Alerts"
          value={weatherEvents.length}
          sub="Active events"
          color="var(--obs-blue)"
          href="/weather"
        />
        <StatCard
          icon={Newspaper}
          label="Breaking News"
          value={newsCount}
          sub="High-severity items"
          color="#f97316"
          href="/news"
        />
      </motion.div>

      {/* Last refreshed */}
      <div className="text-xs text-muted-foreground/50 font-mono -mt-2">
        Last updated {formatDistanceToNow(lastRefreshed, { addSuffix: true })}
      </div>

      {/* Main content: events + briefing */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent high-severity events */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PulseIndicator color="var(--obs-red)" />
              High-Priority Events
            </h2>
            <Link href="/map" className="text-xs text-[var(--obs-teal)] hover:underline">
              View all on map →
            </Link>
          </div>

          <div className="space-y-2">
            {recentEvents.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground text-sm border border-white/5">
                No high-severity events at this time
              </div>
            ) : (
              recentEvents.map((event) => {
                const Icon = EVENT_TYPE_ICON[event.type] || EVENT_TYPE_ICON.default
                const color = EVENT_TYPE_COLOR[event.type] || '#94a3b8'
                return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="glass rounded-xl p-4 border border-white/5 hover:glass-elevated transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <SeverityBadge severity={event.severity} />
                            {event.country_id && (
                              <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground px-1.5 py-0">
                                {event.country_id}
                              </Badge>
                            )}
                            {event.region && !event.country_id && (
                              <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground px-1.5 py-0">
                                {event.region}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-medium text-foreground group-hover:text-[var(--obs-teal)] transition-colors leading-snug">
                            {event.title}
                          </div>
                          {event.summary && (
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {event.summary}
                            </div>
                          )}
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock className="w-3 h-3 text-muted-foreground/60" />
                            <span className="text-xs text-muted-foreground/60 font-mono">
                              {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </motion.div>

        {/* Right column: briefing + region risk */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Latest AI Briefing */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-[var(--obs-purple)]" />
                Latest Briefing
              </h2>
              <Link href="/briefings" className="text-xs text-[var(--obs-teal)] hover:underline">
                All briefings →
              </Link>
            </div>

            {latestBriefing ? (
              <Link href={`/briefings/${latestBriefing.id}`}>
                <div className="glass rounded-xl p-4 border border-[var(--obs-purple)]/20 hover:glass-elevated transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30 text-xs">
                      DAILY BRIEF
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(latestBriefing.briefing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-foreground group-hover:text-[var(--obs-purple)] transition-colors mb-2">
                    {latestBriefing.title}
                  </div>
                  {latestBriefing.executive_summary && (
                    <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
                      {latestBriefing.executive_summary}
                    </p>
                  )}
                  <div className="mt-3 text-xs text-[var(--obs-teal)] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read full briefing <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/briefings?generate=world">
                <div className="glass rounded-xl p-4 border border-[var(--obs-purple)]/15 hover:glass-elevated transition-all cursor-pointer text-center">
                  <Brain className="w-8 h-8 text-[var(--obs-purple)]/40 mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Generate today's briefing</div>
                  <div className="text-xs text-[var(--obs-teal)] mt-1">Generate now →</div>
                </div>
              </Link>
            )}
          </div>

          {/* Region Risk */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
                Region Risk
              </h2>
            </div>
            <div className="glass rounded-xl p-4 border border-white/5 space-y-3">
              {REGION_RISK_DATA.map((region) => (
                <div key={region.region} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate">{region.region}</span>
                      <span className={cn(
                        'text-xs font-mono ml-2',
                        region.score >= 80 ? 'text-red-400' :
                        region.score >= 60 ? 'text-orange-400' :
                        region.score >= 40 ? 'text-yellow-400' : 'text-green-400'
                      )}>
                        {region.score}
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          region.score >= 80 ? 'bg-red-500' :
                          region.score >= 60 ? 'bg-orange-500' :
                          region.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        )}
                        style={{ width: `${region.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {region.active} active
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
