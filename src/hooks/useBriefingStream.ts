'use client'

import { useCompletion } from '@ai-sdk/react'
import type { BriefingType } from '@/lib/ai/prompts'

interface UseBriefingStreamOptions {
  type: BriefingType
  context?: Record<string, unknown>
}

export function useBriefingStream({ type, context = {} }: UseBriefingStreamOptions) {
  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/briefings/stream',
    streamProtocol: 'text',
  })

  async function generate() {
    await complete('', {
      body: { type, context },
    })
  }

  return {
    content: completion,
    generate,
    isLoading,
    error,
    isEmpty: !completion && !isLoading,
  }
}
