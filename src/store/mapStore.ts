import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { MapViewState, AnyEvent } from '@/types'

const DEFAULT_VIEW: MapViewState = {
  longitude: 15,
  latitude: 20,
  zoom: 2.2,
  pitch: 0,
  bearing: 0,
}

interface MapStore {
  viewState: MapViewState
  setViewState: (vs: MapViewState) => void

  selectedEvent: AnyEvent | null
  setSelectedEvent: (event: AnyEvent | null) => void

  hoveredEventId: string | null
  setHoveredEventId: (id: string | null) => void

  isFullscreen: boolean
  toggleFullscreen: () => void

  mapStyle: 'dark' | 'satellite' | 'terrain'
  setMapStyle: (style: 'dark' | 'satellite' | 'terrain') => void

  flyTo: ((opts: { lng: number; lat: number; zoom?: number }) => void) | null
  setFlyTo: (fn: ((opts: { lng: number; lat: number; zoom?: number }) => void) | null) => void
}

export const useMapStore = create<MapStore>()(
  subscribeWithSelector((set) => ({
    viewState: DEFAULT_VIEW,
    setViewState: (vs) => set({ viewState: vs }),

    selectedEvent: null,
    setSelectedEvent: (event) => set({ selectedEvent: event }),

    hoveredEventId: null,
    setHoveredEventId: (id) => set({ hoveredEventId: id }),

    isFullscreen: false,
    toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),

    mapStyle: 'dark',
    setMapStyle: (style) => set({ mapStyle: style }),

    flyTo: null,
    setFlyTo: (fn) => set({ flyTo: fn }),
  }))
)
