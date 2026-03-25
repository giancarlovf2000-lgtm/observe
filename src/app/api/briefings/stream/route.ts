import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPTS, buildBriefingPrompt, type BriefingType } from '@/lib/ai/prompts'

export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { type, context = {} } = await req.json()
  if (!SYSTEM_PROMPTS[type as BriefingType]) {
    return new Response('Invalid briefing type', { status: 400 })
  }

  const apiKey = process.env.PERPLEXITY_API_KEY
  if (!apiKey) {
    return new Response(getDemoContent(type), { status: 200, headers: { 'Content-Type': 'text/plain' } })
  }

  const perplexityRes = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[type as BriefingType] },
        { role: 'user',   content: buildBriefingPrompt(type, context) },
      ],
      max_tokens: 2000,
      temperature: 0.4,
    }),
  })

  if (!perplexityRes.ok) {
    const errText = await perplexityRes.text()
    console.error('[briefings/stream] Perplexity error:', perplexityRes.status, errText)
    return new Response(
      JSON.stringify({ error: `Perplexity API error ${perplexityRes.status}: ${errText}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Stream the SSE response, extracting only the text content
  const stream = new ReadableStream({
    async start(controller) {
      const reader  = perplexityRes.body!.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          // Perplexity streams SSE: "data: {...}\n\n" lines
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const json    = JSON.parse(data)
              const content = json.choices?.[0]?.delta?.content
              if (content) controller.enqueue(new TextEncoder().encode(content))
            } catch { /* skip malformed lines */ }
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

function getDemoContent(type: string): string {
  const demos: Record<string, string> = {
    world_daily: '**Demo Mode** — Configure PERPLEXITY_API_KEY to generate real-time AI briefings.',
    regional:    '**Demo Mode** — Regional intelligence briefing requires Perplexity API configuration.',
    country:     '**Demo Mode** — Country intelligence briefing requires Perplexity API configuration.',
    conflict:    '**Demo Mode** — Conflict analysis requires Perplexity API configuration.',
    market:      '**Demo Mode** — Market intelligence requires Perplexity API configuration.',
    watchlist:   '**Demo Mode** — Watchlist briefing requires Perplexity API configuration.',
  }
  return demos[type] ?? '**Demo Mode** — Configure PERPLEXITY_API_KEY to enable AI briefings.'
}
