'use client'

import { motion } from 'framer-motion'
import { Brain, Calendar, Globe2, Tag, ChevronLeft, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Briefing {
  id: string
  type: string
  title: string
  executive_summary: string | null
  full_content: string | null
  model_used: string | null
  country_id: string | null
  region: string | null
  tags: string[]
  briefing_date: string
  created_at: string
}

const BRIEFING_TYPE_COLORS: Record<string, string> = {
  world_daily: 'var(--obs-teal)',
  conflict:    'var(--obs-red)',
  regional:    'var(--obs-blue)',
  market:      'var(--obs-amber)',
  watchlist:   'var(--obs-purple)',
  country:     'var(--obs-green)',
}

function BriefingRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-2 text-sm">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />
        if (line.startsWith('## '))
          return <h2 key={i} className="text-base font-bold text-foreground mt-5 first:mt-0">{line.replace('## ', '')}</h2>
        if (line.startsWith('### '))
          return <h3 key={i} className="text-sm font-semibold text-[var(--obs-teal)] mt-4">{line.replace('### ', '')}</h3>
        if (line.startsWith('**') && line.endsWith('**'))
          return <div key={i} className="font-semibold text-foreground">{line.replace(/\*\*/g, '')}</div>
        if (line.startsWith('- ') || line.startsWith('• '))
          return (
            <div key={i} className="flex items-start gap-2 text-foreground/85">
              <span className="text-[var(--obs-teal)] mt-1.5 flex-shrink-0">›</span>
              <span>{line.replace(/^[-•] /, '')}</span>
            </div>
          )
        const boldParts = line.split(/\*\*([^*]+)\*\*/)
        if (boldParts.length > 1)
          return (
            <p key={i} className="text-foreground/85 leading-relaxed">
              {boldParts.map((part, j) =>
                j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
              )}
            </p>
          )
        return <p key={i} className="text-foreground/85 leading-relaxed">{line}</p>
      })}
    </div>
  )
}

export function BriefingDetailClient({ briefing }: { briefing: Briefing }) {
  const color = BRIEFING_TYPE_COLORS[briefing.type] || 'var(--obs-purple)'

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <a
        href="/briefings"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        All Briefings
      </a>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/5 p-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <Brain className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className="text-[10px] px-1.5 py-0"
                  style={{
                    background: `${color}20`,
                    color,
                    border: `1px solid ${color}40`,
                  }}
                >
                  {briefing.type.toUpperCase().replace('_', ' ')}
                </Badge>
                {briefing.model_used && (
                  <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">
                    {briefing.model_used}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(briefing.briefing_date), 'MMMM d, yyyy')}
                </span>
                {briefing.region && (
                  <span className="flex items-center gap-1">
                    <Globe2 className="w-3 h-3" />
                    {briefing.region}
                  </span>
                )}
                {briefing.country_id && (
                  <a
                    href={`/countries/${briefing.country_id}`}
                    className="flex items-center gap-1 hover:text-[var(--obs-teal)] transition-colors"
                  >
                    <Globe2 className="w-3 h-3" />
                    {briefing.country_id.toUpperCase()}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="border-border/30 text-muted-foreground h-8 text-xs">
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="border-border/30 text-muted-foreground h-8 text-xs">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </div>

        <h1 className="text-xl font-bold text-foreground leading-tight">{briefing.title}</h1>
      </motion.div>

      {/* Executive summary */}
      {briefing.executive_summary && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl border border-white/5 p-5"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Executive Summary
          </h2>
          <p className="text-sm text-foreground/85 leading-relaxed">{briefing.executive_summary}</p>
        </motion.div>
      )}

      {/* Full content */}
      {briefing.full_content && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-xl border border-white/5 p-6"
        >
          <BriefingRenderer content={briefing.full_content} />
        </motion.div>
      )}

      {/* Tags */}
      {briefing.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Tag className="w-3.5 h-3.5 text-muted-foreground/60" />
          {briefing.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] border-border/20 text-muted-foreground/60 px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
