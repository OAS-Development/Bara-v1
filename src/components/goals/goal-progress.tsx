'use client'

import React, { useMemo } from 'react'
import { Goal } from '@/stores/goals-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Target, TrendingUp, Award, Clock } from 'lucide-react'

interface GoalProgressProps {
  goals: Goal[]
}

const categoryColors = {
  health: '#10b981',
  finance: '#3b82f6',
  career: '#8b5cf6',
  personal: '#eab308',
  relationships: '#ec4899',
  learning: '#f97316'
}

export function GoalProgress({ goals }: GoalProgressProps) {
  const stats = useMemo(() => {
    const activeGoals = goals.filter((g) => g.status === 'active')
    const completedGoals = goals.filter((g) => g.status === 'completed')
    const pausedGoals = goals.filter((g) => g.status === 'paused')

    const categoryData = Object.entries(
      goals.reduce(
        (acc, goal) => {
          if (goal.category) {
            acc[goal.category] = (acc[goal.category] || 0) + 1
          }
          return acc
        },
        {} as Record<string, number>
      )
    ).map(([name, value]) => ({ name, value }))

    const avgProgress =
      activeGoals.length > 0
        ? activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length
        : 0

    return {
      total: goals.length,
      active: activeGoals.length,
      completed: completedGoals.length,
      paused: pausedGoals.length,
      avgProgress,
      categoryData
    }
  }, [goals])

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No goals created yet.</p>
            <p className="text-sm mt-2">Set your first goal to start tracking progress!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Goal Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.paused}</div>
            <div className="text-sm text-muted-foreground">Paused</div>
          </div>
        </div>

        {stats.active > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Progress
              </span>
              <span className="text-sm font-medium">{Math.round(stats.avgProgress)}%</span>
            </div>
            <Progress value={stats.avgProgress} className="h-3" />
          </div>
        )}

        {stats.categoryData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Goals by Category</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[entry.name as keyof typeof categoryColors] || '#666'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>
              {stats.completed > 0
                ? `You've completed ${stats.completed} goal${stats.completed > 1 ? 's' : ''}!`
                : 'Keep working towards your goals!'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
