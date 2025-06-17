'use client';

import React from 'react';
import { useFinanceStore } from '@/stores/finance-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingDown, TrendingUp, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function FinanceWidget() {
  const router = useRouter();
  const { accounts, transactions, budgets, getTotalBalance, getCategorySpending } = useFinanceStore();
  
  const totalBalance = getTotalBalance();
  const recentTransactions = transactions.slice(0, 3);
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getCategorySpending(b.category, b.period === 'monthly' ? 'month' : 'year'), 0);
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Financial Overview
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/life/finance')}
          >
            View All →
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className={cn(
            "text-3xl font-bold",
            totalBalance < 0 && "text-red-500"
          )}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>

        {budgets.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Budget Usage</span>
              <span className={cn(
                "font-medium",
                budgetPercentage > 100 && "text-red-500",
                budgetPercentage > 80 && budgetPercentage <= 100 && "text-yellow-500",
                budgetPercentage <= 80 && "text-green-500"
              )}>
                {budgetPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Recent Transactions</p>
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className="truncate">{transaction.description || transaction.category || 'Transaction'}</span>
                </div>
                <span className={cn(
                  "font-medium",
                  transaction.type === 'income' ? "text-green-500" : "text-red-500"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent transactions</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => router.push('/life/finance?tab=transactions')}
          >
            <CreditCard className="w-4 h-4 mr-1" />
            Add Transaction
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => router.push('/life/finance?tab=accounts')}
          >
            Manage Accounts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}