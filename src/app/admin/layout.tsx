import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Shield, Database, Users, Activity, BarChart3, ChevronLeft } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin',           label: 'Overview',    icon: BarChart3 },
  { href: '/admin/users',     label: 'Users',       icon: Users },
  { href: '/admin/sources',   label: 'Data Sources', icon: Database },
  { href: '/admin/ingestion', label: 'Ingestion',   icon: Activity },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as { role?: string } | null)?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Admin sidebar */}
      <div className="w-52 flex-shrink-0 border-r border-border/20 bg-surface/50 flex flex-col">
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[var(--obs-red)]" />
            <span className="text-sm font-bold text-foreground">Admin Portal</span>
          </div>
          <p className="text-[10px] text-muted-foreground">System administration</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-3 border-t border-border/20">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Platform
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
