import { Metadata } from 'next'
import { MapPageLoader } from '@/components/map/MapPageLoader'

export const metadata: Metadata = { title: 'World Map' }

export default function MapPage() {
  return <MapPageLoader />
}
