import { create } from 'zustand'
import { api, isApiError, type ApiError } from '@/lib/api/client'

export interface FinancialAccount {
  id: string
  user_id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan'
  balance?: number
  currency: string
  institution?: string
  account_number_last4?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface FinancialTransaction {
  id: string
  account_id: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  category?: string
  description?: string
  transaction_date: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
  period: 'monthly' | 'yearly'
  start_date: string
  end_date?: string
  active: boolean
  created_at: string
  updated_at: string
}

interface FinanceStore {
  accounts: FinancialAccount[]
  transactions: FinancialTransaction[]
  budgets: Budget[]
  loading: boolean
  error: ApiError | null

  // Account actions
  fetchAccounts: () => Promise<void>
  addAccount: (
    account: Omit<FinancialAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => Promise<void>
  updateAccount: (id: string, updates: Partial<FinancialAccount>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>

  // Transaction actions
  fetchTransactions: (accountId?: string, days?: number) => Promise<void>
  addTransaction: (
    transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<void>
  updateTransaction: (id: string, updates: Partial<FinancialTransaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  // Budget actions
  fetchBudgets: () => Promise<void>
  addBudget: (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>

  // Computed
  getTotalBalance: () => number
  getAccountBalance: (accountId: string) => number
  getCategorySpending: (category: string, period: 'month' | 'year') => number
  getBudgetUsage: (budgetId: string) => { spent: number; percentage: number }
  
  // Error management
  clearError: () => void
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
      accounts: [],
      transactions: [],
      budgets: [],
      loading: false,
      error: null,

      // Account actions
      fetchAccounts: async () => {
        set({ loading: true, error: null })
        
        const result = await api.query(
          async () => api.client
            .from('financial_accounts')
            .select('*')
            .order('created_at', { ascending: false }),
          { errorContext: 'Failed to fetch accounts' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ accounts: result.data, loading: false })
      },

      addAccount: async (account) => {
        set({ loading: true, error: null })
        
        const userResult = await api.query(
          () => api.client.auth.getUser(),
          { showToast: false }
        )

        if (isApiError(userResult) || !userResult.data.user) {
          set({ loading: false, error: { message: 'Not authenticated' } })
          return
        }

        const result = await api.mutate(
          async () => api.client
            .from('financial_accounts')
            .insert({
              ...account,
              user_id: userResult.data.user.id
            })
            .select()
            .single(),
          { 
            successMessage: 'Account created successfully',
            errorContext: 'Failed to create account' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          accounts: [result.data, ...state.accounts],
          loading: false
        }))
      },

      updateAccount: async (id, updates) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          async () => api.client
            .from('financial_accounts')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single(),
          { 
            successMessage: 'Account updated successfully',
            errorContext: 'Failed to update account' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? result.data : a)),
          loading: false
        }))
      },

      deleteAccount: async (id) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          async () => api.client.from('financial_accounts').delete().eq('id', id),
          { 
            successMessage: 'Account deleted successfully',
            errorContext: 'Failed to delete account' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
          transactions: state.transactions.filter((t) => t.account_id !== id),
          loading: false
        }))
      },

      // Transaction actions
      fetchTransactions: async (accountId?: string, days: number = 30) => {
        set({ loading: true, error: null })
        
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        let queryBuilder = async () => {
          let query = api.client
            .from('financial_transactions')
            .select('*')
            .gte('transaction_date', startDate.toISOString().split('T')[0])
            .order('transaction_date', { ascending: false })

          if (accountId) {
            query = query.eq('account_id', accountId)
          }

          return query
        }

        const result = await api.query(
          queryBuilder,
          { errorContext: 'Failed to fetch transactions' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ transactions: result.data, loading: false })
      },

      addTransaction: async (transaction) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          async () => api.client
            .from('financial_transactions')
            .insert(transaction)
            .select()
            .single(),
          { 
            successMessage: 'Transaction added successfully',
            errorContext: 'Failed to add transaction' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        // Update account balance if needed
        const account = get().accounts.find((a) => a.id === transaction.account_id)
        if (account && account.balance !== undefined) {
          const balanceChange =
            transaction.type === 'income' ? transaction.amount : -transaction.amount

          await get().updateAccount(account.id, {
            balance: account.balance + balanceChange
          })
        }

        set((state) => ({
          transactions: [result.data, ...state.transactions],
          loading: false
        }))
      },

      updateTransaction: async (id, updates) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          async () => api.client
            .from('financial_transactions')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single(),
          { 
            successMessage: 'Transaction updated successfully',
            errorContext: 'Failed to update transaction' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? result.data : t)),
          loading: false
        }))
      },

      deleteTransaction: async (id) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          async () => api.client.from('financial_transactions').delete().eq('id', id),
          { 
            successMessage: 'Transaction deleted successfully',
            errorContext: 'Failed to delete transaction' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          loading: false
        }))
      },

      // Budget actions
      fetchBudgets: async () => {
        set({ loading: true, error: null })
        
        const result = await api.query(
          () => api.client
            .from('budgets')
            .select('*')
            .eq('active', true)
            .order('category'),
          { errorContext: 'Failed to fetch budgets' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ budgets: result.data, loading: false })
      },

      addBudget: async (budget) => {
        set({ loading: true, error: null })
        
        const userResult = await api.query(
          () => api.client.auth.getUser(),
          { showToast: false }
        )

        if (isApiError(userResult) || !userResult.data.user) {
          set({ loading: false, error: { message: 'Not authenticated' } })
          return
        }

        const result = await api.mutate(
          async () => api.client
            .from('budgets')
            .insert({
              ...budget,
              user_id: userResult.data.user.id
            })
            .select()
            .single(),
          { 
            successMessage: 'Budget created successfully',
            errorContext: 'Failed to create budget' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          budgets: [...state.budgets, result.data],
          loading: false
        }))
      },

      updateBudget: async (id, updates) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          async () => api.client
            .from('budgets')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single(),
          { 
            successMessage: 'Budget updated successfully',
            errorContext: 'Failed to update budget' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === id ? result.data : b)),
          loading: false
        }))
      },

      deleteBudget: async (id) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          async () => api.client.from('budgets').delete().eq('id', id),
          { 
            successMessage: 'Budget deleted successfully',
            errorContext: 'Failed to delete budget' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
          loading: false
        }))
      },

      // Computed
      getTotalBalance: () => {
        const accounts = get().accounts
        return accounts.reduce((total, account) => total + (account.balance || 0), 0)
      },

      getAccountBalance: (accountId: string) => {
        const account = get().accounts.find((a) => a.id === accountId)
        return account?.balance || 0
      },

      getCategorySpending: (category: string, period: 'month' | 'year') => {
        const transactions = get().transactions
        const now = new Date()
        const startDate = new Date(now)

        if (period === 'month') {
          startDate.setMonth(now.getMonth() - 1)
        } else {
          startDate.setFullYear(now.getFullYear() - 1)
        }

        return transactions
          .filter(
            (t) =>
              t.type === 'expense' &&
              t.category === category &&
              new Date(t.transaction_date) >= startDate
          )
          .reduce((total, t) => total + t.amount, 0)
      },

      getBudgetUsage: (budgetId: string) => {
        const budget = get().budgets.find((b) => b.id === budgetId)
        if (!budget) return { spent: 0, percentage: 0 }

        const spent = get().getCategorySpending(
          budget.category,
          budget.period === 'monthly' ? 'month' : 'year'
        )

        const percentage = (spent / budget.amount) * 100

        return { spent, percentage }
      },
      
      clearError: () => set({ error: null })
    }))
