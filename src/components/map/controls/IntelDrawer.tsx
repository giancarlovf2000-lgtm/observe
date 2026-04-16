'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ExternalLink, Clock, MapPin, Tag, Brain,
  AlertTriangle, FileText, TrendingUp, BookmarkPlus, Share2
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { useMapStore } from '@/store/mapStore'
import { useUIStore } from '@/store/uiStore'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useT } from '@/hooks/useT'
import type { AnyEvent } from '@/types'

const EVENT_TYPE_LABEL_KEYS: Record<string, string> = {
  conflict:     'typeConflict',
  news:         'typeNews',
  weather:      'typeWeather',
  market:       'typeMarket',
  political:    'typePolitical',
  humanitarian: 'typeHumanitarian',
  flight:       'typeFlight',
  vessel:       'typeVessel',
}

async function fetchEventDetail(id: string) {
  const res = await fetch(`/api/events/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export function IntelDrawer() {
  const { selectedEvent, setSelectedEvent } = useMapStore()
  const { intelDrawerOpen, closeIntelDrawer, intelTab, setIntelTab } = useUIStore()
  const isMobile = useIsMobile()
  const { t } = useT()
  const mp = t('map')

  const { data: eventDetail, isLoading } = useQuery({
    queryKey: ['event-detail', selectedEvent?.id],
    queryFn: () => fetchEventDetail(selectedEvent!.id),
    enabled: !!selectedEvent?.id,
    staleTime: 5 * 60 * 1000,
  })

  function handleClose() {
    closeIntelDrawer()
    setSelectedEvent(null)
  }

  const event = (eventDetail ?? selectedEvent) as AnyEvent | null

  return (
    <AnimatePresence>
      {intelDrawerOpen && event && (
        <motion.div
          initial={isMobile ? { y: '100%', opacity: 1 } : { x: '100%', opacity: 0 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: '100%', opacity: 1 } : { x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={cn(
            'bg-[var(--obs-surface)] flex flex-col z-20',
            isMobile
              ? 'fixed inset-x-0 bottom-0 rounded-t-2xl border-t border-border/40'
              : 'w-[380px] max-w-[90vw] h-full border-l border-border/40 flex-shrink-0',
          )}
          style={isMobile ? { maxHeight: '85vh', paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' } : {}}
        >
          {/* Mobile drag handle */}
          {isMobile && (
            <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>
          )}
          {/* Header */}
          <div className="flex items-start gap-3 p-4 border-b border-border/40">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-xs font-mono border-border/50 text-muted-foreground"
                >
                  {EVENT_TYPE_LABEL_KEYS[event.type]
                    ? (mp as Record<string, string>)[EVENT_TYPE_LABEL_KEYS[event.type]]
                    : event.type.toUpperCase()}
                </Badge>
                <SeverityBadge severity={event.severity} />
              </div>
              <h2 className="text-sm font-semibold text-foreground leading-snug">
                {event.title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Meta info */}
          <div className="px-4 py-2 border-b border-border/40 flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
            </div>
            {(event.country_id || event.region) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {event.country_id ?? event.region}
              </div>
            )}
            {event.lat && event.lng && (
              <div className="text-xs text-muted-foreground font-mono">
                {event.lat.toFixed(2)}°, {event.lng.toFixed(2)}°
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={intelTab} onValueChange={setIntelTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="h-9 bg-transparent border-b border-border/40 rounded-none px-2 flex-shrink-0">
              <TabsTrigger value="overview" className="text-xs h-7 rounded-md data-[state=active]:bg-white/8">{mp.tabOverview}</TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs h-7 rounded-md data-[state=active]:bg-white/8">{mp.tabAnalysis}</TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs h-7 rounded-md data-[state=active]:bg-white/8">{mp.tabTimeline}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview" className="p-4 space-y-4 mt-0">
                {/* Summary */}
                {event.summary && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{mp.summary}</div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{event.summary}</p>
                  </div>
                )}

                {/* Tags */}
                {event.tags?.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {mp.tags}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-border/50 text-muted-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why it matters */}
                <div className="glass rounded-xl p-3 border border-[var(--obs-amber)]/15">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
                    <span className="text-xs font-semibold text-[var(--obs-amber)]">{mp.whyItMatters}</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {event.ai_summary
                      ? event.ai_summary.slice(0, 250) + (event.ai_summary.length > 250 ? '…' : '')
                      : mp.whyItMattersDefault}
                  </p>
                </div>

                {/* Source link */}
                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[var(--obs-teal)] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {mp.viewSource}
                  </a>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs border-border/50 hover:bg-white/5"
                  >
                    <BookmarkPlus className="w-3 h-3 mr-1.5" />
                    {mp.save}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs border-border/50 hover:bg-white/5"
                  >
                    <Share2 className="w-3 h-3 mr-1.5" />
                    {mp.share}
                  </Button>
                  <Link href={`/events/${event.id}`} className={cn(buttonVariants({ size: 'sm' }), 'h-7 text-xs bg-[var(--obs-teal)]/90 text-background hover:bg-[var(--obs-teal)]')}>
                    <FileText className="w-3 h-3 mr-1.5" />
                    {mp.fullReport}
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="p-4 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[var(--obs-purple)]" />
                    <span className="text-sm font-semibold text-foreground">{mp.aiAnalysis}</span>
                    <Badge className="text-xs bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30">Perplexity Sonar</Badge>
                  </div>

                  {event.ai_summary ? (
                    <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                      {event.ai_summary}
                    </div>
                  ) : (
                    <div className="glass rounded-xl p-4 text-center border border-[var(--obs-purple)]/20">
                      <Brain className="w-8 h-8 text-[var(--obs-purple)]/30 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">{mp.aiNotGenerated}</div>
                      <Button size="sm" className="mt-3 h-7 text-xs bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] hover:bg-[var(--obs-purple)]/30 border border-[var(--obs-purple)]/30">
                        {mp.generateAnalysis}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {[
                      { label: mp.strategicImplications, icon: TrendingUp },
                      { label: mp.riskAssessment, icon: AlertTriangle },
                    ].map(({ label, icon: Icon }) => (
                      <div key={label} className="glass rounded-lg p-3 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          {mp.generateForDetail} {label.toLowerCase()}.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="p-4 mt-0">
                <div className="text-xs text-muted-foreground mb-3">{mp.recentDevelopments}</div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--obs-teal)] mt-1 flex-shrink-0" />
                      <div className="w-px flex-1 bg-border/40 mt-1" />
                    </div>
                    <div className="pb-3 flex-1">
                      <div className="text-xs font-mono text-muted-foreground/60 mb-0.5">
                        {format(new Date(event.occurred_at), 'MMM d, yyyy · HH:mm')} UTC
                      </div>
                      <div className="text-xs text-foreground/80">
                        {event.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground italic py-2">
                    {mp.fullTimelineAvailable}
                  </div>
                  <Link href={`/events/${event.id}`} className={cn(buttonVariants({ size: 'sm' }), 'h-7 text-xs w-full')}>
                    {mp.viewFullTimeline}
                  </Link>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
