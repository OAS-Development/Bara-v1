'use client'

import { useGeolocation } from '@/hooks/use-geolocation'
import { useLocationStore } from '@/stores/location-store'
import { Navigation, MapPin, AlertCircle, Loader2 } from 'lucide-react'

export function LocationIndicator() {
  const { nearbyLocationId, locations, locationPermission } = useLocationStore()
  const { position, error, loading, permission, requestPermission } = useGeolocation()

  const nearbyLocation = nearbyLocationId ? locations.find(l => l.id === nearbyLocationId) : null

  if (permission === 'denied' || error?.code === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Location access denied</span>
      </div>
    )
  }

  if (permission === 'prompt' || (!position && !loading)) {
    return (
      <button
        onClick={requestPermission}
        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <MapPin className="h-4 w-4" />
        <span className="text-sm">Enable location</span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Getting location...</span>
      </div>
    )
  }

  if (nearbyLocation) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white"
        style={{ backgroundColor: nearbyLocation.color }}
      >
        <Navigation className="h-4 w-4" />
        <span className="text-sm font-medium">
          {nearbyLocation.icon} {nearbyLocation.name}
        </span>
      </div>
    )
  }

  if (position) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">
        <Navigation className="h-4 w-4" />
        <span className="text-sm">No known location</span>
      </div>
    )
  }

  return null
}