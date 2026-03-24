'use client'

import { useRef, useCallback, useEffect } from 'react'
import Map, { NavigationControl, ScaleControl, type MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { DeckGL } from '@deck.gl/react'
import type { MapViewState } from '@/types/map'
import { MAP_STYLES } from '@/lib/map/styleConfig'
import { useMapStore } from '@/store/mapStore'
import { useFilterStore } from '@/store/filterStore'
import { useMapLayers } from '@/hooks/useMapLayers'
import { useUIStore } from '@/store/uiStore'

const MAP_STYLE = MAP_STYLES.dark(process.env.NEXT_PUBLIC_MAPTILER_KEY)

export function ObserveMap() {
  const mapRef = useRef<MapRef>(null)
  const { viewState, setViewState, setFlyTo, setSelectedEvent, flyTo } = useMapStore()
  const { openIntelDrawer } = useUIStore()
  const { layers, isLoading } = useMapLayers()

  // Register flyTo function for external callers
  useEffect(() => {
    setFlyTo(({ lng, lat, zoom = 6 }: { lng: number; lat: number; zoom?: number }) => {
      setViewState({
        ...viewState,
        longitude: lng,
        latitude: lat,
        zoom,
      })
    })
    return () => setFlyTo(null)
  }, [setFlyTo, setViewState, viewState])

  const handleViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: MapViewState }) => {
      setViewState(vs as MapViewState)
    },
    [setViewState]
  )

  return (
    <div className="absolute inset-0 bg-[#080c10]">
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange as never}
        controller={true}
        layers={layers}
        getCursor={({ isDragging, isHovering }) =>
          isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
        }
      >
        <Map
          ref={mapRef}
          mapStyle={MAP_STYLE}
          attributionControl={false}
          reuseMaps
          style={{ background: '#080c10' }}
        >
          <NavigationControl
            position="top-right"
            style={{
              marginTop: '10px',
              marginRight: '10px',
            }}
          />
          <ScaleControl position="bottom-right" />
        </Map>
      </DeckGL>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--obs-teal)] animate-pulse" />
            Loading intelligence layers…
          </div>
        </div>
      )}

      {/* Map style info overlay */}
      <div className="absolute top-3 left-3 z-10">
        <div className="glass rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-muted-foreground/60 border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--obs-teal)] animate-pulse" />
          <span className="font-mono">LIVE</span>
        </div>
      </div>
    </div>
  )
}
