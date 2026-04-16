// MapLibre GL JS style configuration
// Uses MapTiler's landscape (terrain/elevation) style
// Get a free API key at: https://cloud.maptiler.com/maps/

function isValidKey(key?: string | null): key is string {
  return !!key && !key.startsWith('your_') && key.length > 10
}

export function getMapStyle(key?: string | null): string {
  if (isValidKey(key)) {
    return `https://api.maptiler.com/maps/landscape/style.json?key=${key}`
  }
  // Fallback: CARTO Positron — light, clean, no API key required
  return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
}

// Alternative styles (all require MapTiler key except fallbacks)
export const MAP_STYLES = {
  // Warm earth-tone terrain with elevation shading — matches the landscape screenshots
  landscape: (key?: string) =>
    isValidKey(key)
      ? `https://api.maptiler.com/maps/landscape/style.json?key=${key}`
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  // Minimal cream/clay relief — closest to screenshot 1
  winter: (key?: string) =>
    isValidKey(key)
      ? `https://api.maptiler.com/maps/winter/style.json?key=${key}`
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  // Original dark style
  dark: (key?: string) =>
    isValidKey(key)
      ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  satellite: (key?: string) =>
    isValidKey(key)
      ? `https://api.maptiler.com/maps/hybrid/style.json?key=${key}`
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  terrain: (key?: string) =>
    isValidKey(key)
      ? `https://api.maptiler.com/maps/outdoor/style.json?key=${key}`
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
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
