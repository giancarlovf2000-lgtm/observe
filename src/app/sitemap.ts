import { MetadataRoute } from 'next'

const BASE = 'https://www.observe.center'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,               lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/pricing`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/privacy`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/tos`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/login`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE}/signup`,   lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.8 },
  ]
}
