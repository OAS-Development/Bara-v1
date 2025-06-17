'use client'

import { DatePicker } from './date-picker'
import { Clock, Calendar } from 'lucide-react'

interface DeferDuePickerProps {
  deferDate?: Date | null
  dueDate?: Date | null
  onDeferChange: (date: Date | null) => void
  onDueChange: (date: Date | null) => void
}

export function DeferDuePicker({
  deferDate,
  dueDate,
  onDeferChange,
  onDueChange
}: DeferDuePickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
          <Clock className="h-4 w-4" />
          Defer Until
        </label>
        <DatePicker
          value={deferDate}
          onChange={onDeferChange}
          placeholder="Task available immediately"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">Task will be hidden until this date</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
          <Calendar className="h-4 w-4" />
          Due Date
        </label>
        <DatePicker
          value={dueDate}
          onChange={onDueChange}
          placeholder="No due date"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">Task should be completed by this date</p>
      </div>

      {deferDate && dueDate && deferDate > dueDate && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          Warning: Defer date is after due date
        </div>
      )}
    </div>
  )
}
