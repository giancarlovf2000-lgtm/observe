import { Metadata } from 'next'
import { MapPageClient } from '@/components/map/MapPageClient'

export const metadata: Metadata = { title: 'World Map' }

export default function MapPage() {
  return <MapPageClient />
}
