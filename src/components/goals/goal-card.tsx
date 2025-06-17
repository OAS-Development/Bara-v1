'use client';

import React from 'react';
import { Goal } from '@/stores/goals-store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Calendar, MoreVertical, Check, Pause, Play, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onStatusChange?: (goalId: string, status: Goal['status']) => void;
  onViewDetails?: (goal: Goal) => void;
}

const categoryColors = {
  health: 'bg-green-100 text-green-800',
  finance: 'bg-blue-100 text-blue-800',
  career: 'bg-purple-100 text-purple-800',
  personal: 'bg-yellow-100 text-yellow-800',
  relationships: 'bg-pink-100 text-pink-800',
  learning: 'bg-orange-100 text-orange-800',
};

const statusIcons = {
  active: <Play className="w-3 h-3" />,
  paused: <Pause className="w-3 h-3" />,
  completed: <Check className="w-3 h-3" />,
  abandoned: <X className="w-3 h-3" />,
};

export function GoalCard({ goal, onEdit, onDelete, onStatusChange, onViewDetails }: GoalCardProps) {
  const isOverdue = goal.target_date && new Date(goal.target_date) < new Date() && goal.status === 'active';
  
  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow cursor-pointer",
      goal.status === 'completed' && "opacity-75",
      goal.status === 'abandoned' && "opacity-50"
    )}
    onClick={() => onViewDetails?.(goal)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-tight">{goal.title}</h3>
            {goal.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit?.(goal);
              }}>
                Edit Goal
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {goal.status === 'active' && (
                <>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(goal.id, 'paused');
                  }}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Goal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(goal.id, 'completed');
                  }}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark Complete
                  </DropdownMenuItem>
                </>
              )}
              
              {goal.status === 'paused' && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(goal.id, 'active');
                }}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Goal
                </DropdownMenuItem>
              )}
              
              {(goal.status === 'active' || goal.status === 'paused') && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(goal.id, 'abandoned');
                }} className="text-red-600">
                  <X className="w-4 h-4 mr-2" />
                  Abandon Goal
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete?.(goal.id);
              }} className="text-red-600">
                Delete Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          {goal.category && (
            <Badge variant="secondary" className={cn("text-xs", categoryColors[goal.category])}>
              {goal.category}
            </Badge>
          )}
          
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {statusIcons[goal.status]}
            {goal.status}
          </Badge>
          
          {goal.target_date && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-500" : "text-muted-foreground"
            )}>
              <Calendar className="w-3 h-3" />
              {format(new Date(goal.target_date), 'MMM d, yyyy')}
              {isOverdue && <span className="font-medium">(Overdue)</span>}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}