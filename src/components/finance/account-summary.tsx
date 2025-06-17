'use client';

import React, { useEffect } from 'react';
import { useFinanceStore } from '@/stores/finance-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, PiggyBank, TrendingUp, Landmark, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountSummaryProps {
  onAddAccount?: () => void;
}

const accountIcons = {
  checking: <Wallet className="w-4 h-4" />,
  savings: <PiggyBank className="w-4 h-4" />,
  credit: <CreditCard className="w-4 h-4" />,
  investment: <TrendingUp className="w-4 h-4" />,
  loan: <Landmark className="w-4 h-4" />,
};

const accountColors = {
  checking: 'text-blue-500',
  savings: 'text-green-500',
  credit: 'text-orange-500',
  investment: 'text-purple-500',
  loan: 'text-red-500',
};

export function AccountSummary({ onAddAccount }: AccountSummaryProps) {
  const { accounts, fetchAccounts, getTotalBalance } = useFinanceStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const totalBalance = getTotalBalance();
  const activeAccounts = accounts.filter(a => a.active);

  if (activeAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Account Summary
            </span>
            <Button onClick={onAddAccount} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Account
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No accounts added yet.</p>
            <p className="text-sm mt-2">Add your financial accounts to start tracking!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Account Summary
          </span>
          <div className="text-2xl font-bold">
            ${totalBalance.toFixed(2)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeAccounts.map(account => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full bg-muted", accountColors[account.type])}>
                  {accountIcons[account.type]}
                </div>
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {account.type}
                    </Badge>
                    {account.institution && (
                      <span>{account.institution}</span>
                    )}
                    {account.account_number_last4 && (
                      <span>****{account.account_number_last4}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "text-lg font-semibold",
                  account.type === 'loan' || account.type === 'credit' 
                    ? account.balance && account.balance > 0 ? "text-red-500" : "text-green-500"
                    : account.balance && account.balance < 0 ? "text-red-500" : ""
                )}>
                  ${account.balance?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {account.currency}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button onClick={onAddAccount} variant="outline" size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-1" />
            Add New Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}