'use client'

import { useState } from 'react'
import { useEnergyStore, EnergyLevel } from '@/stores/energy-store'
import { Battery, BatteryLow, BatteryMedium, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

const energyConfig: Record<EnergyLevel, { icon: React.ReactNode; color: string; label: string }> = {
  low: {
    icon: <BatteryLow className="h-5 w-5" />,
    color: 'text-red-600 bg-red-50 border-red-200',
    label: 'Low Energy'
  },
  medium: {
    icon: <BatteryMedium className="h-5 w-5" />,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    label: 'Medium Energy'
  },
  high: {
    icon: <Battery className="h-5 w-5" />,
    color: 'text-green-600 bg-green-50 border-green-200',
    label: 'High Energy'
  }
}

export function EnergyPicker() {
  const { currentLevel, setEnergyLevel, getEnergyTrend, lastUpdated } = useEnergyStore()
  const [showDialog, setShowDialog] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<EnergyLevel>(currentLevel)
  const [note, setNote] = useState('')

  const trend = getEnergyTrend()
  const config = energyConfig[currentLevel]

  const handleSave = () => {
    setEnergyLevel(selectedLevel, note.trim() || undefined)
    setNote('')
    setShowDialog(false)
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:opacity-80 ${config.color}`}
      >
        {config.icon}
        <span className="text-sm font-medium">{config.label}</span>
        {getTrendIcon()}
      </button>

      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-4">Update Energy Level</Dialog.Title>

            <div className="space-y-4">
              <div className="space-y-2">
                {(
                  Object.entries(energyConfig) as [
                    EnergyLevel,
                    (typeof energyConfig)[EnergyLevel]
                  ][]
                ).map(([level, cfg]) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors ${
                      selectedLevel === level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={cfg.color.split(' ')[0]}>{cfg.icon}</div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{cfg.label}</p>
                      <p className="text-sm text-gray-600">
                        {level === 'high' && 'Ready for complex tasks'}
                        {level === 'medium' && 'Good for regular tasks'}
                        {level === 'low' && 'Best for simple tasks'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How are you feeling?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {lastUpdated && (
                <p className="text-xs text-gray-500 text-center">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
