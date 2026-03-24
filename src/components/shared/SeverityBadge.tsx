import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; className: string }> = {
  minimal: { label: 'Minimal', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
  low: { label: 'Low', className: 'bg-green-500/10 text-green-400 border-green-500/25' },
  moderate: { label: 'Moderate', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25' },
  high: { label: 'High', className: 'bg-orange-500/10 text-orange-400 border-orange-500/25' },
  critical: { label: 'Critical', className: 'bg-red-500/10 text-red-400 border-red-500/25' },
}

interface SeverityBadgeProps {
  severity: SeverityLevel
  className?: string
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border',
        config.className,
        className
      )}
    >
      <span className="w-1 h-1 rounded-full bg-current" />
      {config.label}
    </span>
  )
}
