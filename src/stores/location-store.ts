import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number // in meters
  color: string
  icon?: string
}

interface LocationState {
  locations: Location[]
  currentLocation: GeolocationPosition | null
  locationPermission: PermissionState | null
  nearbyLocationId: string | null
  
  // Actions
  addLocation: (location: Omit<Location, 'id'>) => void
  updateLocation: (id: string, updates: Partial<Location>) => void
  deleteLocation: (id: string) => void
  setCurrentLocation: (position: GeolocationPosition | null) => void
  setLocationPermission: (permission: PermissionState) => void
  checkNearbyLocation: () => void
}

const DEFAULT_LOCATIONS: Location[] = [
  {
    id: 'home',
    name: 'Home',
    latitude: 0,
    longitude: 0,
    radius: 100,
    color: '#3B82F6',
    icon: '🏠'
  },
  {
    id: 'office',
    name: 'Office',
    latitude: 0,
    longitude: 0,
    radius: 100,
    color: '#10B981',
    icon: '🏢'
  },
  {
    id: 'gym',
    name: 'Gym',
    latitude: 0,
    longitude: 0,
    radius: 50,
    color: '#F59E0B',
    icon: '💪'
  }
]

// Calculate distance between two coordinates in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: DEFAULT_LOCATIONS,
      currentLocation: null,
      locationPermission: null,
      nearbyLocationId: null,

      addLocation: (location) =>
        set((state) => ({
          locations: [
            ...state.locations,
            {
              ...location,
              id: `loc_${Date.now()}`
            }
          ]
        })),

      updateLocation: (id, updates) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...updates } : loc
          )
        })),

      deleteLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id)
        })),

      setCurrentLocation: (position) => {
        set({ currentLocation: position })
        // Check nearby location whenever position updates
        get().checkNearbyLocation()
      },

      setLocationPermission: (permission) =>
        set({ locationPermission: permission }),

      checkNearbyLocation: () => {
        const { locations, currentLocation } = get()
        
        if (!currentLocation) {
          set({ nearbyLocationId: null })
          return
        }

        const currentLat = currentLocation.coords.latitude
        const currentLon = currentLocation.coords.longitude

        // Find the nearest location within its radius
        let nearestLocation: Location | null = null
        let nearestDistance = Infinity

        for (const location of locations) {
          const distance = calculateDistance(
            currentLat,
            currentLon,
            location.latitude,
            location.longitude
          )

          if (distance <= location.radius && distance < nearestDistance) {
            nearestLocation = location
            nearestDistance = distance
          }
        }

        set({ nearbyLocationId: nearestLocation?.id || null })
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