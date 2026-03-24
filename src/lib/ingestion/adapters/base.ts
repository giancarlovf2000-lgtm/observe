export interface RawPayload {
  external_id: string
  title: string
  body?: string | null
  summary?: string | null
  lat?: number | null
  lng?: number | null
  country_code?: string | null
  region?: string | null
  tags?: string[]
  occurred_at?: string
  metadata?: Record<string, unknown>
}

export abstract class BaseAdapter {
  abstract readonly key: string
  abstract fetchRaw(): Promise<RawPayload[]>
}
