'use client'

import { useState } from 'react'
import { Brain, Sparkles, Shield, Zap, Info } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'

interface AISettings {
  enabled: boolean
  naturalLanguageInput: boolean
  smartSuggestions: boolean
  patternLearning: boolean
  autoContextDetection: boolean
  suggestionFrequency: 'realtime' | 'periodic' | 'manual'
  confidenceThreshold: number
}

export function AISettings() {
  const [settings, setSettings] = useState<AISettings>({
    enabled: true,
    naturalLanguageInput: true,
    smartSuggestions: true,
    patternLearning: true,
    autoContextDetection: true,
    suggestionFrequency: 'periodic',
    confidenceThreshold: 0.7
  })

  const updateSetting = <K extends keyof AISettings>(
    key: K,
    value: AISettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">AI Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Master Switch */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Enable AI Features</p>
              <p className="text-sm text-gray-600">
                Turn on intelligent task management
              </p>
            </div>
          </div>
          <Switch.Root
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
            className="w-12 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
          >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform data-[state=checked]:translate-x-6 translate-x-0.5" />
          </Switch.Root>
        </div>

        {settings.enabled && (
          <>
            {/* Feature Toggles */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Features</h3>
              
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Natural Language Input</span>
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded">
                      Create tasks using everyday language
                    </div>
                  </div>
                </div>
                <Switch.Root
                  checked={settings.naturalLanguageInput}
                  onCheckedChange={(checked) => updateSetting('naturalLanguageInput', checked)}
                  className="w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform data-[state=checked]:translate-x-5 translate-x-1" />
                </Switch.Root>
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Smart Suggestions</span>
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded">
                      AI-powered task recommendations
                    </div>
                  </div>
                </div>
                <Switch.Root
                  checked={settings.smartSuggestions}
                  onCheckedChange={(checked) => updateSetting('smartSuggestions', checked)}
                  className="w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform data-[state=checked]:translate-x-5 translate-x-1" />
                </Switch.Root>
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Pattern Learning</span>
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded">
                      Learn from your task completion habits
                    </div>
                  </div>
                </div>
                <Switch.Root
                  checked={settings.patternLearning}
                  onCheckedChange={(checked) => updateSetting('patternLearning', checked)}
                  className="w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform data-[state=checked]:translate-x-5 translate-x-1" />
                </Switch.Root>
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Auto Context Detection</span>
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded">
                      Automatically detect location, time, and energy
                    </div>
                  </div>
                </div>
                <Switch.Root
                  checked={settings.autoContextDetection}
                  onCheckedChange={(checked) => updateSetting('autoContextDetection', checked)}
                  className="w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform data-[state=checked]:translate-x-5 translate-x-1" />
                </Switch.Root>
              </label>
            </div>

            {/* Suggestion Frequency */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Suggestion Frequency</h3>
              <div className="space-y-2">
                {(['realtime', 'periodic', 'manual'] as const).map((freq) => (
                  <label key={freq} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={settings.suggestionFrequency === freq}
                      onChange={() => updateSetting('suggestionFrequency', freq)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">
                      {freq === 'realtime' && 'Real-time (as you work)'}
                      {freq === 'periodic' && 'Periodic (every hour)'}
                      {freq === 'manual' && 'Manual (on demand)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Confidence Threshold */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">AI Confidence Threshold</h3>
                <span className="text-sm text-gray-600">
                  {Math.round(settings.confidenceThreshold * 100)}%
                </span>
              </div>
              <Slider.Root
                value={[settings.confidenceThreshold]}
                onValueChange={([value]) => updateSetting('confidenceThreshold', value)}
                max={1}
                step={0.1}
                className="relative flex items-center select-none touch-none w-full h-5"
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Slider.Root>
              <p className="text-xs text-gray-500 mt-2">
                Higher threshold means AI will only make suggestions when very confident
              </p>
            </div>
          </>
        )}

        {/* Privacy Notice */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Privacy First</p>
              <p className="text-sm text-blue-800 mt-1">
                All AI processing happens locally. Your data never leaves your device
                unless you explicitly enable cloud features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}