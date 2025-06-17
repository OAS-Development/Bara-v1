'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X,
  Folder,
  Tag,
  Calendar,
  Clock,
  MapPin,
  Battery,
  Sunrise,
  Sun,
  Sunset,
  Moon
} from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { useProjectStore } from '@/stores/project-store'
import { useTagStore } from '@/stores/tag-store'
import { useLocationStore } from '@/stores/location-store'
import { useEnergyStore, EnergyLevel } from '@/stores/energy-store'
import { TimeOfDay } from '@/lib/context/time-rules'
import { ProjectPicker } from '@/components/projects/project-picker'
import { TagPicker } from '@/components/tags/tag-picker'
import { TagChip } from '@/components/tags/tag-chip'
import { taskSchema, safeValidate } from '@/lib/validation'
import { toast } from '@/components/ui/toast'
import { DatePicker } from '@/components/dates/date-picker'
import { LocationPicker } from '@/components/location/location-picker'
import * as Select from '@radix-ui/react-select'

interface QuickEntryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickEntryModal({ isOpen, onClose }: QuickEntryModalProps) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [tagIds, setTagIds] = useState<string[]>([])
  const [deferDate, setDeferDate] = useState<Date | null>(null)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [locationId, setLocationId] = useState<string | null>(null)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null)
  const [energyRequired, setEnergyRequired] = useState<EnergyLevel | null>(null)
  const [showProjectPicker, setShowProjectPicker] = useState(false)
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [showDatePickers, setShowDatePickers] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showContextPickers, setShowContextPickers] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const { createTask } = useTaskStore()
  const { getProjectById } = useProjectStore()
  const { tags } = useTagStore()
  const { locations } = useLocationStore()
  const { currentLevel } = useEnergyStore()

  useEffect(() => {
    if (isOpen) {
      titleRef.current?.focus()
      setTitle('')
      setNote('')
      setProjectId(null)
      setTagIds([])
      setDeferDate(null)
      setDueDate(null)
      setLocationId(null)
      setTimeOfDay(null)
      setEnergyRequired(null)
      setShowDatePickers(false)
      setShowLocationPicker(false)
      setShowContextPickers(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const taskData = {
      title: title.trim(),
      note: note.trim() || undefined,
      project_id: projectId || undefined,
      defer_date: deferDate?.toISOString() || undefined,
      due_date: dueDate?.toISOString() || undefined,
      location: locationId || undefined,
      energy_level: energyRequired || undefined,
      tags: tagIds.length > 0 ? tagIds : undefined
    }

    const validation = safeValidate(taskSchema, taskData)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      toast({
        title: 'Validation Error',
        description: firstError.message,
        variant: 'destructive'
      })
      return
    }

    await createTask({
      ...validation.data,
      tagIds,
      time_of_day: timeOfDay,
      energy_required: energyRequired
    })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-4" onKeyDown={handleKeyDown}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold">New Task</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <button
              type="button"
              onClick={() => setShowProjectPicker(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              <Folder className="h-4 w-4 text-gray-400" />
              <span className="flex-1">
                {projectId ? getProjectById(projectId)?.name : 'No Project (Inbox)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowTagPicker(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="flex-1">
                {tagIds.length > 0
                  ? `${tagIds.length} tag${tagIds.length > 1 ? 's' : ''}`
                  : 'No Tags'}
              </span>
            </button>

            {tagIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tagIds.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId)
                  if (!tag) return null
                  return (
                    <TagChip
                      key={tag.id}
                      name={tag.name}
                      color={tag.color}
                      icon={tag.icon}
                      onRemove={() => setTagIds(tagIds.filter((id) => id !== tagId))}
                    />
                  )
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowDatePickers(!showDatePickers)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="flex-1">
                {deferDate || dueDate
                  ? `${deferDate ? `Defer: ${deferDate.toLocaleDateString()}` : ''} ${dueDate ? `Due: ${dueDate.toLocaleDateString()}` : ''}`
                  : 'No Dates'}
              </span>
            </button>

            {showDatePickers && (
              <div className="space-y-3 bg-gray-800 rounded p-3">
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Clock className="h-3 w-3" />
                    Defer Until
                  </label>
                  <DatePicker
                    value={deferDate}
                    onChange={setDeferDate}
                    placeholder="Available immediately"
                    className="w-full bg-gray-700 text-white border-gray-600"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Calendar className="h-3 w-3" />
                    Due Date
                  </label>
                  <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="No due date"
                    className="w-full bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="flex-1">
                {locationId
                  ? locations.find((l) => l.id === locationId)?.name || 'Location'
                  : 'No Location'}
              </span>
            </button>

            {showLocationPicker && (
              <div className="bg-gray-800 rounded p-3">
                <LocationPicker selectedLocationId={locationId} onSelect={setLocationId} />
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowContextPickers(!showContextPickers)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              <Battery className="h-4 w-4 text-gray-400" />
              <span className="flex-1">
                {timeOfDay || energyRequired
                  ? `${timeOfDay ? `Time: ${timeOfDay}` : ''} ${energyRequired ? `Energy: ${energyRequired}` : ''}`
                  : 'No Context'}
              </span>
            </button>

            {showContextPickers && (
              <div className="space-y-3 bg-gray-800 rounded p-3">
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Clock className="h-3 w-3" />
                    Best Time of Day
                  </label>
                  <div className="flex gap-2">
                    {(['morning', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setTimeOfDay(timeOfDay === time ? null : time)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          timeOfDay === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {time === 'morning' && <Sunrise className="h-3 w-3 inline mr-1" />}
                        {time === 'afternoon' && <Sun className="h-3 w-3 inline mr-1" />}
                        {time === 'evening' && <Sunset className="h-3 w-3 inline mr-1" />}
                        {time === 'night' && <Moon className="h-3 w-3 inline mr-1" />}
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Battery className="h-3 w-3" />
                    Energy Required
                  </label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as EnergyLevel[]).map((energy) => (
                      <button
                        key={energy}
                        type="button"
                        onClick={() => setEnergyRequired(energyRequired === energy ? null : energy)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          energyRequired === energy
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {energy}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      {showProjectPicker && (
        <ProjectPicker
          selectedProjectId={projectId || undefined}
          onSelectProject={setProjectId}
          onClose={() => setShowProjectPicker(false)}
        />
      )}

      {showTagPicker && (
        <TagPicker
          selectedTagIds={tagIds}
          onTagsChange={setTagIds}
          onClose={() => setShowTagPicker(false)}
        />
      )}
    </div>
  )
}
