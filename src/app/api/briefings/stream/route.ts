import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPTS, buildBriefingPrompt, type BriefingType } from '@/lib/ai/prompts'

// Perplexity uses an OpenAI-compatible API with real-time web search built in
function getPerplexity() {
  return createOpenAI({
    apiKey:  process.env.PERPLEXITY_API_KEY ?? '',
    baseURL: 'https://api.perplexity.ai',
  })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { type, context = {} } = await req.json()
  if (!SYSTEM_PROMPTS[type as BriefingType]) {
    return new Response('Invalid briefing type', { status: 400 })
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Perplexity API key not configured', demo: getDemoContent(type) }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const perplexity = getPerplexity()

  try {
    const result = await streamText({
      // sonar-pro: 70B model with real-time web search
      model: perplexity('sonar-pro'),
      system: SYSTEM_PROMPTS[type as BriefingType],
      messages: [
        {
          role: 'user',
          content: buildBriefingPrompt(type, context),
        },
      ],
      maxOutputTokens: 2000,
      temperature: 0.4,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[briefings/stream] streamText error:', msg)
    return new Response(
      JSON.stringify({ error: `AI generation failed: ${msg}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function getDemoContent(type: string): string {
  const demos: Record<string, string> = {
    world_daily: '**Demo Mode** — Configure your Perplexity API key (`PERPLEXITY_API_KEY`) to generate real-time AI briefings powered by Perplexity Sonar Pro with live web search.',
    regional:    '**Demo Mode** — Regional intelligence briefing requires Perplexity API configuration.',
    country:     '**Demo Mode** — Country intelligence briefing requires Perplexity API configuration.',
    conflict:    '**Demo Mode** — Conflict analysis requires Perplexity API configuration.',
    market:      '**Demo Mode** — Market intelligence requires Perplexity API configuration.',
    watchlist:   '**Demo Mode** — Watchlist briefing requires Perplexity API configuration.',
  }
  return demos[type] ?? '**Demo Mode** — Configure PERPLEXITY_API_KEY to enable AI briefings.'
}
