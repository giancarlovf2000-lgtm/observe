'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Newspaper, Clock, ExternalLink, Globe2, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
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

export function NewsClient({ events }: { events: NewsEvent[] }) {
  const [search, setSearch] = useState('')
  const [activeTopic, setActiveTopic] = useState<string | null>(null)

  const filtered = events.filter((e) => {
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.summary?.toLowerCase().includes(search.toLowerCase())
    const matchTopic = !activeTopic || e.tags.includes(activeTopic)
    return matchSearch && matchTopic
  })

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-orange-400" />
            News Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{events.length} geolocated stories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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
                'text-xs px-2.5 py-1 rounded-full border transition-colors',
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

      {/* News grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((event, i) => {
          const article = event.news_articles?.[0]
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/events/${event.id}`}>
                <div className="glass rounded-xl p-4 border border-white/5 hover:glass-elevated transition-all cursor-pointer group h-full">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <SeverityBadge severity={event.severity} />
                    {event.country_id && (
                      <Badge variant="outline" className="text-xs border-border/40 text-muted-foreground px-1.5 py-0">
                        <Globe2 className="w-2.5 h-2.5 mr-1" />
                        {event.country_id}
                      </Badge>
                    )}
                    {article && (
                      <span className="text-xs text-muted-foreground">{article.source_name}</span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-foreground group-hover:text-orange-400 transition-colors leading-snug mb-2">
                    {event.title}
                  </h3>

                  {event.summary && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {event.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] border-border/30 text-muted-foreground/70 px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60 font-mono">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                    </div>
                  </div>

                  {article?.source_url && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[var(--obs-teal)]/70">
                      <ExternalLink className="w-3 h-3" />
                      {article.source_name}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No news events match your filters
        </div>
      )}
    </div>
  )
}
