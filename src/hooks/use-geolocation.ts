'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocationStore } from '@/stores/location-store'

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  updateInterval?: number
}

interface GeolocationState {
  position: GeolocationPosition | null
  error: GeolocationPositionError | null
  loading: boolean
  permission: PermissionState | null
}

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
  updateInterval: 60000 // Update every minute
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
    permission: null
  })

  const { setCurrentLocation, setLocationPermission } = useLocationStore()
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  // Check permission status
  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' })
        setState(prev => ({ ...prev, permission: result.state }))
        setLocationPermission(result.state)
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setState(prev => ({ ...prev, permission: result.state }))
          setLocationPermission(result.state)
        })
      } catch (error) {
        console.error('Permission check failed:', error)
      }
    }
  }, [setLocationPermission])

  // Get current position
  const getCurrentPosition = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position,
          error: null,
          loading: false,
          permission: 'granted'
        })
        setCurrentLocation(position)
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error,
          loading: false,
          permission: error.code === 1 ? 'denied' : prev.permission
        }))
        setCurrentLocation(null)
      },
      {
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        timeout: mergedOptions.timeout,
        maximumAge: mergedOptions.maximumAge
      }
    )
  }, [mergedOptions, setCurrentLocation])

  // Request permission and start tracking
  const requestPermission = useCallback(async () => {
    try {
      getCurrentPosition()
    } catch (error) {
      console.error('Failed to get position:', error)
    }
  }, [getCurrentPosition])

  // Stop tracking
  const stopTracking = useCallback(() => {
    setState(prev => ({ ...prev, loading: false }))
    setCurrentLocation(null)
  }, [setCurrentLocation])

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: {
          code: 0,
          message: 'Geolocation is not supported',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        } as GeolocationPositionError,
        loading: false,
        permission: null
      })
      return
    }

    checkPermission()

    // Auto-start if permission is already granted
    if (state.permission === 'granted') {
      getCurrentPosition()
    }

    // Set up periodic updates if tracking is active
    let intervalId: NodeJS.Timeout | null = null
    if (state.permission === 'granted' && mergedOptions.updateInterval) {
      intervalId = setInterval(getCurrentPosition, mergedOptions.updateInterval)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [state.permission, mergedOptions.updateInterval, checkPermission, getCurrentPosition])

  return {
    ...state,
    requestPermission,
    stopTracking,
    refresh: getCurrentPosition
  }
}