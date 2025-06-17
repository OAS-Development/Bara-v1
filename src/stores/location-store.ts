import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number // in meters
  icon?: string
  color?: string
}

interface LocationState {
  locations: Location[]
  currentLocation: GeolocationPosition | null
  locationError: string | null
  watchId: number | null
  addLocation: (location: Omit<Location, 'id'>) => void
  updateLocation: (id: string, location: Partial<Location>) => void
  deleteLocation: (id: string) => void
  setCurrentLocation: (position: GeolocationPosition | null) => void
  setLocationError: (error: string | null) => void
  setWatchId: (id: number | null) => void
  isAtLocation: (locationId: string) => boolean
  getDistanceToLocation: (locationId: string) => number | null
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [
        {
          id: 'home',
          name: 'Home',
          latitude: 0,
          longitude: 0,
          radius: 100,
          icon: '🏠',
          color: '#22c55e'
        },
        {
          id: 'office',
          name: 'Office',
          latitude: 0,
          longitude: 0,
          radius: 150,
          icon: '🏢',
          color: '#3b82f6'
        }
      ],
      currentLocation: null,
      locationError: null,
      watchId: null,

      addLocation: (locationData) => {
        const newLocation: Location = {
          ...locationData,
          id: `location-${Date.now()}`
        }
        set((state) => ({
          locations: [...state.locations, newLocation]
        }))
      },

      updateLocation: (id, locationData) => {
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...locationData } : loc
          )
        }))
      },

      deleteLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id)
        }))
      },

      setCurrentLocation: (position) => {
        set({ currentLocation: position, locationError: null })
      },

      setLocationError: (error) => {
        set({ locationError: error })
      },

      setWatchId: (id) => {
        set({ watchId: id })
      },

      isAtLocation: (locationId) => {
        const state = get()
        const location = state.locations.find((loc) => loc.id === locationId)
        if (!location || !state.currentLocation) return false

        const distance = calculateDistance(
          state.currentLocation.coords.latitude,
          state.currentLocation.coords.longitude,
          location.latitude,
          location.longitude
        )

        return distance <= location.radius
      },

      getDistanceToLocation: (locationId) => {
        const state = get()
        const location = state.locations.find((loc) => loc.id === locationId)
        if (!location || !state.currentLocation) return null

        return calculateDistance(
          state.currentLocation.coords.latitude,
          state.currentLocation.coords.longitude,
          location.latitude,
          location.longitude
        )
      }
    }),
    {
      name: 'location-storage',
      partialize: (state) => ({
        locations: state.locations
      })
    }
  )
)

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}