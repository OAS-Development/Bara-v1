'use client'

import { ImportProgress } from '@/lib/import/import-executor'
import { CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react'

interface ImportProgressProps {
  progress: ImportProgress
}

export function ImportProgressDisplay({ progress }: ImportProgressProps) {
  const progressPercentage = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100)
    : 0

  const getPhaseIcon = () => {
    switch (progress.phase) {
      case 'preparing':
        return <Clock className="h-6 w-6 text-blue-500" />
      case 'projects':
      case 'tasks':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      case 'completing':
        return <Clock className="h-6 w-6 text-green-500" />
      case 'done':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />
    }
  }

  const getPhaseColor = () => {
    switch (progress.phase) {
      case 'error':
        return 'bg-red-500'
      case 'done':
        return 'bg-green-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {getPhaseIcon()}
        <div className="flex-1">
          <p className="font-medium text-gray-900">
            {progress.message}
          </p>
          <p className="text-sm text-gray-600">
            {progress.current} of {progress.total} items processed
          </p>
        </div>
        <span className="text-2xl font-bold text-gray-900">
          {progressPercentage}%
        </span>
      </div>

      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${getPhaseColor()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {progress.errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2">Import Warnings:</h4>
          <ul className="space-y-1">
            {progress.errors.slice(-5).map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                • {error}
              </li>
            ))}
          </ul>
          {progress.errors.length > 5 && (
            <p className="text-sm text-red-600 mt-2">
              And {progress.errors.length - 5} more...
            </p>
          )}
        </div>
      )}
    </div>
  )
}