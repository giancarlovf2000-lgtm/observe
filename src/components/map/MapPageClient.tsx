'use client'

import { useQueryClient } from '@tanstack/react-query'
import { ObserveMap } from './ObserveMap'
import { FilterSidebar } from './controls/FilterSidebar'
import { IntelDrawer } from './controls/IntelDrawer'
import { TimelineStrip } from './controls/TimelineStrip'
import { useRealtimeFeed } from '@/hooks/useRealtimeFeed'

export function MapPageClient() {
  const queryClient = useQueryClient()

  // Invalidate map + timeline caches when new events arrive via realtime
  useRealtimeFeed({
    onEvent: () => {
      queryClient.invalidateQueries({ queryKey: ['map-events'] })
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] })
    },
  })

  return (
    <div className="relative flex h-full overflow-hidden">
      {/* Left filter sidebar */}
      <FilterSidebar />

      {/* Full-screen map */}
      <div className="flex-1 relative">
        <ObserveMap />

        {/* Bottom timeline strip */}
        <TimelineStrip />
      </div>

      {/* Right intelligence drawer */}
      <IntelDrawer />
    </div>
  )
}
