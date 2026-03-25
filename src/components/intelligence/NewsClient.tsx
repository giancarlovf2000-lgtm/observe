'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Newspaper, Clock, ExternalLink, Globe2, Search,
  TrendingUp, Zap, Tag, ChevronRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { PulseIndicator } from '@/components/shared/PulseIndicator'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

interface NewsEvent {
  id: string
  title: string
  summary: string | null
  severity: SeverityLevel
  country_id: string | null
  region: string | null
  tags: string[]
  occurred_at: string
  source_url: string | null
  news_articles: Array<{
    headline: string
    source_name: string
    source_url: string
    author: string | null
    image_url: string | null
    sentiment: number | null
    topics: string[]
    published_at: string
  }>
}

const ALL_TOPICS = ['geopolitics', 'economy', 'security', 'technology', 'disaster', 'sanctions', 'nuclear', 'elections']

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  critical: 5, high: 4, moderate: 3, low: 2, minimal: 1,
}

function sentimentColor(s: number | null | undefined): string {
  if (s == null) return 'text-muted-foreground'
  if (s > 0.1)  return 'text-green-400'
  if (s < -0.1) return 'text-red-400'
  return 'text-muted-foreground'
}

function sentimentLabel(s: number | null | undefined): string {
  if (s == null) return 'Neutral'
  if (s > 0.2)  return 'Positive'
  if (s < -0.2) return 'Negative'
  return 'Neutral'
}

// Hero card for top story
function FeaturedStory({ event }: { event: NewsEvent }) {
  const article = event.news_articles?.[0]
  return (
    <Link href={`/events/${event.id}`}>
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="relative rounded-2xl overflow-hidden border border-white/8 cursor-pointer group"
        style={{ background: 'linear-gradient(135deg, oklch(0.12 0.015 240), oklch(0.08 0.01 240))' }}
      >
        {/* Gradient overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent z-10" />

        {/* Background image if available */}
        {article?.image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-30 transition-opacity"
            style={{ backgroundImage: `url(${article.image_url})` }}
          />
        )}

        {/* Content */}
        <div className="relative z-20 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Lead Story</span>
            </div>
            <SeverityBadge severity={event.severity} />
            {(event.country_id || event.region) && (
              <Badge variant="outline" className="text-xs border-border/40 text-muted-foreground px-1.5 py-0">
                {event.country_id ?? event.region}
              </Badge>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-2 max-w-2xl group-hover:text-orange-300 transition-colors">
            {event.title}
          </h2>

          {event.summary && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 max-w-xl mb-4">
              {event.summary}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {article && (
              <span className="font-medium text-foreground/70">{article.source_name}</span>
            )}
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
            </span>
            {article?.sentiment != null && (
              <span className={cn('font-mono', sentimentColor(article.sentiment))}>
                {sentimentLabel(article.sentiment)}
              </span>
            )}
            <span className="flex items-center gap-1 text-orange-400/70 group-hover:text-orange-400 transition-colors ml-auto">
              Read full report <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

// Standard news card
function NewsCard({ event, index }: { event: NewsEvent; index: number }) {
  const article = event.news_articles?.[0]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/events/${event.id}`}>
        <div className="glass rounded-xl border border-white/5 hover:glass-elevated hover:border-orange-400/10 transition-all cursor-pointer group h-full flex flex-col overflow-hidden">
          {/* Image banner if available */}
          {article?.image_url && (
            <div
              className="h-28 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ backgroundImage: `url(${article.image_url})` }}
            />
          )}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <SeverityBadge severity={event.severity} />
              {event.country_id && (
                <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground px-1.5 py-0">
                  <Globe2 className="w-2.5 h-2.5 mr-1" />
                  {event.country_id}
                </Badge>
              )}
              {article && (
                <span className="text-[10px] text-muted-foreground/60">{article.source_name}</span>
              )}
            </div>

            <h3 className="text-sm font-semibold text-foreground group-hover:text-orange-400 transition-colors leading-snug mb-2 flex-1">
              {event.title}
            </h3>

            {event.summary && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {event.summary}
              </p>
            )}

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/10">
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] text-muted-foreground/50 border border-border/20 rounded px-1 py-0">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground/50 font-mono flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function NewsClient({ events }: { events: NewsEvent[] }) {
  const [search, setSearch]           = useState('')
  const [activeTopic, setActiveTopic] = useState<string | null>(null)

  // Sort by severity then recency
  const sorted = [...events].sort((a, b) => {
    const sd = (SEVERITY_ORDER[b.severity] ?? 0) - (SEVERITY_ORDER[a.severity] ?? 0)
    if (sd !== 0) return sd
    return new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  })

  const filtered = sorted.filter((e) => {
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.summary?.toLowerCase().includes(search.toLowerCase())
    const matchTopic = !activeTopic || e.tags.includes(activeTopic)
    return matchSearch && matchTopic
  })

  const [featured, ...rest] = filtered

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-orange-400" />
            News Intelligence
          </h1>
          <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <PulseIndicator color="orange" />
            <span>{events.length} geolocated stories</span>
          </div>
        </div>
        <Link href="/map" className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--obs-teal)] hover:underline flex-shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          View on map
        </Link>
      </div>

      {/* Search + topic filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search news…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background/50 border-border/50 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border transition-all',
                activeTopic === topic
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                  : 'border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-muted-foreground text-sm"
          >
            <Newspaper className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
            No news events match your filters
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Featured lead story */}
            {featured && !search && !activeTopic && (
              <FeaturedStory event={featured} />
            )}

            {/* News grid */}
            <div>
              {(!search && !activeTopic) && rest.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    More Stories
                  </h2>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(search || activeTopic ? filtered : rest).map((event, i) => (
                  <NewsCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
