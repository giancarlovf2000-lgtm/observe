'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Clock, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { formatDistanceToNow } from 'date-fns'
import type { SeverityLevel } from '@/types'

interface TimelineEvent {
  id: string
  type: string
  title: string
  severity: SeverityLevel
  country_id: string | null
  occurred_at: string
}

async function fetchLatestEvents(): Promise<TimelineEvent[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('global_events')
    .select('id, type, title, severity, country_id, occurred_at')
    .eq('is_active', true)
    .order('occurred_at', { ascending: false })
    .limit(12)
  return (data ?? []) as TimelineEvent[]
}

const TYPE_COLORS: Record<string, string> = {
  conflict: 'bg-red-500',
  news: 'bg-orange-500',
  weather: 'bg-blue-500',
  market: 'bg-yellow-500',
  political: 'bg-purple-500',
}

export function TimelineStrip() {
  const [clockStr, setClockStr] = useState('')
  useEffect(() => {
    const tick = () => setClockStr(new Date().toUTCString().slice(17, 25))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const { data: events = [] } = useQuery({
    queryKey: ['timeline-events'],
    queryFn: fetchLatestEvents,
    refetchInterval: 30_000,
  })

  if (events.length === 0) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-[var(--obs-surface)]/90 backdrop-blur-md border-t border-border/30 z-10 flex items-center overflow-hidden">
      {/* Label */}
      <div className="flex items-center gap-1.5 px-3 border-r border-border/30 flex-shrink-0 h-full">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--obs-teal)] animate-pulse" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider whitespace-nowrap">
          Live Feed
        </span>
      </div>

      {/* Scrolling events */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: events.length * 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-4 px-3 whitespace-nowrap"
        >
          {[...events, ...events].map((event, i) => (
            <Link
              key={`${event.id}-${i}`}
              href={`/events/${event.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_COLORS[event.type] || 'bg-gray-500'}`} />
              <span className="text-[11px] text-foreground/80">{event.title}</span>
              {event.country_id && (
                <span className="text-[10px] text-muted-foreground font-mono">[{event.country_id}]</span>
              )}
              <span className="text-[10px] text-muted-foreground/50">
                {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
              </span>
              <span className="text-muted-foreground/20">·</span>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Right: clock */}
      <div className="flex items-center gap-1.5 px-3 border-l border-border/30 flex-shrink-0 h-full">
        <Clock className="w-3 h-3 text-muted-foreground/60" />
        <span className="text-[10px] font-mono text-muted-foreground/60">
          {clockStr} UTC
        </span>
      </div>
    </div>
  )
}
