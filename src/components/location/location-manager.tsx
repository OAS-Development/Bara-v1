'use client'

import { useState } from 'react'
import { useLocationStore, Location } from '@/stores/location-store'
import { useGeolocation } from '@/hooks/use-geolocation'
import { MapPin, Plus, Settings, Navigation, AlertCircle } from 'lucide-react'

export function LocationManager() {
  const { locations, currentLocation, addLocation, updateLocation, deleteLocation, isAtLocation } =
    useLocationStore()

  const { locationError, isWatching, requestLocation, stopWatching } = useGeolocation()

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    radius: 100
  })

  const handleStartTracking = () => {
    requestLocation()
  }

  const handleStopTracking = () => {
    stopWatching()
  }

  const handleAddLocation = () => {
    if (!currentLocation) {
      alert('Please enable location tracking first')
      return
    }

    setFormData({
      name: '',
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      radius: 100,
      icon: '📍',
      color: '#6366f1'
    })
    setIsAdding(true)
  }

  const handleSaveLocation = () => {
    if (!formData.name || !formData.latitude || !formData.longitude) return

    if (editingId) {
      updateLocation(editingId, formData)
      setEditingId(null)
    } else {
      addLocation(formData as Omit<Location, 'id'>)
    }

    setFormData({ name: '', radius: 100 })
    setIsAdding(false)
  }

  const handleEditLocation = (location: Location) => {
    setFormData(location)
    setEditingId(location.id)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setFormData({ name: '', radius: 100 })
    setIsAdding(false)
    setEditingId(null)
  }

  const formatCoordinates = (lat: number, lon: number) => {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Location Management</h3>
        <div className="flex items-center gap-2">
          {!isWatching ? (
            <button
              onClick={handleStartTracking}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Navigation className="h-4 w-4" />
              Enable Tracking
            </button>
          ) : (
            <button
              onClick={handleStopTracking}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Navigation className="h-4 w-4" />
              Stop Tracking
            </button>
          )}
        </div>
      </div>

      {/* Current Location Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Navigation
            className={`h-5 w-5 mt-0.5 ${
              isWatching ? 'text-green-600 animate-pulse' : 'text-gray-400'
            }`}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              {isWatching ? 'Location Tracking Active' : 'Location Tracking Disabled'}
            </p>
            {currentLocation && (
              <p className="text-xs text-gray-500 mt-1">
                Current:{' '}
                {formatCoordinates(
                  currentLocation.coords.latitude,
                  currentLocation.coords.longitude
                )}
              </p>
            )}
            {locationError && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {locationError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="space-y-3">
        {locations.map((location) => {
          const atLocation = isAtLocation(location.id)
          return (
            <div
              key={location.id}
              className={`p-4 border rounded-lg ${
                atLocation ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{location.icon || '📍'}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {location.name}
                      {atLocation && (
                        <span className="ml-2 text-xs text-green-600 font-normal">
                          (You are here)
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCoordinates(location.latitude, location.longitude)}
                    </p>
                    <p className="text-xs text-gray-500">Radius: {location.radius}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditLocation(location)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteLocation(location.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            {editingId ? 'Edit Location' : 'Add New Location'}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="e.g., Home, Office, Gym"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input
                  type="text"
                  value={formData.icon || '📍'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radius (meters)
                </label>
                <input
                  type="number"
                  value={formData.radius || 100}
                  onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  min="10"
                  max="1000"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && currentLocation && (
        <button
          onClick={handleAddLocation}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Add Current Location
        </button>
      )}
    </div>
  )
}
