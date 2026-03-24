import { cn } from '@/lib/utils'

interface PulseIndicatorProps {
  color?: string
  size?: 'sm' | 'md'
  className?: string
}

export function PulseIndicator({
  color = 'var(--obs-teal)',
  size = 'sm',
  className,
}: PulseIndicatorProps) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div
        className={cn('rounded-full', size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5')}
        style={{ background: color }}
      />
      <div
        className={cn(
          'absolute rounded-full animate-pulse-ring',
          size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
        )}
        style={{ background: color, opacity: 0.5 }}
      />
    </div>
  )
}
