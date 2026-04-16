import { createAdminClient } from '@/lib/supabase/admin'
import { normalize } from './normalizer'
import { filterNew } from './deduplicator'
import type { BaseAdapter } from './adapters/base'
import type { Json, IngestionStatus, AssetClass } from '@/types/database'

interface PipelineResult {
  fetched: number
  inserted: number
  skipped: number
  errors: string[]
}

export async function runIngestionPipeline(
  adapter: BaseAdapter,
  sourceSlug: string,
  userId?: string
): Promise<PipelineResult> {
  const supabase = createAdminClient()
  const result: PipelineResult = { fetched: 0, inserted: 0, skipped: 0, errors: [] }

  // Look up the source ID
  const { data: source } = await supabase
    .from('data_sources')
    .select('id, is_active')
    .eq('slug', sourceSlug)
    .single()

  if (!source?.is_active) {
    result.errors.push(`Source ${sourceSlug} is inactive or not found`)
    return result
  }

  const sourceId = source.id

  // Start an ingestion run
  const { data: run } = await supabase
    .from('ingestion_runs')
    .insert({ source_id: sourceId, status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single()

  const runId = run?.id

  try {
    // Fetch raw data
    const raw = await adapter.fetchRaw()
    result.fetched = raw.length

    if (raw.length === 0) {
      await finishRun(supabase, runId, 'success', result)
      return result
    }

    // Normalize all events
    const normalized = raw.map(r => normalize(r, sourceId))

    // Handle flight tracks separately (upsert by icao24)
    const flightEvents = normalized.filter(e => e.is_flight)
    if (flightEvents.length > 0) {
      const flightRows = flightEvents.map(e => ({
        icao24: e.flight_data!.icao24,
        callsign: e.flight_data!.callsign || '',
        lat: e.lat ?? 0,
        lng: e.lng ?? 0,
        altitude_ft: e.flight_data!.altitude_ft,
        speed_kts: e.flight_data!.speed_kts,
        heading: e.flight_data!.heading,
        on_ground: e.flight_data!.on_ground,
        track_at: e.occurred_at,
      }))
      const { error } = await supabase
        .from('flight_tracks')
        .upsert(flightRows, { onConflict: 'icao24', ignoreDuplicates: false })
      if (error) result.errors.push(`Flight tracks: ${error.message}`)
      result.inserted += flightEvents.length
    }

    // Handle price ticks separately
    const priceEvents = normalized.filter(e => e.is_price_tick)
    if (priceEvents.length > 0) {
      for (const event of priceEvents) {
        if (!event.price_tick_data) continue
        const meta = event.metadata ?? {}
        const symbol = event.price_tick_data.symbol
        const VALID_CLASSES: AssetClass[] = ['currency', 'crypto', 'commodity', 'index', 'equity']
        const rawClass = String(meta.asset_class ?? (symbol.includes('/') ? 'currency' : 'crypto'))
        const assetClass: AssetClass = VALID_CLASSES.includes(rawClass as AssetClass)
          ? (rawClass as AssetClass)
          : 'crypto'
        const name = String(meta.name ?? meta.coin_id ?? symbol)

        // Upsert the asset (creates on first run, updates on subsequent)
        const { data: asset, error: upsertErr } = await supabase
          .from('market_assets')
          .upsert(
            { symbol, name, asset_class: assetClass, is_active: true },
            { onConflict: 'symbol', ignoreDuplicates: false }
          )
          .select('id')
          .single()

        if (upsertErr || !asset) {
          result.errors.push(`Asset upsert ${symbol}: ${upsertErr?.message ?? 'no data'}`)
          continue
        }

        const { error: tickErr } = await supabase.from('price_ticks').insert({
          asset_id: asset.id,
          price: event.price_tick_data.price,
          change_pct: event.price_tick_data.change_pct,
          volume_24h: event.price_tick_data.volume,
          market_cap: event.price_tick_data.market_cap,
          tick_at: event.occurred_at,
        })
        if (tickErr) {
          result.errors.push(`Price tick ${symbol}: ${tickErr.message}`)
        } else {
          result.inserted++
        }
      }
    }

    // Handle regular events (not flights, not price ticks)
    const regularEvents = normalized.filter(e => !e.is_flight && !e.is_price_tick)
    if (regularEvents.length > 0) {
      const externalIds = regularEvents.map(e => e.external_id)
      const newIds = await filterNew(supabase, sourceId, externalIds)
      result.skipped += regularEvents.length - newIds.size

      const toInsert = regularEvents.filter(e => newIds.has(e.external_id))
      if (toInsert.length > 0) {
        const rows = toInsert.map(e => ({
          type: e.type,
          title: e.title,
          summary: e.summary,
          body: e.body,
          severity: e.severity,
          country_id: e.country_id,
          region: e.region,
          lat: e.lat,
          lng: e.lng,
          source_id: sourceId,
          external_id: e.external_id,
          tags: e.tags,
          metadata: e.metadata as Json,
          occurred_at: e.occurred_at,
          is_active: true,
          ...(userId ? { user_id: userId } : {}),
        }))

        const { data: inserted, error } = await supabase
          .from('global_events')
          .insert(rows)
          .select('id')

        if (error) {
          result.errors.push(`Events insert: ${error.message}`)
        } else {
          result.inserted += inserted?.length ?? 0
        }
      }
    }

    // Update source last_fetched_at
    await supabase
      .from('data_sources')
      .update({ last_fetched_at: new Date().toISOString() })
      .eq('id', sourceId)

    await finishRun(supabase, runId, result.errors.length > 0 ? 'partial' : 'success', result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    result.errors.push(msg)
    await finishRun(supabase, runId, 'failed', result, msg)
  }

  return result
}

async function finishRun(
  supabase: ReturnType<typeof createAdminClient>,
  runId: string | undefined,
  status: IngestionStatus,
  result: PipelineResult,
  errorMessage?: string
) {
  if (!runId) return
  await supabase
    .from('ingestion_runs')
    .update({
      status,
      records_fetched: result.fetched,
      records_inserted: result.inserted,
      records_skipped: result.skipped,
      error_message: errorMessage ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq('id', runId)
}
