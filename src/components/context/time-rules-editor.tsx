'use client'

import { useState } from 'react'
import {
  TimeRule,
  TimeWindow,
  TimeOfDay,
  DayType,
  DEFAULT_TIME_WINDOWS
} from '@/lib/context/time-rules'
import { Clock, Calendar, Plus, Trash2, Edit2 } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'

interface TimeRulesEditorProps {
  rules: TimeRule[]
  onRulesChange: (rules: TimeRule[]) => void
}

export function TimeRulesEditor({ rules, onRulesChange }: TimeRulesEditorProps) {
  const [editingRule, setEditingRule] = useState<TimeRule | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleSaveRule = (rule: TimeRule) => {
    if (editingRule) {
      onRulesChange(rules.map((r) => (r.id === rule.id ? rule : r)))
    } else {
      onRulesChange([...rules, { ...rule, id: `rule_${Date.now()}` }])
    }
    setEditingRule(null)
    setIsAddingNew(false)
  }

  const handleDeleteRule = (id: string) => {
    onRulesChange(rules.filter((r) => r.id !== id))
  }

  const handleToggleRule = (id: string) => {
    onRulesChange(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  const RuleDialog = ({
    rule,
    onSave,
    onClose
  }: {
    rule?: TimeRule
    onSave: (rule: TimeRule) => void
    onClose: () => void
  }) => {
    const [name, setName] = useState(rule?.name || '')
    const [selectedWindows, setSelectedWindows] = useState<string[]>(
      rule?.timeWindows.map((w) => w.name) || []
    )
    const [selectedDayTypes, setSelectedDayTypes] = useState<DayType[]>(
      rule?.dayTypes || ['weekday']
    )

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      const timeWindows = DEFAULT_TIME_WINDOWS.filter((w) => selectedWindows.includes(w.name))

      onSave({
        id: rule?.id || '',
        name,
        enabled: rule?.enabled ?? true,
        timeWindows,
        dayTypes: selectedDayTypes
      })
    }

    return (
      <Dialog.Root open={true} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {rule ? 'Edit Time Rule' : 'Add Time Rule'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Windows</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {DEFAULT_TIME_WINDOWS.map((window) => (
                    <label
                      key={window.name}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWindows.includes(window.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedWindows([...selectedWindows, window.name])
                          } else {
                            setSelectedWindows(selectedWindows.filter((w) => w !== window.name))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="flex-1">
                        {window.name} ({window.startHour}:00 - {window.endHour}:00)
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                <div className="flex gap-2">
                  {(['weekday', 'weekend', 'holiday'] as DayType[]).map((dayType) => (
                    <label
                      key={dayType}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDayTypes.includes(dayType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDayTypes([...selectedDayTypes, dayType])
                          } else {
                            setSelectedDayTypes(selectedDayTypes.filter((d) => d !== dayType))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="capitalize">{dayType}s</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Rule
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Rules
        </h3>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 bg-white rounded-lg border ${
              rule.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch.Root
                  checked={rule.enabled}
                  onCheckedChange={() => handleToggleRule(rule.id)}
                  className="w-10 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform data-[state=checked]:translate-x-5 translate-x-1" />
                </Switch.Root>
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-gray-600">
                    {rule.timeWindows.length} time window{rule.timeWindows.length !== 1 ? 's' : ''},{' '}
                    {rule.dayTypes.join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingRule(rule)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isAddingNew || editingRule) && (
        <RuleDialog
          rule={editingRule || undefined}
          onSave={handleSaveRule}
          onClose={() => {
            setIsAddingNew(false)
            setEditingRule(null)
          }}
        />
      )}
    </div>
  )
}
