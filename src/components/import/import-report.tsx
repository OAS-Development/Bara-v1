'use client'

import { Download, CheckCircle, AlertCircle, Info } from 'lucide-react'
import type { ImportResult } from '@/lib/import/import-executor'

interface ImportReportProps {
  result: ImportResult
  report: string
  onDownload: () => void
  onClose: () => void
  onViewImported: () => void
}

export function ImportReport({
  result,
  report,
  onDownload,
  onClose,
  onViewImported
}: ImportReportProps) {
  const successRate = result.success 
    ? Math.round(((result.projectsImported + result.tasksImported + result.tagsImported) / 
        (result.projectsImported + result.tasksImported + result.tagsImported + result.duplicatesSkipped)) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className={`border rounded-lg p-6 ${
        result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-4">
          {result.success ? (
            <CheckCircle className="h-8 w-8 text-green-600 mt-1" />
          ) : (
            <AlertCircle className="h-8 w-8 text-red-600 mt-1" />
          )}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              result.success ? 'text-green-900' : 'text-red-900'
            }`}>
              {result.success ? 'Import Completed Successfully!' : 'Import Failed'}
            </h3>
            <p className={`text-sm mt-1 ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.success 
                ? `Successfully imported ${result.tasksImported + result.projectsImported + result.tagsImported} items in ${(result.duration / 1000).toFixed(1)} seconds`
                : 'The import process encountered errors and could not complete'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {result.success && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Projects"
            value={result.projectsImported}
            icon="📁"
          />
          <StatCard
            label="Tasks"
            value={result.tasksImported}
            icon="✓"
          />
          <StatCard
            label="Tags"
            value={result.tagsImported}
            icon="🏷️"
          />
          <StatCard
            label="Duplicates Skipped"
            value={result.duplicatesSkipped}
            icon="⚠️"
          />
        </div>
      )}

      {/* Success Rate */}
      {result.success && successRate < 100 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold">
                {successRate}% Success Rate
              </p>
              <p className="mt-1">
                Some items were skipped as duplicates. This is normal if you&apos;ve imported before or have existing data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Import Errors</h4>
          <ul className="text-xs text-red-700 space-y-1">
            {result.errors.slice(0, 10).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
            {result.errors.length > 10 && (
              <li className="text-gray-600">
                ...and {result.errors.length - 10} more errors
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Report Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Import Report</h4>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
        <pre className="text-xs text-gray-600 overflow-x-auto max-h-48 overflow-y-auto">
          {report}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Close
        </button>
        {result.success && (
          <button
            onClick={onViewImported}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Imported Items
          </button>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}