import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

export interface FinancialAccount {
  id: string;
  user_id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance?: number;
  currency: string;
  institution?: string;
  account_number_last4?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  account_id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category?: string;
  description?: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface FinanceStore {
  accounts: FinancialAccount[];
  transactions: FinancialTransaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  
  // Account actions
  fetchAccounts: () => Promise<void>;
  addAccount: (account: Omit<FinancialAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<FinancialAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Transaction actions
  fetchTransactions: (accountId?: string, days?: number) => Promise<void>;
  addTransaction: (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<FinancialTransaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Budget actions
  fetchBudgets: () => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  // Computed
  getTotalBalance: () => number;
  getAccountBalance: (accountId: string) => number;
  getCategorySpending: (category: string, period: 'month' | 'year') => number;
  getBudgetUsage: (budgetId: string) => { spent: number; percentage: number };
}

export const useFinanceStore = create<FinanceStore>()(
  devtools(
    (set, get) => ({
      accounts: [],
      transactions: [],
      budgets: [],
      loading: false,
      error: null,

      // Account actions
      fetchAccounts: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('financial_accounts')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          set({ accounts: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addAccount: async (account) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('financial_accounts')
            .insert({
              ...account,
              user_id: user.id,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            accounts: [data, ...state.accounts],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateAccount: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('financial_accounts')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            accounts: state.accounts.map(a => a.id === id ? data : a),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteAccount: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('financial_accounts')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            accounts: state.accounts.filter(a => a.id !== id),
            transactions: state.transactions.filter(t => t.account_id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      // Transaction actions
      fetchTransactions: async (accountId?: string, days: number = 30) => {
        set({ loading: true, error: null });
        try {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);
          
          let query = supabase
            .from('financial_transactions')
            .select('*')
            .gte('transaction_date', startDate.toISOString().split('T')[0])
            .order('transaction_date', { ascending: false });
          
          if (accountId) {
            query = query.eq('account_id', accountId);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          set({ transactions: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addTransaction: async (transaction) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('financial_transactions')
            .insert(transaction)
            .select()
            .single();
          
          if (error) throw error;
          
          // Update account balance if needed
          const account = get().accounts.find(a => a.id === transaction.account_id);
          if (account && account.balance !== undefined) {
            const balanceChange = transaction.type === 'income' 
              ? transaction.amount 
              : -transaction.amount;
            
            await get().updateAccount(account.id, {
              balance: account.balance + balanceChange
            });
          }
          
          set(state => ({
            transactions: [data, ...state.transactions],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateTransaction: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('financial_transactions')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            transactions: state.transactions.map(t => t.id === id ? data : t),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteTransaction: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('financial_transactions')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            transactions: state.transactions.filter(t => t.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      // Budget actions
      fetchBudgets: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('active', true)
            .order('category');
          
          if (error) throw error;
          set({ budgets: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addBudget: async (budget) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('budgets')
            .insert({
              ...budget,
              user_id: user.id,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            budgets: [...state.budgets, data],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateBudget: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('budgets')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            budgets: state.budgets.map(b => b.id === id ? data : b),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteBudget: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            budgets: state.budgets.filter(b => b.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      // Computed
      getTotalBalance: () => {
        const accounts = get().accounts;
        return accounts.reduce((total, account) => 
          total + (account.balance || 0), 0
        );
      },

      getAccountBalance: (accountId: string) => {
        const account = get().accounts.find(a => a.id === accountId);
        return account?.balance || 0;
      },

      getCategorySpending: (category: string, period: 'month' | 'year') => {
        const transactions = get().transactions;
        const now = new Date();
        const startDate = new Date(now);
        
        if (period === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        } else {
          startDate.setFullYear(now.getFullYear() - 1);
        }
        
        return transactions
          .filter(t => 
            t.type === 'expense' &&
            t.category === category &&
            new Date(t.transaction_date) >= startDate
          )
          .reduce((total, t) => total + t.amount, 0);
      },

      getBudgetUsage: (budgetId: string) => {
        const budget = get().budgets.find(b => b.id === budgetId);
        if (!budget) return { spent: 0, percentage: 0 };
        
        const spent = get().getCategorySpending(
          budget.category, 
          budget.period === 'monthly' ? 'month' : 'year'
        );
        
        const percentage = (spent / budget.amount) * 100;
        
        return { spent, percentage };
      },
    }),
    { name: 'finance-store' }
  )
);