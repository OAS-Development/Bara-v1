'use client'

import { useLocationStore } from '@/stores/location-store'
import { useGeolocation } from '@/hooks/use-geolocation'
import { MapPin, Navigation, AlertCircle } from 'lucide-react'

export function LocationIndicator() {
  const { locations, isAtLocation } = useLocationStore()
  const { currentLocation, locationError, isWatching, requestLocation } = useGeolocation()

  const currentLocations = locations.filter((loc) => isAtLocation(loc.id))

  if (!isWatching && !locationError) {
    return (
      <button
        onClick={requestLocation}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <MapPin className="h-4 w-4" />
        <span>Enable Location</span>
      </button>
    )
  }

  if (locationError) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <span>Location Error</span>
      </div>
    )
  }

  if (currentLocations.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500">
        <Navigation className="h-4 w-4 animate-pulse" />
        <span>No known location</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {currentLocations.map((location) => (
        <div
          key={location.id}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg"
        >
          <span>{location.icon || '📍'}</span>
          <span>{location.name}</span>
        </div>
      ))}
    </div>
  )
}
