'use client'

import { useState } from 'react'
import { useLocationStore, Location } from '@/stores/location-store'
import { MapPin, Plus, Edit2, Trash2, Navigation } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

export function LocationManager() {
  const { locations, addLocation, updateLocation, deleteLocation, nearbyLocationId } = useLocationStore()
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleSave = (formData: FormData) => {
    const name = formData.get('name') as string
    const latitude = parseFloat(formData.get('latitude') as string)
    const longitude = parseFloat(formData.get('longitude') as string)
    const radius = parseInt(formData.get('radius') as string)
    const color = formData.get('color') as string
    const icon = formData.get('icon') as string

    if (editingLocation) {
      updateLocation(editingLocation.id, {
        name,
        latitude,
        longitude,
        radius,
        color,
        icon
      })
      setEditingLocation(null)
    } else {
      addLocation({
        name,
        latitude,
        longitude,
        radius,
        color,
        icon
      })
      setIsAddingNew(false)
    }
  }

  const LocationDialog = ({ location, onClose }: { location?: Location; onClose: () => void }) => (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {location ? 'Edit Location' : 'Add New Location'}
          </Dialog.Title>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave(new FormData(e.currentTarget))
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                defaultValue={location?.name}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  defaultValue={location?.latitude || 0}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  defaultValue={location?.longitude || 0}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radius (meters)
              </label>
              <input
                name="radius"
                type="number"
                defaultValue={location?.radius || 100}
                min="10"
                max="5000"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  name="color"
                  type="color"
                  defaultValue={location?.color || '#3B82F6'}
                  required
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (emoji)
                </label>
                <input
                  name="icon"
                  type="text"
                  defaultValue={location?.icon || '📍'}
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Locations
        </h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Location
        </button>
      </div>

      <div className="space-y-2">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`flex items-center justify-between p-3 bg-white rounded-lg border ${
              nearbyLocationId === location.id
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: location.color }}
              >
                {location.icon || <MapPin className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium">{location.name}</p>
                <p className="text-sm text-gray-600">
                  Within {location.radius}m
                </p>
              </div>
              {nearbyLocationId === location.id && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <Navigation className="h-3 w-3" />
                  <span>Current</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingLocation(location)}
                className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteLocation(location.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isAddingNew || editingLocation) && (
        <LocationDialog
          location={editingLocation || undefined}
          onClose={() => {
            setIsAddingNew(false)
            setEditingLocation(null)
          }}
        />
      )}
    </div>
  )
}