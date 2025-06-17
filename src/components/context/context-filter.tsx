'use client'

import { useState } from 'react'
import { LocationFilter } from '@/components/location/location-filter'
import { TimeFilter } from './time-filter'
import { EnergyLevel } from '@/stores/energy-store'
import { TimeOfDay } from '@/lib/context/time-rules'
import { Filter, Battery } from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

interface ContextFilterProps {
  onFilterChange: (filters: {
    location: string | null
    timeOfDay: TimeOfDay | null
    energyRequired: EnergyLevel | null
  }) => void
}

export function ContextFilter({ onFilterChange }: ContextFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [location, setLocation] = useState<string | null>(null)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null)
  const [energyRequired, setEnergyRequired] = useState<EnergyLevel | null>(null)

  const handleLocationChange = (newLocation: string | null) => {
    setLocation(newLocation)
    onFilterChange({ location: newLocation, timeOfDay, energyRequired })
  }

  const handleTimeChange = (newTime: TimeOfDay | null) => {
    setTimeOfDay(newTime)
    onFilterChange({ location, timeOfDay: newTime, energyRequired })
  }

  const handleEnergyChange = (newEnergy: EnergyLevel | null) => {
    setEnergyRequired(newEnergy)
    onFilterChange({ location, timeOfDay, energyRequired: newEnergy })
  }

  const activeFilterCount = [location, timeOfDay, energyRequired].filter(Boolean).length

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Trigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Context Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                {activeFilterCount}
              </span>
            )}
          </div>
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Collapsible.Trigger>

        <Collapsible.Content className="border-t border-gray-200">
          <div className="p-4 space-y-4">
            {/* Location Filter */}
            <div>
              <LocationFilter
                value={location}
                onChange={handleLocationChange}
                includeNearby={true}
              />
            </div>

            {/* Time Filter */}
            <div>
              <TimeFilter
                value={timeOfDay}
                onChange={handleTimeChange}
              />
            </div>

            {/* Energy Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Battery className="h-4 w-4" />
                <span>Energy Required</span>
              </div>
              
              <ToggleGroup.Root
                type="single"
                value={energyRequired || 'all'}
                onValueChange={(val) => handleEnergyChange(val === 'all' ? null : val as EnergyLevel)}
                className="flex items-center gap-2"
              >
                <ToggleGroup.Item
                  value="all"
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 transition-colors"
                >
                  All Levels
                </ToggleGroup.Item>

                {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                  <ToggleGroup.Item
                    key={level}
                    value={level}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 transition-colors capitalize"
                  >
                    {level}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setLocation(null)
                    setTimeOfDay(null)
                    setEnergyRequired(null)
                    onFilterChange({ location: null, timeOfDay: null, energyRequired: null })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}