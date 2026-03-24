import { create } from 'zustand'
import { subscribeWithSelector, persist } from 'zustand/middleware'

export const ALL_LAYER_IDS = [
  'conflicts',
  'news',
  'weather',
  'flights',
  'shipping',
  'markets',
  'country_risk',
  'political',
  'disasters',
  'energy',
  'sanctions',
  'infrastructure',
  'tensions',
  'alerts',
  'watchlist',
] as const

export type LayerId = typeof ALL_LAYER_IDS[number]

interface FilterStore {
  activeLayers: Set<LayerId>
  toggleLayer: (id: LayerId) => void
  enableLayer: (id: LayerId) => void
  disableLayer: (id: LayerId) => void
  setLayers: (ids: LayerId[]) => void
  isLayerActive: (id: LayerId) => boolean

  severityMin: 'minimal' | 'low' | 'moderate' | 'high' | 'critical'
  setSeverityMin: (s: FilterStore['severityMin']) => void

  dateHours: 24 | 48 | 168 | 720  // hours of lookback
  setDateHours: (h: FilterStore['dateHours']) => void

  searchQuery: string
  setSearchQuery: (q: string) => void

  selectedRegion: string | null
  setSelectedRegion: (r: string | null) => void

  showOnlyWatchlist: boolean
  toggleShowOnlyWatchlist: () => void
}

export const DEFAULT_ACTIVE: LayerId[] = []

export const useFilterStore = create<FilterStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        activeLayers: new Set<LayerId>(DEFAULT_ACTIVE),

        toggleLayer: (id) =>
          set((s) => {
            const next = new Set(s.activeLayers)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return { activeLayers: next }
          }),

        enableLayer: (id) =>
          set((s) => {
            const next = new Set(s.activeLayers)
            next.add(id)
            return { activeLayers: next }
          }),

        disableLayer: (id) =>
          set((s) => {
            const next = new Set(s.activeLayers)
            next.delete(id)
            return { activeLayers: next }
          }),

        setLayers: (ids) => set({ activeLayers: new Set(ids) }),

        isLayerActive: (id) => get().activeLayers.has(id),

        severityMin: 'minimal',
        setSeverityMin: (s) => set({ severityMin: s }),

        dateHours: 168,
        setDateHours: (h) => set({ dateHours: h }),

        searchQuery: '',
        setSearchQuery: (q) => set({ searchQuery: q }),

        selectedRegion: null,
        setSelectedRegion: (r) => set({ selectedRegion: r }),

        showOnlyWatchlist: false,
        toggleShowOnlyWatchlist: () =>
          set((s) => ({ showOnlyWatchlist: !s.showOnlyWatchlist })),
      }),
      {
        name: 'observe-filters-v2',
        // Set/Map aren't serializable — convert for storage
        partialize: (s) => ({
          activeLayers: [...s.activeLayers],
          severityMin: s.severityMin,
          dateHours: s.dateHours,
        }),
        merge: (persisted: unknown, current) => {
          const p = persisted as { activeLayers?: string[]; severityMin?: string; dateHours?: number }
          return {
            ...current,
            activeLayers: new Set<LayerId>((p.activeLayers as LayerId[]) ?? DEFAULT_ACTIVE),
            severityMin: (p.severityMin as FilterStore['severityMin']) ?? 'minimal',
            dateHours: (p.dateHours as FilterStore['dateHours']) ?? 168,
          }
        },
      }
    )
  )
)
