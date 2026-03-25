'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Play, Clock, Globe2, Sword, TrendingUp, Map, Bookmark, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBriefingStream } from '@/hooks/useBriefingStream'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { BriefingType } from '@/lib/ai/prompts'

const BRIEFING_TYPES: Array<{
  type: BriefingType
  label: string
  icon: React.ElementType
  description: string
  color: string
}> = [
  { type: 'world_daily', label: 'World Daily', icon: Globe2, description: 'Top global developments across all domains', color: 'var(--obs-teal)' },
  { type: 'conflict', label: 'Conflict Analysis', icon: Sword, description: 'Active conflict briefing for selected region', color: 'var(--obs-red)' },
  { type: 'regional', label: 'Regional Brief', icon: Map, description: 'Comprehensive regional situational analysis', color: 'var(--obs-blue)' },
  { type: 'market', label: 'Market Intelligence', icon: TrendingUp, description: 'FX, crypto, and macro market signals', color: 'var(--obs-amber)' },
  { type: 'watchlist', label: 'Watchlist Brief', icon: Bookmark, description: 'Personalized brief on your saved items', color: 'var(--obs-purple)' },
]

interface SavedBriefing {
  id: string
  type: string
  title: string
  executive_summary: string | null
  briefing_date: string
  created_at: string
  region: string | null
  country_id: string | null
  tags: string[]
}

function BriefingRenderer({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-3 text-sm">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />

        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-base font-bold text-foreground mt-4 first:mt-0">
              {line.replace('## ', '')}
            </h2>
          )
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="text-sm font-semibold text-[var(--obs-teal)] mt-3">
              {line.replace('### ', '')}
            </h3>
          )
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={i} className="font-semibold text-foreground">
              {line.replace(/\*\*/g, '')}
            </div>
          )
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} className="flex items-start gap-2 text-foreground/85">
              <span className="text-[var(--obs-teal)] mt-1.5 flex-shrink-0">›</span>
              <span>{line.replace(/^[-•] /, '')}</span>
            </div>
          )
        }
        // Bold inline formatting
        const boldParts = line.split(/\*\*([^*]+)\*\*/)
        if (boldParts.length > 1) {
          return (
            <p key={i} className="text-foreground/85 leading-relaxed">
              {boldParts.map((part, j) =>
                j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
              )}
            </p>
          )
        }
        return (
          <p key={i} className="text-foreground/85 leading-relaxed">{line}</p>
        )
      })}
    </div>
  )
}

function LiveBriefingPanel() {
  const [selectedType, setSelectedType] = useState<BriefingType>('world_daily')
  const { content, generate, isLoading, isEmpty } = useBriefingStream({
    type: selectedType,
  })

  return (
    <div className="glass rounded-2xl border border-[var(--obs-purple)]/20 overflow-hidden">
      {/* Type selector */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-[var(--obs-purple)]" />
          <span className="text-sm font-semibold text-foreground">Generate AI Briefing</span>
          <Badge className="text-xs bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30">Perplexity Sonar</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {BRIEFING_TYPES.map((bt) => (
            <button
              key={bt.type}
              onClick={() => setSelectedType(bt.type)}
              className={cn(
                'flex flex-col items-start gap-1 p-2.5 rounded-lg border transition-all text-left',
                selectedType === bt.type
                  ? 'border-[var(--obs-purple)]/40 bg-[var(--obs-purple)]/10'
                  : 'border-border/30 hover:border-border/60 hover:bg-white/3'
              )}
            >
              <bt.icon className="w-4 h-4" style={{ color: bt.color }} />
              <span className="text-xs font-medium text-foreground">{bt.label}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{bt.description}</span>
            </button>
          ))}
        </div>
        <Button
          onClick={generate}
          disabled={isLoading}
          className="mt-3 bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] hover:bg-[var(--obs-purple)]/30 border border-[var(--obs-purple)]/30 h-9"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</>
          ) : (
            <><Play className="w-4 h-4 mr-2" />Generate Briefing</>
          )}
        </Button>
      </div>

      {/* Content area */}
      <div className="p-5 min-h-[200px]">
        {isEmpty && !isLoading && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Brain className="w-10 h-10 opacity-20 mb-3" />
            <p className="text-sm">Select a briefing type and click Generate</p>
          </div>
        )}
        {isLoading && !content && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing global events…</span>
          </div>
        )}
        {content && <BriefingRenderer content={content} />}
        {isLoading && content && (
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground/60 text-xs">
            <div className="w-1 h-4 bg-[var(--obs-purple)] animate-blink rounded-sm" />
          </div>
        )}
      </div>
    </div>
  )
}

export function BriefingsClient({ savedBriefings }: { savedBriefings: SavedBriefing[] }) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-[var(--obs-purple)]" />
          Intelligence Briefings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI-generated situational analysis powered by Perplexity Sonar Pro
        </p>
      </div>

      {/* Live briefing generator */}
      <LiveBriefingPanel />

      {/* Saved briefings */}
      {savedBriefings.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            Recent Briefings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedBriefings.map((briefing, i) => (
              <motion.div
                key={briefing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <a href={`/briefings/${briefing.id}`}>
                  <div className="glass rounded-xl p-4 border border-white/5 hover:glass-elevated transition-all cursor-pointer group">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="text-xs bg-[var(--obs-purple)]/15 text-[var(--obs-purple)] border-[var(--obs-purple)]/25">
                        {briefing.type.toUpperCase().replace('_', ' ')}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        {format(new Date(briefing.briefing_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-[var(--obs-purple)] transition-colors mb-2">
                      {briefing.title}
                    </h3>
                    {briefing.executive_summary && (
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {briefing.executive_summary}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {briefing.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] border-border/30 text-muted-foreground/70 px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
