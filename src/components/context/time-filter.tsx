'use client'

import { TimeRules } from '@/lib/context/time-rules'

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'
import { Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

interface TimeFilterProps {
  value: TimeOfDay | null
  onChange: (timeOfDay: TimeOfDay | null) => void
}

const timeIcons: Record<TimeOfDay, React.ReactNode> = {
  morning: <Sunrise className="h-4 w-4" />,
  afternoon: <Sun className="h-4 w-4" />,
  evening: <Sunset className="h-4 w-4" />,
  night: <Moon className="h-4 w-4" />
}

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  const timeRules = new TimeRules()
  const currentTimeOfDay = timeRules.getCurrentTimeOfDay()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>Time of Day Filter</span>
      </div>

      <ToggleGroup.Root
        type="single"
        value={value || 'all'}
        onValueChange={(val) => onChange(val === 'all' ? null : (val as TimeOfDay))}
        className="flex items-center gap-2"
      >
        <ToggleGroup.Item
          value="all"
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 transition-colors"
        >
          All Times
        </ToggleGroup.Item>

        {(['morning', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((time) => (
          <ToggleGroup.Item
            key={time}
            value={time}
            className={`px-3 py-1.5 text-sm rounded-lg border border-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 transition-colors flex items-center gap-1.5 ${
              time === currentTimeOfDay ? 'ring-2 ring-blue-400 ring-offset-2' : ''
            }`}
          >
            {timeIcons[time]}
            <span className="capitalize">{time}</span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}
