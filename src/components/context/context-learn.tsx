'use client'

import { useState } from 'react'
import { Brain, TrendingUp, Clock, MapPin, Battery, CheckCircle } from 'lucide-react'
import { ContextEngine } from '@/lib/context/context-engine'
import * as Progress from '@radix-ui/react-progress'

interface ContextPattern {
  pattern: string
  confidence: number
  examples: number
}

export function ContextLearn() {
  const [patterns, setPatterns] = useState<ContextPattern[]>([
    {
      pattern: 'High-energy tasks completed in morning',
      confidence: 0.85,
      examples: 42
    },
    {
      pattern: 'Work tasks preferred at office location',
      confidence: 0.92,
      examples: 68
    },
    {
      pattern: 'Simple tasks done on mobile during commute',
      confidence: 0.78,
      examples: 31
    },
    {
      pattern: 'Planning tasks in evening hours',
      confidence: 0.71,
      examples: 25
    }
  ])

  const [learningEnabled, setLearningEnabled] = useState(true)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Context Learning
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={learningEnabled}
            onChange={(e) => setLearningEnabled(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Enable learning</span>
        </label>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            The system is learning from your task completion patterns to provide better context-aware suggestions.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Discovered Patterns</h4>
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{pattern.pattern}</p>
                      <p className="text-xs text-gray-600">{pattern.examples} examples</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(pattern.confidence * 100)}%
                  </span>
                </div>
                <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2">
                  <Progress.Indicator
                    className="bg-blue-600 w-full h-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${100 - pattern.confidence * 100}%)` }}
                  />
                </Progress.Root>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Privacy & Data</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>All learning data is stored locally on your device</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>No personal information is shared or transmitted</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>You can disable learning or clear data at any time</span>
            </li>
          </ul>
          
          <button
            className="mt-3 text-sm text-red-600 hover:text-red-700"
            onClick={() => {
              if (confirm('Clear all learning data? This cannot be undone.')) {
                setPatterns([])
              }
            }}
          >
            Clear learning data
          </button>
        </div>
      </div>
    </div>
  )
}