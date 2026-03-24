import { createHash } from 'crypto'

export function hashDedup(sourceId: string, externalId: string): string {
  return createHash('sha256')
    .update(`${sourceId}:${externalId}`)
    .digest('hex')
    .slice(0, 32)
}

export async function filterNew(
  supabase: ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>,
  sourceId: string,
  externalIds: string[]
): Promise<Set<string>> {
  if (externalIds.length === 0) return new Set()

  const { data: existing } = await supabase
    .from('global_events')
    .select('external_id')
    .eq('source_id', sourceId)
    .in('external_id', externalIds)

  const existingIds = new Set((existing ?? []).map(r => r.external_id))
  return new Set(externalIds.filter(id => !existingIds.has(id)))
}
