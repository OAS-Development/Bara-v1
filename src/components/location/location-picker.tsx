'use client'

import { useLocationStore } from '@/stores/location-store'
import { MapPin } from 'lucide-react'
import * as Select from '@radix-ui/react-select'

interface LocationPickerProps {
  value?: string
  onChange: (locationId: string | null) => void
  placeholder?: string
}

export function LocationPicker({ value, onChange, placeholder = 'Select location' }: LocationPickerProps) {
  const { locations } = useLocationStore()

  return (
    <Select.Root value={value || ''} onValueChange={(val) => onChange(val || null)}>
      <Select.Trigger className="flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <Select.Value placeholder={placeholder}>
          {value && locations.find(l => l.id === value) && (
            <span className="flex items-center gap-2">
              <span>{locations.find(l => l.id === value)?.icon || <MapPin className="h-4 w-4" />}</span>
              <span>{locations.find(l => l.id === value)?.name}</span>
            </span>
          )}
        </Select.Value>
        <Select.Icon>
          <MapPin className="h-4 w-4 text-gray-400" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Select.Viewport className="p-1">
            <Select.Item
              value=""
              className="flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <Select.ItemText>No location</Select.ItemText>
            </Select.Item>
            
            {locations.map((location) => (
              <Select.Item
                key={location.id}
                value={location.id}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: location.color }}
                >
                  {location.icon || <MapPin className="h-3 w-3" />}
                </span>
                <Select.ItemText>{location.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}