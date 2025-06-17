'use client'

import { useState } from 'react'
import { Info, AlertCircle } from 'lucide-react'
import type { ImportOptions } from '@/lib/import/import-executor'

interface ImportMappingConfigProps {
  unmappedContexts: string[]
  duplicateTasks: string[]
  warnings: string[]
  onConfigChange: (options: ImportOptions) => void
}

export function ImportMappingConfig({
  unmappedContexts,
  duplicateTasks,
  warnings,
  onConfigChange
}: ImportMappingConfigProps) {
  const [options, setOptions] = useState<ImportOptions>({
    duplicateStrategy: 'skip',
    importCompleted: false,
    preserveHierarchy: true
  })

  const updateOptions = (update: Partial<ImportOptions>) => {
    const newOptions = { ...options, ...update }
    setOptions(newOptions)
    onConfigChange(newOptions)
  }

  return (
    <div className="space-y-6">
      {/* Configuration Options */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Import Options</h3>

        <div className="space-y-4">
          {/* Duplicate Strategy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duplicate Handling
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="duplicateStrategy"
                  value="skip"
                  checked={options.duplicateStrategy === 'skip'}
                  onChange={(e) => updateOptions({ duplicateStrategy: 'skip' })}
                  className="mr-2"
                />
                <span className="text-sm">Skip duplicates (recommended)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="duplicateStrategy"
                  value="create-new"
                  checked={options.duplicateStrategy === 'create-new'}
                  onChange={(e) => updateOptions({ duplicateStrategy: 'create-new' })}
                  className="mr-2"
                />
                <span className="text-sm">
                  Create new items with &ldquo;(imported)&rdquo; suffix
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="duplicateStrategy"
                  value="replace"
                  checked={options.duplicateStrategy === 'replace'}
                  onChange={(e) => updateOptions({ duplicateStrategy: 'replace' })}
                  className="mr-2"
                />
                <span className="text-sm">Replace existing items (overwrites data)</span>
              </label>
            </div>
          </div>

          {/* Import Completed Tasks */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.importCompleted}
                onChange={(e) => updateOptions({ importCompleted: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Import completed tasks</span>
            </label>
            <p className="text-xs text-gray-500 ml-6 mt-1">
              Include tasks that are already marked as completed
            </p>
          </div>

          {/* Preserve Hierarchy */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.preserveHierarchy}
                onChange={(e) => updateOptions({ preserveHierarchy: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Preserve project/task hierarchy
              </span>
            </label>
            <p className="text-xs text-gray-500 ml-6 mt-1">
              Maintain parent-child relationships from OmniFocus
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <h4 className="font-semibold mb-2">Warnings</h4>
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Unmapped Contexts */}
      {unmappedContexts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <h4 className="font-semibold mb-2">New Tags Will Be Created</h4>
              <p className="mb-2">The following OmniFocus contexts will be imported as new tags:</p>
              <div className="flex flex-wrap gap-2">
                {unmappedContexts.map((context) => (
                  <span
                    key={context}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {context}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Tasks */}
      {duplicateTasks.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-800">
              <h4 className="font-semibold mb-2">Duplicate Task Names Detected</h4>
              <p className="mb-2">The following task names appear multiple times:</p>
              <ul className="list-disc list-inside space-y-1">
                {duplicateTasks.slice(0, 10).map((task, index) => (
                  <li key={index} className="text-xs">
                    {task}
                  </li>
                ))}
                {duplicateTasks.length > 10 && (
                  <li className="text-xs text-gray-500">
                    ...and {duplicateTasks.length - 10} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
