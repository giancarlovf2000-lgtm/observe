import { createClient } from '@/lib/supabase/server'

// Translates an array of text strings to the target language using Perplexity
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { texts, language } = await req.json() as { texts: string[]; language: string }

  if (!texts?.length || language === 'en') {
    return Response.json({ translations: texts })
  }

  const apiKey = process.env.PERPLEXITY_API_KEY
  if (!apiKey) return Response.json({ translations: texts })

  const prompt = `Translate the following texts to Spanish. Return ONLY a JSON array of translated strings in the same order, no explanation.

Texts:
${JSON.stringify(texts)}`

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  })

  if (!res.ok) return Response.json({ translations: texts })

  const data = await res.json()
  const raw  = data.choices?.[0]?.message?.content ?? '[]'

  try {
    // Extract JSON array from response
    const match = raw.match(/\[[\s\S]*\]/)
    const translations = match ? JSON.parse(match[0]) : texts
    return Response.json({ translations })
  } catch {
    return Response.json({ translations: texts })
  }
}
