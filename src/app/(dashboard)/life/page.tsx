'use client';

import React, { useEffect } from 'react';
import { useHealthStore } from '@/stores/health-store';
import { useHabitStore } from '@/stores/habit-store';
import { useFinanceStore } from '@/stores/finance-store';
import { useGoalsStore } from '@/stores/goals-store';
import { useJournalStore } from '@/stores/journal-store';
import { HealthWidget } from '@/components/life/health-widget';
import { FinanceWidget } from '@/components/life/finance-widget';
import { GoalsWidget } from '@/components/life/goals-widget';
import { JournalWidget } from '@/components/life/journal-widget';
import { PageHeader } from '@/components/ui/page-header';
import { Heart } from 'lucide-react';

export default function LifeDashboard() {
  // Initialize all stores
  const { fetchMetrics } = useHealthStore();
  const { fetchHabits, fetchCompletions } = useHabitStore();
  const { fetchAccounts, fetchTransactions, fetchBudgets } = useFinanceStore();
  const { fetchGoals, fetchMilestones } = useGoalsStore();
  const { fetchEntries } = useJournalStore();

  useEffect(() => {
    // Load all data
    fetchMetrics(undefined, 7);
    fetchHabits();
    fetchCompletions(7);
    fetchAccounts();
    fetchTransactions(undefined, 30);
    fetchBudgets();
    fetchGoals('active');
    fetchMilestones();
    fetchEntries();
  }, [fetchMetrics, fetchHabits, fetchCompletions, fetchAccounts, fetchTransactions, fetchBudgets, fetchGoals, fetchMilestones, fetchEntries]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Life Dashboard"
        description="Your personal wellness and life management overview"
        icon={<Heart className="w-8 h-8" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthWidget />
        <FinanceWidget />
        <GoalsWidget />
        <JournalWidget />
      </div>
    </div>
  );
}