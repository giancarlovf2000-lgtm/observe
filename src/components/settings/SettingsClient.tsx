'use client'

import { useState } from 'react'
import { Settings, User, Bell, Shield, Globe2, Palette, LogOut, Save, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

import type { Json } from '@/types/database'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  tier: string | null
  preferences: Json | null
}

type Section = 'profile' | 'notifications' | 'display' | 'security' | 'regions'

const SECTIONS: Array<{ id: Section; label: string; icon: React.ElementType }> = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'display',       label: 'Display',        icon: Palette },
  { id: 'regions',       label: 'Regions',        icon: Globe2 },
  { id: 'security',      label: 'Security',       icon: Shield },
]

const REGIONS = [
  'North America', 'South America', 'Europe', 'Middle East',
  'Africa', 'Central Asia', 'East Asia', 'Southeast Asia',
  'South Asia', 'Oceania', 'Arctic', 'Antarctic',
]

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <Icon className="w-4 h-4 text-[var(--obs-teal)]" />
        {title}
      </h2>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  )
}

function ToggleRow({ label, description, value, onChange }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/10 last:border-0">
      <div>
        <div className="text-sm text-foreground">{label}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'relative w-10 h-5 rounded-full transition-all flex-shrink-0',
          value ? 'bg-[var(--obs-teal)]' : 'bg-border/40'
        )}
      >
        <div className={cn(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
          value ? 'left-5' : 'left-0.5'
        )} />
      </button>
    </div>
  )
}

