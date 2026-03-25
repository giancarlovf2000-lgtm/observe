import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

// Perplexity sonar (fast 8B model) for lightweight enrichment tasks
function getPerplexity() {
  return createOpenAI({
    apiKey:  process.env.PERPLEXITY_API_KEY ?? '',
    baseURL: 'https://api.perplexity.ai',
  })
}

export interface EnrichmentResult {
  ai_summary:       string
  ai_tags:          string[]
  implied_severity: 'minimal' | 'low' | 'moderate' | 'high' | 'critical'
}

export async function enrichEvent(title: string, body: string | null): Promise<EnrichmentResult | null> {
  if (!process.env.PERPLEXITY_API_KEY) return null

  try {
    const perplexity = getPerplexity()
    const { text } = await generateText({
      model: perplexity('sonar'),
      messages: [
        {
          role: 'system',
          content: 'You are an intelligence analyst. Respond ONLY with a valid JSON object, no markdown fences, no explanation.',
        },
        {
          role: 'user',
          content: `Analyze this intelligence event and return JSON with exactly these keys:
- "ai_summary": string (1-2 sentence neutral factual summary)
- "ai_tags": string[] (3-6 lowercase hyphenated topic tags)
- "implied_severity": one of "minimal"|"low"|"moderate"|"high"|"critical"

Title: ${title}
${body ? `Content: ${body.slice(0, 800)}` : ''}`,
        },
      ],
    })

    // Extract JSON from response (may have surrounding text)
    const match = text.match(/\{[\s\S]*?\}/)
    if (!match) return null

    const parsed = JSON.parse(match[0])
    if (
      typeof parsed.ai_summary !== 'string' ||
      !Array.isArray(parsed.ai_tags) ||
      !['minimal', 'low', 'moderate', 'high', 'critical'].includes(parsed.implied_severity)
    ) return null

    return {
      ai_summary:       parsed.ai_summary,
      ai_tags:          parsed.ai_tags.slice(0, 6).map(String),
      implied_severity: parsed.implied_severity,
    }
  } catch {
    return null
  }
}
