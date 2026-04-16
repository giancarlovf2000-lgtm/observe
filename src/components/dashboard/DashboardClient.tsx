'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight, Sword, CloudLightning, Newspaper, Bell,
  TrendingUp, Globe2, Map, Brain, Clock, AlertTriangle, RefreshCw,
  Activity, Zap, Shield, ChevronRight
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { PulseIndicator } from '@/components/shared/PulseIndicator'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { SeverityLevel } from '@/types'
import { useT } from '@/hooks/useT'
import { usePageTranslation } from '@/hooks/usePageTranslation'
import { TranslateBanner } from '@/components/shared/TranslateBanner'

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

export interface DashboardClientProps {
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
  conflict:  'var(--obs-red)',
  news:      '#f97316',
  weather:   'var(--obs-blue)',
  market:    'var(--obs-amber)',
  political: 'var(--obs-purple)',
}

const REGION_RISK_DATA = [
  { region: 'Eastern Europe', score: 90, active: 2 },
  { region: 'Middle East',    score: 85, active: 4 },
  { region: 'East Africa',    score: 80, active: 3 },
  { region: 'South China Sea',score: 68, active: 1 },
  { region: 'Central Asia',   score: 55, active: 1 },
  { region: 'Latin America',  score: 48, active: 2 },
]

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ to }: { to: number }) {
  const motionVal = useMotionValue(0)
  const spring    = useSpring(motionVal, { stiffness: 80, damping: 18 })
  const display   = useTransform(spring, (v) => Math.round(v).toLocaleString())
  const [displayStr, setDisplayStr] = useState('0')

  useEffect(() => {
    motionVal.set(to)
  }, [to, motionVal])

  useEffect(() => {
    return display.on('change', (v) => setDisplayStr(String(v)))
  }, [display])

  return <span>{displayStr}</span>
}

