'use client';

import React, { useState } from 'react';
import { GoalMilestone, useGoalsStore } from '@/stores/goals-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Flag, Plus, GripVertical, Calendar, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MilestoneTrackerProps {
  goalId: string;
  milestones: GoalMilestone[];
  onReorder?: (milestoneIds: string[]) => void;
}

export function MilestoneTracker({ goalId, milestones, onReorder }: MilestoneTrackerProps) {
  const { addMilestone, toggleMilestone, deleteMilestone, loading } = useGoalsStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMilestoneTitle.trim()) {
      toast.error('Please enter a milestone title');
      return;
    }

    try {
      await addMilestone({
        goal_id: goalId,
        title: newMilestoneTitle.trim(),
        completed: false,
        order_index: milestones.length,
      });
      
      setNewMilestoneTitle('');
      setIsAdding(false);
      toast.success('Milestone added');
    } catch (error) {
      toast.error('Failed to add milestone');
    }
  };

  const handleDragStart = (e: React.DragEvent, milestoneId: string) => {
    setDraggedItem(milestoneId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;
    
    const newOrder = [...milestones];
    const draggedIndex = newOrder.findIndex(m => m.id === draggedItem);
    const targetIndex = newOrder.findIndex(m => m.id === targetId);
    
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    
    onReorder?.(newOrder.map(m => m.id));
    setDraggedItem(null);
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            <span>Milestones</span>
            <span className="text-sm text-muted-foreground">
              ({completedCount}/{milestones.length})
            </span>
          </div>
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              draggable
              onDragStart={(e) => handleDragStart(e, milestone.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, milestone.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-move",
                draggedItem === milestone.id && "opacity-50",
                milestone.completed && "opacity-75"
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              
              <Checkbox
                checked={milestone.completed}
                onCheckedChange={() => toggleMilestone(milestone.id)}
                disabled={loading}
              />
              
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  milestone.completed && "line-through text-muted-foreground"
                )}>
                  {milestone.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {milestone.target_date && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(milestone.target_date), 'MMM d')}
                    </span>
                  )}
                  {milestone.completed && milestone.completed_at && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Completed {format(new Date(milestone.completed_at), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMilestone(milestone.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </Button>
            </div>
          ))}
          
          {isAdding && (
            <form onSubmit={handleAddMilestone} className="flex gap-2">
              <Input
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="New milestone..."
                autoFocus
              />
              <Button type="submit" size="sm">Add</Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewMilestoneTitle('');
                }}
              >
                Cancel
              </Button>
            </form>
          )}
        </div>
        
        {milestones.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">
              Overall Progress: {Math.round(progress)}%
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}