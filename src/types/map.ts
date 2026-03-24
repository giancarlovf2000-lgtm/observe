import type { EventType } from './database'

export interface MapViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

export interface LayerConfig {
  id: string
  label: string
  category: LayerCategory
  icon: string            // lucide icon name
  color: string           // hex or CSS color
  description: string
  eventType?: EventType
  defaultVisible: boolean
  requiresAuth: boolean   // some layers require login
}

export type LayerCategory =
  | 'security'
  | 'news'
  | 'environment'
  | 'transport'
  | 'markets'
  | 'intelligence'

export interface FilterState {
  activeLayers: Set<string>
  severityMin: 'minimal' | 'low' | 'moderate' | 'high' | 'critical'
  dateRange: { from: Date | null; to: Date | null }
  searchQuery: string
  selectedCountries: string[]
  selectedRegions: string[]
}

export interface SavedMapView {
  id: string
  name: string
  viewState: MapViewState
  activeLayers: string[]
  filterState: Partial<FilterState>
}

export const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 15,
  latitude: 20,
  zoom: 2.2,
  pitch: 0,
  bearing: 0,
}