// ─── Breaking news ticker ──────────────────────────────────────────────────────
function BreakingTicker({ events, liveLabel }: { events: DashboardEvent[]; liveLabel: string }) {
  if (events.length === 0) return null

  const items = [...events, ...events] // duplicate for seamless loop

  return (
    <div className="relative w-full overflow-hidden border-b border-border/30 bg-[var(--obs-surface)] h-8 flex items-center">
      {/* "LIVE" badge */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 border-r border-border/40 h-full bg-[var(--obs-red)]/10">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--obs-red)] animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest text-[var(--obs-red)] uppercase">{liveLabel}</span>
      </div>

      {/* Scrolling content */}
      <div className="flex-1 overflow-hidden">
        <div className="animate-ticker flex items-center whitespace-nowrap">
          {items.map((event, i) => {
            const Icon = EVENT_TYPE_ICON[event.type] || EVENT_TYPE_ICON.default
            const color = EVENT_TYPE_COLOR[event.type] || '#94a3b8'
            return (
              <Link
                key={`${event.id}-${i}`}
                href={`/events/${event.id}`}
                className="inline-flex items-center gap-2 px-6 hover:opacity-80 transition-opacity"
              >
                <Icon className="w-3 h-3 flex-shrink-0" style={{ color }} />
                <span className="text-xs text-foreground/80">{event.title}</span>
                <SeverityBadge severity={event.severity} className="scale-90 origin-left" />
                <span className="text-[10px] text-muted-foreground/50 font-mono">
                  {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                </span>
                <span className="text-border/50 mx-2">·</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Stat card ──────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, color, href,
}: {
  icon: React.ElementType; label: string; value: number
  sub: string; color: string; href: string
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.015, y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="glass rounded-xl p-5 border border-white/5 hover:glass-elevated transition-all cursor-pointer group relative overflow-hidden"
      >
        {/* Subtle gradient bg */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at top right, ${color}08, transparent 70%)` }}
        />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-0.5 tabular-nums">
            <AnimatedNumber to={value} />
          </div>
          <div className="text-sm font-medium text-foreground/80">{label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
        </div>
      </motion.div>
    </Link>
  )
}

// ─── Event row ────────────────────────────────────────────────────────────────
function EventRow({ event, index }: { event: DashboardEvent; index: number }) {
  const Icon  = EVENT_TYPE_ICON[event.type] || EVENT_TYPE_ICON.default
  const color = EVENT_TYPE_COLOR[event.type] || '#94a3b8'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Link href={`/events/${event.id}`}>
        <div className="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all hover:glass-elevated bg-[var(--obs-surface)]/60">
          {/* Left color strip */}
          <div
            className="w-1 flex-shrink-0"
            style={{ background: `${color}90` }}
          />
          <div className="flex items-start gap-3 p-3.5 flex-1 min-w-0">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <SeverityBadge severity={event.severity} />
                {(event.country_id || event.region) && (
                  <span className="text-[10px] font-mono text-muted-foreground/70 uppercase">
                    {event.country_id ?? event.region}
                  </span>
                )}
              </div>
              <div className="text-sm font-medium text-foreground/90 group-hover:text-[var(--obs-teal)] transition-colors leading-snug line-clamp-1">
                {event.title}
              </div>
              {event.summary && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{event.summary}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-right hidden sm:block">
              <div className="text-[10px] text-muted-foreground/50 font-mono whitespace-nowrap">
                {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function DashboardClient({
  recentEvents,
  conflictCount,
  latestBriefing,
  weatherEvents,
}: DashboardClientProps) {
  const { t } = useT()
  const db = t('dashboard')
  const nav = t('nav')
  const topbar = t('topbar')
  const briefings = t('briefings')

  const criticalCount = recentEvents.filter(e => e.severity === 'critical').length
  const newsCount     = recentEvents.filter(e => e.type === 'news').length
  const [clockStr, setClockStr]       = useState('')
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [isPending, startTransition]  = useTransition()
  const router = useRouter()

  // Translate event titles/summaries from DB
  const translatableEvents = recentEvents.map(e => ({ title: e.title, summary: e.summary ?? undefined }))
  const { items: translatedEvents, isTranslating, isTranslated, translate, reset } = usePageTranslation(translatableEvents)
  const displayEvents = recentEvents.map((e, i) => ({
    ...e,
    title:   translatedEvents[i]?.title   ?? e.title,
    summary: translatedEvents[i]?.summary ?? e.summary,
  }))

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

  // Determine global threat level from stats
  const threatLevel =
    criticalCount >= 5 ? { label: db.severity.critical, color: 'var(--obs-red)', cls: 'text-red-400' } :
    criticalCount >= 2 ? { label: db.severity.elevated, color: 'var(--obs-amber)', cls: 'text-amber-400' } :
    { label: db.severity.moderate, color: 'var(--obs-teal)', cls: 'text-teal-400' }

  return (
    <div className="flex flex-col h-full">
      {/* Breaking news ticker */}
      <BreakingTicker events={displayEvents} liveLabel={topbar.live} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-5">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <h1 className="text-xl font-bold text-foreground">{db.commandCenter}</h1>
                <div className={cn(
                  'hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border',
                  criticalCount >= 5
                    ? 'border-red-500/40 bg-red-500/10 text-red-400'
                    : criticalCount >= 2
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-teal-500/40 bg-teal-500/10 text-teal-400'
                )}>
                  <Activity className="w-3 h-3 animate-pulse" />
                  {threatLevel.label}
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                <PulseIndicator />
                <span className="hidden sm:inline">{db.liveAwareness}</span>
                <span className="font-mono hidden lg:inline">·  {clockStr}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isPending}
                className="border-border/50 text-muted-foreground hover:text-foreground h-8 px-2.5 gap-1.5"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', isPending && 'animate-spin')} />
                <span className="hidden sm:inline text-xs">{isPending ? db.refreshing : db.refresh}</span>
              </Button>
              <Link
                href="/map"
                className={cn(buttonVariants({ size: 'sm' }), 'bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-8 gap-1.5 px-3 text-xs')}
              >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{nav.worldMap}</span>
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <StatCard icon={Sword}         label={db.activeConflicts} value={conflictCount}         sub={db.globallyTracked} color="var(--obs-red)"   href="/conflicts" />
            <StatCard icon={AlertTriangle} label={db.criticalEvents}  value={criticalCount}         sub={db.last24Hours}     color="var(--obs-amber)" href="/map" />
            <StatCard icon={CloudLightning}label={db.weatherAlerts}   value={weatherEvents.length}  sub={db.activeEvents}    color="var(--obs-blue)"  href="/weather" />
            <StatCard icon={Newspaper}     label={db.breakingNews}    value={newsCount}             sub={db.highSeverity}    color="#f97316"          href="/news" />
          </motion.div>

          <div className="text-[10px] text-muted-foreground/40 font-mono -mt-1">
            Updated {formatDistanceToNow(lastRefreshed, { addSuffix: true })}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Events feed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 space-y-2"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[var(--obs-red)]" />
                  {db.highPriorityIntel}
                </h2>
                <Link href="/map" className="text-xs text-[var(--obs-teal)] hover:underline flex items-center gap-1">
                  {db.mapView} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <TranslateBanner
                isTranslated={isTranslated}
                isTranslating={isTranslating}
                onTranslate={translate}
                onReset={reset}
                className="mb-2"
              />

              {displayEvents.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center text-muted-foreground text-sm border border-white/5">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                  {db.noHighSeverity}
                </div>
              ) : (
                <div className="space-y-2">
                  {displayEvents.map((event, i) => (
                    <EventRow key={event.id} event={event} index={i} />
                  ))}
                </div>
              )}

              <Link href="/map" className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground hover:text-[var(--obs-teal)] transition-colors py-2 border border-dashed border-border/30 rounded-xl hover:border-[var(--obs-teal)]/30">
                {db.viewAllEvents} <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="space-y-4"
            >
              {/* Latest Briefing */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-[var(--obs-purple)]" />
                    {db.latestBriefing}
                  </h2>
                  <Link href="/briefings" className="text-xs text-[var(--obs-teal)] hover:underline flex items-center gap-1">
                    {t('common').all} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {latestBriefing ? (
                  <Link href={`/briefings/${latestBriefing.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="glass rounded-xl p-4 border border-[var(--obs-purple)]/20 hover:glass-elevated transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'radial-gradient(ellipse at top left, oklch(0.60 0.20 280 / 0.06), transparent 70%)' }}
                      />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30 text-[10px] font-bold">{db.dailyBrief}</Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(latestBriefing.briefing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-[var(--obs-purple)] transition-colors mb-2 leading-snug">
                          {latestBriefing.title}
                        </div>
                        {latestBriefing.executive_summary && (
                          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                            {latestBriefing.executive_summary}
                          </p>
                        )}
                        <div className="mt-3 text-xs text-[var(--obs-teal)] flex items-center gap-1 group-hover:gap-2 transition-all">
                          {db.readFullBriefing} <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <Link href="/briefings?generate=world">
                    <div className="glass rounded-xl p-4 border border-[var(--obs-purple)]/15 hover:glass-elevated transition-all cursor-pointer text-center">
                      <Brain className="w-8 h-8 text-[var(--obs-purple)]/30 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">{db.generateToday}</div>
                      <div className="text-xs text-[var(--obs-teal)] mt-1 flex items-center justify-center gap-1">
                        {db.generateNow} <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Region Risk */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
                    {db.regionRisk}
                  </h2>
                </div>
                <div className="glass rounded-xl p-4 border border-white/5 space-y-3">
                  {REGION_RISK_DATA.map((region, i) => (
                    <motion.div
                      key={region.region}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground truncate">{region.region}</span>
                          <span className={cn(
                            'text-xs font-mono font-bold ml-2',
                            region.score >= 80 ? 'text-red-400' :
                            region.score >= 60 ? 'text-orange-400' :
                            region.score >= 40 ? 'text-yellow-400' : 'text-green-400'
                          )}>
                            {region.score}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${region.score}%` }}
                            transition={{ delay: 0.4 + i * 0.06, duration: 0.8, ease: 'easeOut' }}
                            className={cn(
                              'h-full rounded-full',
                              region.score >= 80 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                              region.score >= 60 ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                              region.score >= 40 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                              'bg-gradient-to-r from-green-600 to-green-400'
                            )}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 flex-shrink-0 font-mono">
                        {region.active}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[var(--obs-teal)]" />
                  {db.quickActions}
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: '/briefings?generate=world', icon: Brain,  label: briefings.generate, color: 'var(--obs-purple)' },
                    { href: '/map',                      icon: Map,    label: db.openWorldMap,    color: 'var(--obs-teal)' },
                    { href: '/alerts',                   icon: Bell,   label: db.alertRules,      color: 'var(--obs-amber)' },
                    { href: '/conflicts',                icon: Sword,  label: nav.conflicts,      color: 'var(--obs-red)' },
                  ].map(({ href, icon: Icon, label, color }) => (
                    <Link key={href} href={href}>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="glass rounded-xl p-3 border border-white/5 hover:glass-elevated transition-all cursor-pointer flex flex-col items-center gap-1.5 text-center"
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                        <span className="text-[11px] text-muted-foreground">{label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
