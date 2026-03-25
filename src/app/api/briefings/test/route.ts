import { createClient } from '@/lib/supabase/server'

// Temporary debug endpoint — tests Perplexity API directly (no streaming)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  if (!process.env.PERPLEXITY_API_KEY) {
    return Response.json({ error: 'PERPLEXITY_API_KEY not set' }, { status: 422 })
  }

  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
        max_tokens: 50,
      }),
    })

    const body = await res.json()
    return Response.json({ status: res.status, ok: res.ok, body })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
