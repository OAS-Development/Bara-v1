'use client'

import { useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)
  const [currentMonth, setCurrentMonth] = useState(value || new Date())

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
    onChange(newDate)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedDate(null)
    onChange(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth.getMonth() &&
        new Date().getFullYear() === currentMonth.getFullYear()

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={cn(
            'p-2 text-sm hover:bg-gray-100 rounded',
            isSelected && 'bg-blue-500 text-white hover:bg-blue-600',
            isToday && !isSelected && 'font-bold text-blue-600'
          )}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50',
          className
        )}
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        {selectedDate && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="ml-auto hover:bg-gray-200 rounded p-0.5"
          >
            <X className="h-3 w-3 text-gray-500" />
          </button>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border z-50 p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100 rounded">
                ‹
              </button>
              <h3 className="text-sm font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded">
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-xs text-gray-500 text-center p-2">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleDateSelect(new Date().getDate())}
                className="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                Today
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
