'use client'

import React, { useEffect } from 'react'
import { useFinanceStore } from '@/stores/finance-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { PieChart, DollarSign, AlertCircle, TrendingUp, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BudgetOverviewProps {
  onAddBudget?: () => void
}

export function BudgetOverview({ onAddBudget }: BudgetOverviewProps) {
  const { budgets, fetchBudgets, getBudgetUsage } = useFinanceStore()

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => {
    const { spent } = getBudgetUsage(budget.id)
    return sum + spent
  }, 0)
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Budget Overview
            </span>
            <Button onClick={onAddBudget} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Budget
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No budgets set up yet.</p>
            <p className="text-sm mt-2">Create budgets to track your spending!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Budget Overview
          </span>
          <div className="text-sm text-muted-foreground">
            ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Budget</span>
            <span
              className={cn(
                'text-sm font-medium',
                overallPercentage > 100 && 'text-red-500',
                overallPercentage > 80 && overallPercentage <= 100 && 'text-yellow-500',
                overallPercentage <= 80 && 'text-green-500'
              )}
            >
              {overallPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={Math.min(overallPercentage, 100)} className="h-3" />
        </div>

        <div className="space-y-3">
          {budgets.map((budget) => {
            const { spent, percentage } = getBudgetUsage(budget.id)
            const isOverBudget = percentage > 100
            const isNearLimit = percentage > 80 && percentage <= 100

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{budget.category}</span>
                    {isOverBudget && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                    <span
                      className={cn(
                        'ml-2 font-medium',
                        isOverBudget && 'text-red-500',
                        isNearLimit && 'text-yellow-500',
                        !isOverBudget && !isNearLimit && 'text-green-500'
                      )}
                    >
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={cn(
                    'h-2',
                    isOverBudget && 'bg-red-100',
                    isNearLimit && 'bg-yellow-100'
                  )}
                />
              </div>
            )
          })}
        </div>

        <div className="pt-2 border-t">
          <Button onClick={onAddBudget} variant="outline" size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-1" />
            Add New Budget
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
