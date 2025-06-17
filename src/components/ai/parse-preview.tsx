'use client'

import { ParsedTask } from '@/lib/ai/task-parser'
import { Calendar, MapPin, Battery, Clock, Tag, Folder, Flag, AlertCircle } from 'lucide-react'

interface ParsePreviewProps {
  task: ParsedTask
  onConfirm: () => void
  onCancel: () => void
  onEdit: (field: keyof ParsedTask, value: any) => void
}

export function ParsePreview({ task, onConfirm, onCancel, onEdit }: ParsePreviewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const confidenceColor = task.confidence > 0.8 ? 'text-green-600' : 
                         task.confidence > 0.6 ? 'text-yellow-600' : 
                         'text-red-600'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">AI Parse Result</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Confidence:</span>
          <span className={`text-sm font-medium ${confidenceColor}`}>
            {Math.round(task.confidence * 100)}%
          </span>
        </div>
      </div>

      {task.ambiguities && task.ambiguities.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Assumptions made:</p>
              <ul className="mt-1 space-y-0.5">
                {task.ambiguities.map((ambiguity, index) => (
                  <li key={index} className="text-sm text-yellow-800">• {ambiguity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => onEdit('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        {task.notes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={task.notes}
              onChange={(e) => onEdit('notes', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        )}

        {/* Extracted Properties */}
        <div className="grid grid-cols-2 gap-3">
          {task.project && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Folder className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{task.project}</span>
            </div>
          )}

          {task.deferDate && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Defer: {formatDate(task.deferDate)}</span>
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Due: {formatDate(task.dueDate)}</span>
            </div>
          )}

          {task.location && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm capitalize">{task.location}</span>
            </div>
          )}

          {task.timeOfDay && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm capitalize">{task.timeOfDay}</span>
            </div>
          )}

          {task.energyRequired && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Battery className="h-4 w-4 text-gray-500" />
              <span className="text-sm capitalize">{task.energyRequired} energy</span>
            </div>
          )}

          {task.flagged && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
              <Flag className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">Flagged</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Task
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}