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

/** Per-user credentials passed at runtime (BYOK). Keys vary by adapter. */
export type AdapterCredentials = Record<string, string>

export abstract class BaseAdapter {
  abstract readonly key: string
  protected readonly credentials: AdapterCredentials

  constructor(credentials?: AdapterCredentials) {
    this.credentials = credentials ?? {}
  }

  abstract fetchRaw(): Promise<RawPayload[]>
}
