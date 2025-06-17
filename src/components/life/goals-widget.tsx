'use client';

import React from 'react';
import { useGoalsStore } from '@/stores/goals-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Flag, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export function GoalsWidget() {
  const router = useRouter();
  const { goals, milestones } = useGoalsStore();
  
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length 
    : 0;
  
  const upcomingMilestones = milestones
    .filter(m => !m.completed && m.target_date)
    .sort((a, b) => new Date(a.target_date!).getTime() - new Date(b.target_date!).getTime())
    .slice(0, 3);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Goals & Progress
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/life/goals')}
          >
            View All →
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{activeGoals.length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">{completedGoals.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
            <p className="text-xs text-muted-foreground">Avg Progress</p>
          </div>
        </div>

        {activeGoals.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Active Goals</p>
            {activeGoals.slice(0, 2).map(goal => (
              <div key={goal.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{goal.title}</span>
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </div>
        )}

        {upcomingMilestones.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-1">
              <Flag className="w-4 h-4" />
              Upcoming Milestones
            </p>
            {upcomingMilestones.map(milestone => {
              const goal = goals.find(g => g.id === milestone.goal_id);
              return (
                <div key={milestone.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{milestone.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {format(new Date(milestone.target_date!), 'MMM d')}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => router.push('/life/goals?action=new')}
          >
            <Target className="w-4 h-4 mr-1" />
            New Goal
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => router.push('/life/goals')}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            View Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}