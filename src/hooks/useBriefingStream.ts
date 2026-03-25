'use client'

import { useState, useCallback } from 'react'
import type { BriefingType } from '@/lib/ai/prompts'

interface UseBriefingStreamOptions {
  type: BriefingType
  context?: Record<string, unknown>
}

export function useBriefingStream({ type, context = {} }: UseBriefingStreamOptions) {
  const [content, setContent]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<Error | null>(null)

  const generate = useCallback(async () => {
    setIsLoading(true)
    setContent('')
    setError(null)

    try {
      const res = await fetch('/api/briefings/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context }),
      })

      if (!res.ok) {
        let msg = `HTTP ${res.status}`
        try {
          const j = await res.json()
          msg = j.error ?? msg
        } catch { /* ignore */ }
        throw new Error(msg)
      }

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setContent(prev => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [type, context])

  return {
    content,
    generate,
    isLoading,
    error,
    isEmpty: !content && !isLoading && !error,
  }
}
