'use client'

import React, { useState, useEffect } from 'react'
import { useFinanceStore } from '@/stores/finance-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, DollarSign, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react'
import { toast } from 'sonner'

const transactionCategories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Home',
    'Other Expense'
  ]
}

export function TransactionEntry() {
  const { accounts, addTransaction, fetchAccounts, loading } = useFinanceStore()
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense')
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id)
    }
  }, [accounts, accountId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accountId || !amount || isNaN(Number(amount))) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await addTransaction({
        account_id: accountId,
        amount: Number(amount),
        type,
        category: category || undefined,
        description: description || undefined,
        transaction_date: transactionDate
      })

      toast.success('Transaction added successfully')
      setAmount('')
      setDescription('')
      setCategory('')
    } catch (error) {
      toast.error('Failed to add transaction')
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'expense':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'transfer':
        return <ArrowRightLeft className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              onClick={() => setType('income')}
              className="w-full"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Income
            </Button>
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              onClick={() => setType('expense')}
              className="w-full"
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'transfer' ? 'default' : 'outline'}
              onClick={() => setType('transfer')}
              className="w-full"
            >
              <ArrowRightLeft className="w-4 h-4 mr-1" />
              Transfer
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Account</label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span>{account.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ${account.balance?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {type !== 'transfer' && (
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(type === 'income'
                    ? transactionCategories.income
                    : transactionCategories.expense
                  ).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1 block">Date</label>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this transaction..."
              rows={2}
            />
          </div>

          <Button type="submit" disabled={loading || !amount || !accountId} className="w-full">
            {getIcon()}
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
