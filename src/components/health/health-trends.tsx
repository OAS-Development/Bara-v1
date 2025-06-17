'use client'

import React, { useEffect, useState } from 'react'
import { useHealthStore, MetricType } from '@/stores/health-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { format, subDays } from 'date-fns'
import { TrendingUp, TrendingDown, Minus, Activity, Calendar } from 'lucide-react'

const metricLabels: Record<MetricType, string> = {
  weight: 'Weight (lbs)',
  sleep_hours: 'Sleep (hours)',
  steps: 'Steps',
  heart_rate: 'Heart Rate (bpm)',
  blood_pressure_systolic: 'Blood Pressure Systolic (mmHg)',
  blood_pressure_diastolic: 'Blood Pressure Diastolic (mmHg)',
  calories: 'Calories (kcal)',
  water_intake: 'Water (oz)',
  exercise_minutes: 'Exercise (minutes)'
}

export function HealthTrends() {
  const { metrics, fetchMetrics, getLatestMetric } = useHealthStore()
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight')
  const [timeRange, setTimeRange] = useState(30)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    fetchMetrics(selectedMetric, timeRange)
  }, [fetchMetrics, selectedMetric, timeRange])

  useEffect(() => {
    const filteredMetrics = metrics.filter((m) => m.metric_type === selectedMetric)
    const sortedMetrics = filteredMetrics.sort(
      (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    )

    const data = sortedMetrics.map((metric) => ({
      date: format(new Date(metric.recorded_at), 'MMM d'),
      value: metric.value,
      fullDate: metric.recorded_at
    }))

    setChartData(data)
  }, [metrics, selectedMetric])

  const calculateTrend = () => {
    if (chartData.length < 2) return { trend: 'neutral', change: 0 }

    const firstValue = chartData[0].value
    const lastValue = chartData[chartData.length - 1].value
    const change = lastValue - firstValue
    const percentChange = (change / firstValue) * 100

    if (Math.abs(percentChange) < 1) return { trend: 'neutral', change: 0 }
    return { trend: change > 0 ? 'up' : 'down', change: percentChange }
  }

  const { trend, change } = calculateTrend()
  const latestMetric = getLatestMetric(selectedMetric)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Health Trends
          </span>
          <div className="flex items-center gap-2">
            <Select
              value={selectedMetric}
              onValueChange={(value) => setSelectedMetric(value as MetricType)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(metricLabels).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={timeRange === 7 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(7)}
              >
                7d
              </Button>
              <Button
                variant={timeRange === 30 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(30)}
              >
                30d
              </Button>
              <Button
                variant={timeRange === 90 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(90)}
              >
                90d
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {latestMetric?.value ?? '--'} {latestMetric?.unit}
                </p>
                <p className="text-sm text-muted-foreground">
                  Current {metricLabels[selectedMetric]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {trend === 'up' && (
                  <>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-500">+{change.toFixed(1)}%</span>
                  </>
                )}
                {trend === 'down' && (
                  <>
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-500">{change.toFixed(1)}%</span>
                  </>
                )}
                {trend === 'neutral' && (
                  <>
                    <Minus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">No change</span>
                  </>
                )}
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'currentColor' }} />
                  <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No data available for this metric.</p>
            <p className="text-sm mt-2">Start tracking to see trends!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
