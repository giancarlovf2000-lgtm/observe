'use client'

import { useState } from 'react'
import type { Json } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

interface AlertRule {
  id: string
  name: string
  condition: string
  parameters: Json
  channels: string[]
  is_active: boolean
  last_fired_at: string | null
  created_at: string
}

interface AlertEvent {
  id: string
  fired_at: string
  acknowledged: boolean | null
  alert_rules: { name: string } | null
  global_events: { title: string; severity: SeverityLevel; type: string } | null
}

const CONDITION_LABELS: Record<string, string> = {
  severity_threshold: 'Severity Threshold',
  country_event:      'Country Event',
  conflict_update:    'Conflict Update',
  market_move:        'Market Movement',
  keyword_match:      'Keyword Match',
}

const CHANNEL_CONFIG: Record<string, { label: string; color: string }> = {
  in_app:  { label: 'In-App',  color: 'var(--obs-teal)' },
  email:   { label: 'Email',   color: 'var(--obs-blue)' },
  webhook: { label: 'Webhook', color: 'var(--obs-purple)' },
}

function AlertRuleCard({
  rule,
  onToggle,
  onDelete,
}: {
  rule: AlertRule
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass rounded-xl border p-4 transition-all',
        rule.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
          rule.is_active
            ? 'bg-[var(--obs-amber)]/15 border border-[var(--obs-amber)]/25'
            : 'bg-muted/10 border border-border/20'
        )}>
          <Bell className="w-4 h-4" style={{ color: rule.is_active ? 'var(--obs-amber)' : undefined }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{rule.name}</span>
            {rule.is_active ? (
              <Badge className="text-[10px] bg-green-500/15 text-green-400 border-green-500/25">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">Paused</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">
              {CONDITION_LABELS[rule.condition] || rule.condition}
            </Badge>
            {rule.channels.map(ch => {
              const cfg = CHANNEL_CONFIG[ch]
              return cfg ? (
                <Badge
                  key={ch}
                  variant="outline"
                  className="text-[10px] border-border/20 px-1.5 py-0"
                  style={{ color: cfg.color, borderColor: `${cfg.color}30` }}
                >
                  {cfg.label}
                </Badge>
              ) : null
            })}
          </div>

          {rule.last_fired_at && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <Zap className="w-2.5 h-2.5 text-[var(--obs-amber)]" />
              Last fired {formatDistanceToNow(new Date(rule.last_fired_at), { addSuffix: true })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onToggle(rule.id, !rule.is_active)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            title={rule.is_active ? 'Pause rule' : 'Activate rule'}
          >
            {rule.is_active
              ? <ToggleRight className="w-4 h-4 text-[var(--obs-teal)]" />
              : <ToggleLeft className="w-4 h-4" />
            }
          </button>
          <button
            onClick={() => onDelete(rule.id)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function NewRuleModal({ onClose, onCreate }: { onClose: () => void; onCreate: (rule: Omit<AlertRule, 'id' | 'last_fired_at' | 'created_at'>) => void }) {
  const [name, setName] = useState('')
  const [condition, setCondition] = useState('severity_threshold')
  const [channels, setChannels] = useState<string[]>(['in_app'])

  function toggleChannel(ch: string) {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch])
  }

  function handleCreate() {
    if (!name.trim()) return
    onCreate({ name: name.trim(), condition, parameters: {} as Json, channels, is_active: true })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-2xl border border-white/10 p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-base font-bold text-foreground mb-4">Create Alert Rule</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Rule Name</label>
            <input
              autoFocus
              placeholder="e.g. High-severity conflict alerts"
              className="w-full bg-surface rounded-lg border border-border/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--obs-teal)]/50"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Trigger Condition</label>
            <select
              className="w-full bg-surface rounded-lg border border-border/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--obs-teal)]/50"
              value={condition}
              onChange={e => setCondition(e.target.value)}
            >
              {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Notification Channels</label>
            <div className="flex gap-2">
              {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => toggleChannel(key)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border text-xs font-medium transition-all',
                    channels.includes(key)
                      ? 'border-[var(--obs-teal)]/40 bg-[var(--obs-teal)]/10'
                      : 'border-border/30 text-muted-foreground hover:border-border/60'
                  )}
                  style={channels.includes(key) ? { color: cfg.color } : undefined}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 bg-[var(--obs-amber)]/20 text-[var(--obs-amber)] hover:bg-[var(--obs-amber)]/30 border border-[var(--obs-amber)]/30"
          >
            Create Rule
          </Button>
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function AlertsClient({
  rules: initial,
  recentAlerts,
  userId,
}: {
  rules: AlertRule[]
  recentAlerts: AlertEvent[]
  userId: string
}) {
  const [rules, setRules] = useState(initial)
  const [showModal, setShowModal] = useState(false)
  const supabase = createClient()

  async function createRule(rule: Omit<AlertRule, 'id' | 'last_fired_at' | 'created_at'>) {
    const { data } = await supabase
      .from('alert_rules')
      .insert({ ...rule, user_id: userId })
      .select()
      .single()
    if (data) setRules(prev => [data, ...prev])
  }

  async function toggleRule(id: string, active: boolean) {
    await supabase.from('alert_rules').update({ is_active: active }).eq('id', id)
    setRules(prev => prev.map(r => r.id === id ? { ...r, is_active: active } : r))
  }

  async function deleteRule(id: string) {
    await supabase.from('alert_rules').delete().eq('id', id)
    setRules(prev => prev.filter(r => r.id !== id))
  }

  const activeRules = rules.filter(r => r.is_active)
  const firedToday = recentAlerts.filter(a => {
    const fired = new Date(a.fired_at)
    const today = new Date()
    return fired.toDateString() === today.toDateString()
  }).length

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--obs-amber)]" />
            Alert Rules
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure automated alerts for events matching your intelligence priorities
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[var(--obs-amber)]/20 text-[var(--obs-amber)] hover:bg-[var(--obs-amber)]/30 border border-[var(--obs-amber)]/30 h-9"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Rules', value: activeRules.length, color: 'var(--obs-teal)' },
          { label: 'Total Rules', value: rules.length, color: 'var(--obs-blue)' },
          { label: 'Fired Today', value: firedToday, color: 'var(--obs-amber)' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 border border-white/5 text-center">
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Your Rules</h2>
          {rules.length === 0 ? (
            <div className="glass rounded-xl border border-white/5 p-10 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">No alert rules</h3>
              <p className="text-xs text-muted-foreground">
                Create a rule to get notified when specific events occur
              </p>
            </div>
          ) : (
            rules.map(rule => (
              <AlertRuleCard
                key={rule.id}
                rule={rule}
                onToggle={toggleRule}
                onDelete={deleteRule}
              />
            ))
          )}
        </div>

        {/* Recent alerts */}
        <div className="glass rounded-xl border border-white/5 overflow-hidden h-fit">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Recent Alerts</span>
          </div>
          {recentAlerts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <CheckCircle className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No alerts fired recently</p>
            </div>
          ) : (
            <div className="divide-y divide-border/10">
              {recentAlerts.slice(0, 10).map(alert => (
                <div key={alert.id} className={cn(
                  'px-4 py-3 hover:bg-white/3 transition-colors',
                  !alert.acknowledged && 'bg-[var(--obs-amber)]/3'
                )}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={cn(
                      'w-3 h-3 flex-shrink-0 mt-0.5',
                      !alert.acknowledged ? 'text-[var(--obs-amber)]' : 'text-muted-foreground/40'
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground leading-tight truncate">
                        {alert.global_events?.title || 'Unknown event'}
                      </div>
                      {alert.alert_rules && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Rule: {alert.alert_rules.name}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {alert.global_events?.severity && (
                          <SeverityBadge severity={alert.global_events.severity} />
                        )}
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {format(new Date(alert.fired_at), 'MMM d HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <NewRuleModal
            onClose={() => setShowModal(false)}
            onCreate={createRule}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
