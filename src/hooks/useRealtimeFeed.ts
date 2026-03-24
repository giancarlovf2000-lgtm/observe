'use client'

import { useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface LiveEvent {
  id: string
  type: string
  title: string
  severity: string
  country_id: string | null
  lat: number | null
  lng: number | null
  occurred_at: string
}

interface UseRealtimeFeedOptions {
  onEvent?: (event: LiveEvent) => void
  maxEvents?: number
  enabled?: boolean
}

export function useRealtimeFeed({
  onEvent,
  maxEvents = 100,
  enabled = true,
}: UseRealtimeFeedOptions = {}) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  const subscribe = useCallback(() => {
    if (!enabled) return

    const channel = supabase
      .channel('global_events_live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'global_events',
        },
        (payload) => {
          const event = payload.new as LiveEvent
          onEvent?.(event)
        }
      )
      .subscribe()

    channelRef.current = channel
  }, [supabase, onEvent, enabled])

  useEffect(() => {
    subscribe()
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [subscribe, supabase])

  return { maxEvents }
}
