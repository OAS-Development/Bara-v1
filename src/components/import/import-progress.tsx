'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'
import type { ImportProgress } from '@/lib/import/import-executor'

interface ImportProgressProps {
  progress: ImportProgress
}

export function ImportProgress({ progress }: ImportProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getPhaseStatus = (phase: ImportProgress['phase']) => {
    const phases: ImportProgress['phase'][] = ['preparing', 'tags', 'projects', 'tasks', 'completing', 'done']
    const currentIndex = phases.indexOf(progress.phase)
    const phaseIndex = phases.indexOf(phase)

    if (progress.phase === 'error') return 'error'
    if (phaseIndex < currentIndex) return 'complete'
    if (phaseIndex === currentIndex) return 'active'
    return 'pending'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const percentage = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {progress.current} of {progress.total} items</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="space-y-3">
        <PhaseIndicator
          name="Preparing"
          description="Validating import data"
          status={getPhaseStatus('preparing')}
        />
        <PhaseIndicator
          name="Tags"
          description="Importing contexts as tags"
          status={getPhaseStatus('tags')}
        />
        <PhaseIndicator
          name="Projects"
          description="Creating project hierarchy"
          status={getPhaseStatus('projects')}
        />
        <PhaseIndicator
          name="Tasks"
          description="Importing tasks and assignments"
          status={getPhaseStatus('tasks')}
        />
        <PhaseIndicator
          name="Completing"
          description="Finalizing import"
          status={getPhaseStatus('completing')}
        />
      </div>

      {/* Current Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">{progress.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          Elapsed time: {formatTime(elapsedTime)}
        </p>
      </div>

      {/* Errors */}
      {progress.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Errors</h4>
          <ul className="text-xs text-red-700 space-y-1">
            {progress.errors.slice(-5).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PhaseIndicator({ 
  name, 
  description, 
  status 
}: { 
  name: string
  description: string
  status: 'pending' | 'active' | 'complete' | 'error' 
}) {
  return (
    <div className="flex items-center gap-3">
      {status === 'complete' && (
        <CheckCircle className="h-5 w-5 text-green-600" />
      )}
      {status === 'active' && (
        <Circle className="h-5 w-5 text-blue-600 animate-pulse" />
      )}
      {status === 'pending' && (
        <Circle className="h-5 w-5 text-gray-300" />
      )}
      {status === 'error' && (
        <AlertCircle className="h-5 w-5 text-red-600" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          status === 'active' ? 'text-blue-600' : 
          status === 'complete' ? 'text-green-600' :
          status === 'error' ? 'text-red-600' :
          'text-gray-400'
        }`}>
          {name}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}