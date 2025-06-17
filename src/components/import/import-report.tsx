'use client'

import { ImportResult } from '@/lib/import/import-executor'
import { CheckCircle, AlertCircle, FileText, Folder, Clock, XCircle } from 'lucide-react'

interface ImportReportProps {
  result: ImportResult
  onDone: () => void
}

export function ImportReport({ result, onDone }: ImportReportProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`
  }

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          {result.success ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <h3 className={`text-xl font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
            {result.success ? 'Import Completed Successfully!' : 'Import Failed'}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <Folder className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{result.projectsImported}</p>
            <p className="text-sm text-gray-600">Projects Imported</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <FileText className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{result.tasksImported}</p>
            <p className="text-sm text-gray-600">Tasks Imported</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{result.duplicatesSkipped}</p>
            <p className="text-sm text-gray-600">Duplicates Skipped</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatDuration(result.duration)}</p>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
        </div>
      </div>

      {result.errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Import Errors ({result.errors.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {result.errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700 p-2 bg-red-100 rounded">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Review your imported projects and tasks in the main view</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Set up your preferred tags and contexts</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Configure review schedules for imported projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>All imported items are tagged with &ldquo;omnifocus-import&rdquo; for easy filtering</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onDone}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}