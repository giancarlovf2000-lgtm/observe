import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const EnrichmentSchema = z.object({
  ai_summary: z.string().describe('1-2 sentence neutral summary of the event'),
  ai_tags: z.array(z.string()).describe('3-6 relevant topic tags'),
  implied_severity: z.enum(['minimal', 'low', 'moderate', 'high', 'critical']).describe('Severity assessment'),
})

export type EnrichmentResult = z.infer<typeof EnrichmentSchema>

export async function enrichEvent(title: string, body: string | null): Promise<EnrichmentResult | null> {
  if (!process.env.OPENAI_API_KEY) return null

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: EnrichmentSchema,
      prompt: `Analyze this intelligence event and provide enrichment:

Title: ${title}
${body ? `Content: ${body.slice(0, 1000)}` : ''}

Provide:
1. A concise, factual 1-2 sentence summary
2. 3-6 relevant topic tags (lowercase, hyphenated)
3. Severity assessment based on geopolitical impact`,
    })
    return object
  } catch {
    return null
  }
}
