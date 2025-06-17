'use client'

import { useState } from 'react'
import { ImportMapping, defaultMapping } from '@/lib/import/import-mapper'
import { Tag, Folder, X, Plus } from 'lucide-react'

interface ImportMappingConfigProps {
  mapping: ImportMapping
  unmappedContexts: string[]
  onChange: (mapping: ImportMapping) => void
}

export function ImportMappingConfig({
  mapping,
  unmappedContexts,
  onChange
}: ImportMappingConfigProps) {
  const [newContextName, setNewContextName] = useState('')
  const [newTagName, setNewTagName] = useState('')

  const handleAddMapping = () => {
    if (newContextName && newTagName) {
      onChange({
        ...mapping,
        contextToTag: {
          ...mapping.contextToTag,
          [newContextName]: newTagName
        }
      })
      setNewContextName('')
      setNewTagName('')
    }
  }

  const handleRemoveMapping = (context: string) => {
    const newMapping = { ...mapping.contextToTag }
    delete newMapping[context]
    onChange({
      ...mapping,
      contextToTag: newMapping
    })
  }

  const handleToggleSkipContext = (context: string) => {
    const isSkipped = mapping.skipContexts.includes(context)
    onChange({
      ...mapping,
      skipContexts: isSkipped
        ? mapping.skipContexts.filter(c => c !== context)
        : [...mapping.skipContexts, context]
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Context to Tag Mapping
        </h3>
        
        {unmappedContexts.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-900 mb-2">
              Unmapped Contexts Found:
            </p>
            <div className="flex flex-wrap gap-2">
              {unmappedContexts.map(context => (
                <span
                  key={context}
                  className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                >
                  {context}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {Object.entries(mapping.contextToTag).map(([context, tag]) => (
            <div
              key={context}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{context}</span>
                <span className="text-gray-500">→</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  {tag}
                </span>
              </div>
              <button
                onClick={() => handleRemoveMapping(context)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Context name"
            value={newContextName}
            onChange={(e) => setNewContextName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="flex items-center text-gray-500">→</span>
          <input
            type="text"
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddMapping}
            disabled={!newContextName || !newTagName}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Skip Items
        </h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Contexts to Skip:
            </p>
            <div className="flex flex-wrap gap-2">
              {[...new Set([...unmappedContexts, ...Object.keys(mapping.contextToTag)])].map(context => {
                const isSkipped = mapping.skipContexts.includes(context)
                return (
                  <button
                    key={context}
                    onClick={() => handleToggleSkipContext(context)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      isSkipped
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {context}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}