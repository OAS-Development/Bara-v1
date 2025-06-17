'use client'

import { useState } from 'react'
import { OmniFocusParser } from '@/lib/import/omnifocus-parser'
import { FileText, Folder, Tag, CheckCircle, AlertCircle } from 'lucide-react'

interface ImportPreviewProps {
  file: File
  onProceed: (data: any) => void
  onCancel: () => void
}

export function ImportPreview({ file, onProceed, onCancel }: ImportPreviewProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<any>(null)
  const [statistics, setStatistics] = useState<any>(null)

  useState(() => {
    parseFile()
  })

  const parseFile = async () => {
    setLoading(true)
    setError(null)

    try {
      const parser = new OmniFocusParser()
      const data = await parser.parseArchive(file)
      const stats = parser.getStatistics(data)
      
      setParsedData(data)
      setStatistics(stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Parsing OmniFocus archive...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Parse Error</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!statistics) return null

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Import Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <Folder className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.totalProjects}</p>
            <p className="text-sm text-gray-600">Projects</p>
            <p className="text-xs text-gray-500">{statistics.activeProjects} active</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.totalTasks}</p>
            <p className="text-sm text-gray-600">Tasks</p>
            <p className="text-xs text-gray-500">{statistics.completedTasks} completed</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <Tag className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.totalContexts}</p>
            <p className="text-sm text-gray-600">Contexts</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.completionRate}%</p>
            <p className="text-sm text-gray-600">Complete</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Import Notes</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• OmniFocus contexts will be converted to tags</li>
          <li>• Location-based contexts will lose their location data</li>
          <li>• Completed items will be imported but marked as completed</li>
          <li>• Project hierarchy and types will be preserved</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">Ready to Import?</h4>
        <p className="text-sm text-blue-800 mb-4">
          This will create {statistics.totalProjects} projects and {statistics.totalTasks} tasks in your Bara workspace.
          The import process may take a few moments.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onProceed(parsedData)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Import
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}