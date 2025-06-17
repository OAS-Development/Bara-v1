'use client'

import { useEffect, useCallback } from 'react'
import { useLocationStore } from '@/stores/location-store'

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watchPosition?: boolean
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 5000,
    maximumAge = 0,
    watchPosition = true
  } = options

  const {
    currentLocation,
    locationError,
    watchId,
    setCurrentLocation,
    setLocationError,
    setWatchId
  } = useLocationStore()

  const handleSuccess = useCallback(
    (position: GeolocationPosition) => {
      setCurrentLocation(position)
    },
    [setCurrentLocation]
  )

  const handleError = useCallback(
    (error: GeolocationPositionError) => {
      const errorMessages: Record<number, string> = {
        1: 'Location permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
      }
      setLocationError(errorMessages[error.code] || 'Unknown error')
    },
    [setLocationError]
  )

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge
    }

    if (watchPosition) {
      const id = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions)
      setWatchId(id)
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions)
    }
  }, [
    enableHighAccuracy,
    timeout,
    maximumAge,
    watchPosition,
    handleSuccess,
    handleError,
    setWatchId,
    setLocationError
  ])

  const stopWatching = useCallback(() => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }, [watchId, setWatchId])

  useEffect(() => {
    return () => {
      // Clean up on unmount
      stopWatching()
    }
  }, [stopWatching])

  return {
    currentLocation,
    locationError,
    isWatching: watchId !== null,
    requestLocation,
    stopWatching
  }
}
