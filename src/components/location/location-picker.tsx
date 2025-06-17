'use client'

import { useState } from 'react'
import { useLocationStore } from '@/stores/location-store'
import { MapPin, Check } from 'lucide-react'

interface LocationPickerProps {
  selectedLocationId?: string | null
  onSelect: (locationId: string | null) => void
  showNone?: boolean
}

export function LocationPicker({
  selectedLocationId,
  onSelect,
  showNone = true
}: LocationPickerProps) {
  const { locations, isAtLocation } = useLocationStore()
  const [isOpen, setIsOpen] = useState(false)

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId)

  const handleSelect = (locationId: string | null) => {
    onSelect(locationId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          {selectedLocation ? (
            <>
              <span className="text-lg">{selectedLocation.icon || '📍'}</span>
              <span className="text-sm">{selectedLocation.name}</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">No location</span>
            </>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {showNone && (
              <button
                onClick={() => handleSelect(null)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                  !selectedLocationId ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">No location</span>
                </div>
                {!selectedLocationId && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            )}
            
            {locations.map((location) => {
              const atLocation = isAtLocation(location.id)
              return (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                    selectedLocationId === location.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{location.icon || '📍'}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium">{location.name}</p>
                      {atLocation && (
                        <p className="text-xs text-green-600">You are here</p>
                      )}
                    </div>
                  </div>
                  {selectedLocationId === location.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}