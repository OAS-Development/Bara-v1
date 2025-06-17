'use client'

import { useState } from 'react'
import { ParsedTask } from '@/lib/ai/task-parser'
import { HelpCircle, Calendar, MapPin, Clock, Battery } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { LocationPicker } from '@/components/location/location-picker'
import { DatePicker } from '@/components/dates/date-picker'
import { EnergyLevel } from '@/stores/energy-store'

interface AmbiguityDialogProps {
  task: ParsedTask
  onResolve: (resolved: ParsedTask) => void
  onCancel: () => void
}

export function AmbiguityDialog({ task, onResolve, onCancel }: AmbiguityDialogProps) {
  const [resolvedTask, setResolvedTask] = useState<ParsedTask>({ ...task })
  const [currentStep, setCurrentStep] = useState(0)

  const ambiguousFields = [
    !task.deferDate && !task.dueDate && 'dates',
    !task.location && 'location',
    !task.timeOfDay && 'timeOfDay',
    !task.energyRequired && 'energy'
  ].filter(Boolean)

  const handleNext = () => {
    if (currentStep < ambiguousFields.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onResolve(resolvedTask)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const renderStep = () => {
    const field = ambiguousFields[currentStep]

    switch (field) {
      case 'dates':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Calendar className="h-5 w-5" />
              <h3 className="text-lg font-semibold">When should this task be done?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Help us understand the timing for &ldquo;{resolvedTask.title}&rdquo;
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (optional)
                </label>
                <DatePicker
                  value={resolvedTask.deferDate || null}
                  onChange={(date) =>
                    setResolvedTask({ ...resolvedTask, deferDate: date || undefined })
                  }
                  placeholder="Available immediately"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (optional)
                </label>
                <DatePicker
                  value={resolvedTask.dueDate || null}
                  onChange={(date) =>
                    setResolvedTask({ ...resolvedTask, dueDate: date || undefined })
                  }
                  placeholder="No due date"
                />
              </div>
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Where should this be done?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Select a location for &ldquo;{resolvedTask.title}&rdquo;
            </p>
            <LocationPicker
              selectedLocationId={resolvedTask.location || null}
              onSelect={(locationId) =>
                setResolvedTask({ ...resolvedTask, location: locationId || undefined })
              }
              showNone={true}
            />
          </div>
        )

      case 'timeOfDay':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Best time of day?</h3>
            </div>
            <p className="text-sm text-gray-600">
              When is the best time to work on &ldquo;{resolvedTask.title}&rdquo;?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(['morning', 'afternoon', 'evening', 'night'] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => setResolvedTask({ ...resolvedTask, timeOfDay: time })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    resolvedTask.timeOfDay === time
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {time === 'morning' && '🌅'}
                    {time === 'afternoon' && '☀️'}
                    {time === 'evening' && '🌇'}
                    {time === 'night' && '🌙'}
                  </div>
                  <p className="text-sm font-medium capitalize">{time}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 'energy':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Battery className="h-5 w-5" />
              <h3 className="text-lg font-semibold">How much energy needed?</h3>
            </div>
            <p className="text-sm text-gray-600">
              What energy level is required for &ldquo;{resolvedTask.title}&rdquo;?
            </p>
            <div className="space-y-3">
              {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setResolvedTask({ ...resolvedTask, energyRequired: level })}
                  className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                    resolvedTask.energyRequired === level
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Battery
                      className={`h-5 w-5 ${
                        level === 'low'
                          ? 'text-green-500'
                          : level === 'medium'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium capitalize">{level} Energy</p>
                      <p className="text-sm text-gray-600">
                        {level === 'low' && 'Simple, routine tasks'}
                        {level === 'medium' && 'Regular focus required'}
                        {level === 'high' && 'Deep work, complex tasks'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog.Root open={true} onOpenChange={onCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <Dialog.Title className="text-lg font-semibold">
                  Help us understand better
                </Dialog.Title>
              </div>
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {ambiguousFields.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / ambiguousFields.length) * 100}%` }}
              />
            </div>
          </div>

          {renderStep()}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep < ambiguousFields.length - 1 ? 'Next' : 'Create Task'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