export function SettingsClient({
  profile,
  user,
}: {
  profile: Profile | null
  user: { email: string }
}) {
  const [section, setSection] = useState<Section>('profile')
  const [saved, setSaved] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    notify_critical:   ((profile?.preferences as Record<string, unknown> | null)?.notify_critical as boolean) ?? true,
    notify_conflict:   ((profile?.preferences as Record<string, unknown> | null)?.notify_conflict as boolean) ?? true,
    notify_market:     ((profile?.preferences as Record<string, unknown> | null)?.notify_market as boolean) ?? false,
    notify_weather:    ((profile?.preferences as Record<string, unknown> | null)?.notify_weather as boolean) ?? true,
    notify_digest:     ((profile?.preferences as Record<string, unknown> | null)?.notify_digest as boolean) ?? true,
    compact_view:      ((profile?.preferences as Record<string, unknown> | null)?.compact_view as boolean) ?? false,
    show_coordinates:  ((profile?.preferences as Record<string, unknown> | null)?.show_coordinates as boolean) ?? false,
    auto_refresh:      ((profile?.preferences as Record<string, unknown> | null)?.auto_refresh as boolean) ?? true,
  })
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    ((profile?.preferences as Record<string, unknown> | null)?.regions as string[]) ?? []
  )
  const supabase = createClient()

  function togglePref(key: string) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleRegion(r: string) {
    setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])
  }

  async function save() {
    if (!profile) return
    await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        preferences: { ...prefs, regions: selectedRegions },
      })
      .eq('id', profile.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const tierColors: Record<string, string> = {
    free:       'var(--obs-teal)',
    pro:        'var(--obs-purple)',
    enterprise: 'var(--obs-amber)',
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account, notifications, and platform preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Nav */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left',
                  section === s.id
                    ? 'bg-[var(--obs-teal)]/10 text-[var(--obs-teal)] border border-[var(--obs-teal)]/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <s.icon className="w-4 h-4 flex-shrink-0" />
                {s.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-border/20">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 glass rounded-xl border border-white/5 p-6">

          {section === 'profile' && (
            <div>
              <SectionHeader icon={User} title="Profile" description="Your account information and tier" />
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 glass rounded-xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-[var(--obs-purple)]/20 border border-[var(--obs-purple)]/30 flex items-center justify-center text-lg font-bold text-[var(--obs-purple)]">
                    {(fullName || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{fullName || user.email}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className="text-[10px] px-1.5 py-0"
                        style={{
                          background: `${tierColors[profile?.tier ?? 'free']}20`,
                          color: tierColors[profile?.tier ?? 'free'],
                          border: `1px solid ${tierColors[profile?.tier ?? 'free']}40`,
                        }}
                      >
                        {(profile?.tier ?? 'free').toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">
                        {profile?.role ?? 'user'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
                  <input
                    className="w-full bg-surface rounded-lg border border-border/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--obs-teal)]/50"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                  <input
                    disabled
                    className="w-full bg-surface/50 rounded-lg border border-border/20 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                    value={user.email}
                  />
                </div>
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div>
              <SectionHeader icon={Bell} title="Notifications" description="Control what events trigger alerts" />
              <div className="space-y-1">
                <ToggleRow label="Critical severity events" description="Immediate notification for critical events" value={prefs.notify_critical} onChange={() => togglePref('notify_critical')} />
                <ToggleRow label="Conflict updates" description="New developments in active conflicts" value={prefs.notify_conflict} onChange={() => togglePref('notify_conflict')} />
                <ToggleRow label="Market alerts" description="Significant FX and crypto movements" value={prefs.notify_market} onChange={() => togglePref('notify_market')} />
                <ToggleRow label="Weather emergencies" description="Critical weather events and disasters" value={prefs.notify_weather} onChange={() => togglePref('notify_weather')} />
                <ToggleRow label="Daily briefing digest" description="Morning intelligence summary email" value={prefs.notify_digest} onChange={() => togglePref('notify_digest')} />
              </div>
            </div>
          )}

          {section === 'display' && (
            <div>
              <SectionHeader icon={Palette} title="Display" description="Customize your platform experience" />
              <div className="space-y-1">
                <ToggleRow label="Compact view" description="Smaller cards and denser layouts" value={prefs.compact_view} onChange={() => togglePref('compact_view')} />
                <ToggleRow label="Show coordinates" description="Display lat/lng on event cards" value={prefs.show_coordinates} onChange={() => togglePref('show_coordinates')} />
                <ToggleRow label="Auto-refresh data" description="Automatically refresh live feeds every 60s" value={prefs.auto_refresh} onChange={() => togglePref('auto_refresh')} />
              </div>
            </div>
          )}

          {section === 'regions' && (
            <div>
              <SectionHeader icon={Globe2} title="Regions of Interest" description="Select regions to prioritize in your feed and briefings" />
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => toggleRegion(r)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                      selectedRegions.includes(r)
                        ? 'border-[var(--obs-teal)]/40 bg-[var(--obs-teal)]/10 text-[var(--obs-teal)]'
                        : 'border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {selectedRegions.length > 0 && (
                <p className="text-xs text-muted-foreground mt-4">
                  {selectedRegions.length} region{selectedRegions.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {section === 'security' && (
            <div>
              <SectionHeader icon={Shield} title="Security" description="Account security settings" />
              <div className="space-y-4">
                <div className="glass rounded-xl border border-white/5 p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Password</h3>
                  <p className="text-xs text-muted-foreground mb-3">Last changed: never</p>
                  <Button variant="outline" className="border-border/30 text-sm h-8">
                    Change Password
                  </Button>
                </div>
                <div className="glass rounded-xl border border-white/5 p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Sessions</h3>
                  <p className="text-xs text-muted-foreground mb-3">You are currently signed in on this device.</p>
                  <Button
                    variant="outline"
                    onClick={signOut}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm h-8"
                  >
                    Sign out of all devices
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          {section !== 'security' && (
            <div className="mt-6 pt-4 border-t border-border/10">
              <Button
                onClick={save}
                className="bg-[var(--obs-teal)]/20 text-[var(--obs-teal)] hover:bg-[var(--obs-teal)]/30 border border-[var(--obs-teal)]/30 h-9"
              >
                {saved ? (
                  <><Check className="w-4 h-4 mr-2" />Saved</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />Save Changes</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
