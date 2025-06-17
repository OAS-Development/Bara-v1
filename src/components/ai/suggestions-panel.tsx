'use client'

import { useState, useEffect } from 'react'
import { SuggestionEngine, TaskSuggestion } from '@/lib/ai/suggestion-engine'
import { useTaskStore } from '@/stores/task-store'
import { Lightbulb, Clock, MapPin, Battery, ChevronRight, X } from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'

export function SuggestionsPanel() {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(true)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const { tasks } = useTaskStore()
  const suggestionEngine = new SuggestionEngine()

  useEffect(() => {
    loadSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks])

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const activeTasks = tasks.filter((t) => t.status === 'active')
      const nextActions = await suggestionEngine.getNextActionSuggestions(activeTasks)
      setSuggestions(nextActions.filter((s) => !dismissed.has(s.task.id)))
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const dismissSuggestion = (taskId: string) => {
    setDismissed(new Set(Array.from(dismissed).concat(taskId)))
    setSuggestions(suggestions.filter((s) => s.task.id !== taskId))
  }

  const getActionColor = (actionType: TaskSuggestion['actionType']) => {
    switch (actionType) {
      case 'do-now':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'do-next':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'defer':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'delegate':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'drop':
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getActionLabel = (actionType: TaskSuggestion['actionType']) => {
    switch (actionType) {
      case 'do-now':
        return 'Do Now'
      case 'do-next':
        return 'Do Next'
      case 'defer':
        return 'Defer'
      case 'delegate':
        return 'Delegate'
      case 'drop':
        return 'Consider Dropping'
    }
  }

  if (!suggestions.length || loading) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Trigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">AI Suggestions</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm">
              {suggestions.length}
            </span>
          </div>
          <ChevronRight
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        </Collapsible.Trigger>

        <Collapsible.Content>
          <div className="border-t border-gray-200 divide-y divide-gray-100">
            {suggestions.map((suggestion) => (
              <div key={suggestion.task.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getActionColor(suggestion.actionType)}`}
                      >
                        {getActionLabel(suggestion.actionType)}
                      </span>
                      <p className="text-sm font-medium text-gray-900 flex-1">
                        {suggestion.task.title}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600">{suggestion.reason}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {suggestion.task.energy_required && (
                        <span className="flex items-center gap-1">
                          <Battery className="h-3 w-3" />
                          {suggestion.task.energy_required}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => dismissSuggestion(suggestion.task.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <button onClick={loadSuggestions} className="text-sm text-blue-600 hover:text-blue-700">
              Refresh suggestions
            </button>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
