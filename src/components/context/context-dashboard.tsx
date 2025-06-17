'use client'

import { useState, useEffect } from 'react'
import { ContextEngine, CombinedContext } from '@/lib/context/context-engine'
import { LocationIndicator } from '@/components/location/location-indicator'
import { EnergyPicker } from './energy-picker'
import { TimeRules } from '@/lib/context/time-rules'
import { MapPin, Battery, Clock, Smartphone, Wifi, Lightbulb } from 'lucide-react'

export function ContextDashboard() {
  const [context, setContext] = useState<CombinedContext | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const contextEngine = new ContextEngine()
  const timeRules = new TimeRules()

  useEffect(() => {
    loadContext()
    const interval = setInterval(loadContext, 60000) // Update every minute
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadContext = async () => {
    setLoading(true)
    try {
      const currentContext = await contextEngine.getCurrentContext()
      setContext(currentContext)
      setSuggestions(contextEngine.getContextSuggestions(currentContext))
    } catch (error) {
      console.error('Failed to load context:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !context) {
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const getTimeIcon = () => {
    switch (context.timeOfDay) {
      case 'morning':
        return '🌅'
      case 'afternoon':
        return '☀️'
      case 'evening':
        return '🌇'
      case 'night':
        return '🌙'
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Current Context
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Location
            </p>
            <LocationIndicator />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Time of Day
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <span className="text-lg">{getTimeIcon()}</span>
              <span className="text-sm font-medium capitalize">{context.timeOfDay}</span>
              {context.isBusinessHours && (
                <span className="text-xs bg-blue-100 px-2 py-0.5 rounded">Business Hours</span>
              )}
            </div>
          </div>

          {/* Energy */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Battery className="h-4 w-4" />
              Energy Level
            </p>
            <EnergyPicker />
          </div>

          {/* Device */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              Device
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">{context.device.type}</span>
              {context.device.networkStatus === 'offline' && (
                <Wifi className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Context Suggestions
          </h4>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={loadContext} className="text-sm text-blue-600 hover:text-blue-700">
          Refresh Context
        </button>
      </div>
    </div>
  )
}
