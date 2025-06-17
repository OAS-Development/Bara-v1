'use client'

import { useState } from 'react'
import { RotateCw } from 'lucide-react'
import { Database } from '@/types/database.types'

type RepeatUnit = Database['public']['Enums']['repeat_unit']

interface RepeatPickerProps {
  interval?: number | null
  unit?: RepeatUnit | null
  onChange: (interval: number | null, unit: RepeatUnit | null) => void
}

export function RepeatPicker({ interval, unit, onChange }: RepeatPickerProps) {
  const [isEnabled, setIsEnabled] = useState(!!interval && !!unit)
  const [repeatInterval, setRepeatInterval] = useState(interval || 1)
  const [repeatUnit, setRepeatUnit] = useState<RepeatUnit>(unit || 'days')

  const handleToggle = () => {
    if (isEnabled) {
      onChange(null, null)
      setIsEnabled(false)
    } else {
      onChange(repeatInterval, repeatUnit)
      setIsEnabled(true)
    }
  }

  const handleIntervalChange = (value: number) => {
    setRepeatInterval(value)
    if (isEnabled) {
      onChange(value, repeatUnit)
    }
  }

  const handleUnitChange = (value: RepeatUnit) => {
    setRepeatUnit(value)
    if (isEnabled) {
      onChange(repeatInterval, value)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="repeat-enabled"
          checked={isEnabled}
          onChange={handleToggle}
          className="rounded border-gray-300"
        />
        <label
          htmlFor="repeat-enabled"
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <RotateCw className="h-4 w-4" />
          Repeat
        </label>
      </div>

      {isEnabled && (
        <div className="flex items-center gap-2 ml-6">
          <span className="text-sm text-gray-600">Every</span>
          <input
            type="number"
            min="1"
            value={repeatInterval}
            onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={repeatUnit}
            onChange={(e) => handleUnitChange(e.target.value as RepeatUnit)}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="days">day{repeatInterval > 1 ? 's' : ''}</option>
            <option value="weeks">week{repeatInterval > 1 ? 's' : ''}</option>
            <option value="months">month{repeatInterval > 1 ? 's' : ''}</option>
            <option value="years">year{repeatInterval > 1 ? 's' : ''}</option>
          </select>
        </div>
      )}

      {isEnabled && (
        <p className="text-xs text-gray-500 ml-6">
          A new task will be created when this one is completed
        </p>
      )}
    </div>
  )
}
