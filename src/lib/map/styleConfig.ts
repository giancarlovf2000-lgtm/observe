// MapLibre GL JS style configuration
// Uses MapTiler's dark style (free tier) — swap with any compatible style

export function getMapStyle(key?: string | null): string {
  if (key) {
    return `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`
  }
  // Fallback: use a free public style (no API key required)
  // OSM Bright Dark from MapTiler (public access)
  return 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json'
}

// Alternative styles
export const MAP_STYLES = {
  dark: (key?: string) =>
    key
      ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`
      : 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
  satellite: (key?: string) =>
    key
      ? `https://api.maptiler.com/maps/satellite/style.json?key=${key}`
      : 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
  terrain: (key?: string) =>
    key
      ? `https://api.maptiler.com/maps/outdoor/style.json?key=${key}`
      : 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
}

export const SEVERITY_COLORS = {
  minimal: [52, 211, 153, 200],   // emerald
  low: [74, 222, 128, 200],        // green
  moderate: [250, 204, 21, 220],   // yellow
  high: [249, 115, 22, 230],       // orange
  critical: [239, 68, 68, 255],    // red
} as const

export const EVENT_TYPE_COLORS = {
  conflict: [239, 68, 68],          // red
  news: [249, 115, 22],             // orange
  weather: [59, 130, 246],          // blue
  flight: [34, 211, 238],           // cyan
  vessel: [6, 182, 212],            // dark cyan
  market: [234, 179, 8],            // yellow
  political: [167, 139, 250],       // purple
  humanitarian: [52, 211, 153],     // emerald
  cyber: [196, 181, 253],           // light purple
} as const
