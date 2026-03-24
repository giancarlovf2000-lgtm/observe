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
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { AnyEvent } from '@/types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  conflict: 'CONFLICT',
  news: 'NEWS',
  weather: 'WEATHER',
  market: 'MARKET SIGNAL',
  political: 'POLITICAL',
  humanitarian: 'HUMANITARIAN',
  flight: 'AVIATION',
  vessel: 'MARITIME',
}

async function fetchEventDetail(id: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('global_events')
    .select(`
      *,
      countries ( name, region ),
      conflict_zones ( *, conflict_updates ( * ) ),
      news_articles ( * ),
      weather_events ( * )
    `)
    .eq('id', id)
    .single()
  return data
}

export function IntelDrawer() {
  const { selectedEvent, setSelectedEvent } = useMapStore()
  const { intelDrawerOpen, closeIntelDrawer, intelTab, setIntelTab } = useUIStore()

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
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-[380px] max-w-[90vw] h-full bg-[var(--obs-surface)] border-l border-border/40 flex flex-col flex-shrink-0 z-20"
        >
          {/* Header */}
          <div className="flex items-start gap-3 p-4 border-b border-border/40">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-xs font-mono border-border/50 text-muted-foreground"
                >
                  {EVENT_TYPE_LABELS[event.type] ?? event.type.toUpperCase()}
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
              <TabsTrigger value="overview" className="text-xs h-7 rounded-md data-[state=active]:bg-white/8">Overview</TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs h-7 rounded-md data-[state=active]:bg-white/8">AI Analysis</TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs h-7 rounded-md data-[state=active]:bg-white/8">Timeline</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview" className="p-4 space-y-4 mt-0">
                {/* Summary */}
                {event.summary && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Summary</div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{event.summary}</p>
                  </div>
                )}

                {/* Tags */}
                {event.tags?.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Tags
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
                    <span className="text-xs font-semibold text-[var(--obs-amber)]">Why This Matters</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {event.ai_summary
                      ? event.ai_summary.slice(0, 250) + (event.ai_summary.length > 250 ? '…' : '')
                      : 'This event has geopolitical, humanitarian, or economic significance for the affected region and may have broader implications for trade, security, and stability.'}
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
                    View source
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
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs border-border/50 hover:bg-white/5"
                  >
                    <Share2 className="w-3 h-3 mr-1.5" />
                    Share
                  </Button>
                  <Link href={`/events/${event.id}`} className={cn(buttonVariants({ size: 'sm' }), 'h-7 text-xs bg-[var(--obs-teal)]/90 text-background hover:bg-[var(--obs-teal)]')}>
                    <FileText className="w-3 h-3 mr-1.5" />
                    Full Report
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="p-4 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[var(--obs-purple)]" />
                    <span className="text-sm font-semibold text-foreground">AI Analysis</span>
                    <Badge className="text-xs bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30">GPT-4o</Badge>
                  </div>

                  {event.ai_summary ? (
                    <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                      {event.ai_summary}
                    </div>
                  ) : (
                    <div className="glass rounded-xl p-4 text-center border border-[var(--obs-purple)]/20">
                      <Brain className="w-8 h-8 text-[var(--obs-purple)]/30 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">AI analysis not yet generated</div>
                      <Button size="sm" className="mt-3 h-7 text-xs bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] hover:bg-[var(--obs-purple)]/30 border border-[var(--obs-purple)]/30">
                        Generate Analysis
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {[
                      { label: 'Strategic Implications', icon: TrendingUp },
                      { label: 'Risk Assessment', icon: AlertTriangle },
                    ].map(({ label, icon: Icon }) => (
                      <div key={label} className="glass rounded-lg p-3 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          Generate full report for detailed {label.toLowerCase()}.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="p-4 mt-0">
                <div className="text-xs text-muted-foreground mb-3">Recent developments</div>
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
                    Full timeline available on the event detail page.
                  </div>
                  <Link href={`/events/${event.id}`} className={cn(buttonVariants({ size: 'sm' }), 'h-7 text-xs w-full')}>
                    View Full Timeline →
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
