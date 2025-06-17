'use client'

import { useLocationStore } from '@/stores/location-store'
import { MapPin, Navigation } from 'lucide-react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

interface LocationFilterProps {
  value: string | null
  onChange: (locationId: string | null) => void
  includeNearby?: boolean
}

export function LocationFilter({ value, onChange, includeNearby = true }: LocationFilterProps) {
  const { locations, nearbyLocationId } = useLocationStore()

  return (
    <ToggleGroup.Root
      type="single"
      value={value || 'all'}
      onValueChange={(val) => onChange(val === 'all' ? null : val)}
      className="flex items-center gap-2"
    >
      <ToggleGroup.Item
        value="all"
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 transition-colors"
      >
        All Locations
      </ToggleGroup.Item>

      {includeNearby && nearbyLocationId && (
        <ToggleGroup.Item
          value={nearbyLocationId}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 transition-colors flex items-center gap-1.5"
        >
          <Navigation className="h-3.5 w-3.5" />
          Current
        </ToggleGroup.Item>
      )}

      {locations.map((location) => (
        <ToggleGroup.Item
          key={location.id}
          value={location.id}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 transition-colors flex items-center gap-1.5"
        >
          <span>{location.icon || <MapPin className="h-3.5 w-3.5" />}</span>
          {location.name}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}