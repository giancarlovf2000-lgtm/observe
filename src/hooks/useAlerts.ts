'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  type: string
  action_url: string | null
  created_at: string
}

interface UseAlertsOptions {
  userId?: string | null
  onAlert?: (notification: Notification) => void
  enabled?: boolean
}

export function useAlerts({ userId, onAlert, enabled = true }: UseAlertsOptions = {}) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!enabled || !userId) return

    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onAlert?.(payload.new as Notification)
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId, onAlert, enabled])
}
