import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPTS, buildBriefingPrompt, type BriefingType } from '@/lib/ai/prompts'

export async function POST(req: Request) {
  // Verify authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { type, context = {} } = await req.json()

  if (!SYSTEM_PROMPTS[type as BriefingType]) {
    return new Response('Invalid briefing type', { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    // Return demo text when API key not configured
    return new Response(
      JSON.stringify({
        error: 'OpenAI API key not configured',
        demo: getDemoContent(type),
      }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const result = await streamText({
    model: openai('gpt-4o'),
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
}

function getDemoContent(type: string): string {
  const demos: Record<string, string> = {
    world_daily: '**Demo Mode** — Configure your OpenAI API key to generate real AI briefings.\n\nThis is a demonstration of the OBSERVE intelligence briefing system. Once configured, GPT-4o will analyze current global events and generate comprehensive situational briefings in real time.',
    regional: '**Demo Mode** — Regional intelligence briefing requires OpenAI API configuration.',
    country: '**Demo Mode** — Country intelligence briefing requires OpenAI API configuration.',
    conflict: '**Demo Mode** — Conflict analysis requires OpenAI API configuration.',
    market: '**Demo Mode** — Market intelligence requires OpenAI API configuration.',
  }
  return demos[type] ?? '**Demo Mode** — Configure OpenAI API key to enable AI briefings.'
}
