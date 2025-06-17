'use client';

import React, { useState } from 'react';
import { useHealthStore, MetricType } from '@/stores/health-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Activity, Heart, Scale, Moon, Footprints, Flame, Droplet, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

const metricConfigs: Record<MetricType, { label: string; unit: string; icon: React.ReactNode; placeholder: string }> = {
  weight: { label: 'Weight', unit: 'lbs', icon: <Scale className="w-4 h-4" />, placeholder: '150' },
  sleep_hours: { label: 'Sleep Hours', unit: 'hours', icon: <Moon className="w-4 h-4" />, placeholder: '8' },
  steps: { label: 'Steps', unit: 'steps', icon: <Footprints className="w-4 h-4" />, placeholder: '10000' },
  heart_rate: { label: 'Heart Rate', unit: 'bpm', icon: <Heart className="w-4 h-4" />, placeholder: '65' },
  blood_pressure_systolic: { label: 'Blood Pressure (Systolic)', unit: 'mmHg', icon: <Activity className="w-4 h-4" />, placeholder: '120' },
  blood_pressure_diastolic: { label: 'Blood Pressure (Diastolic)', unit: 'mmHg', icon: <Activity className="w-4 h-4" />, placeholder: '80' },
  calories: { label: 'Calories', unit: 'kcal', icon: <Flame className="w-4 h-4" />, placeholder: '2000' },
  water_intake: { label: 'Water Intake', unit: 'oz', icon: <Droplet className="w-4 h-4" />, placeholder: '64' },
  exercise_minutes: { label: 'Exercise Minutes', unit: 'minutes', icon: <Dumbbell className="w-4 h-4" />, placeholder: '30' },
};

export function MetricInput() {
  const { addMetric, loading } = useHealthStore();
  const [selectedType, setSelectedType] = useState<MetricType>('weight');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || isNaN(Number(value))) {
      toast.error('Please enter a valid number');
      return;
    }

    try {
      await addMetric({
        metric_type: selectedType,
        value: Number(value),
        unit: metricConfigs[selectedType].unit,
        recorded_at: new Date(recordedAt).toISOString(),
        notes: notes || undefined,
      });
      
      toast.success(`${metricConfigs[selectedType].label} recorded successfully`);
      setValue('');
      setNotes('');
    } catch (error) {
      toast.error('Failed to record metric');
    }
  };

  const config = metricConfigs[selectedType];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Record Health Metric
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Metric Type</label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as MetricType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricConfigs).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {config.icon}
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Value</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={config.placeholder}
                  className="flex-1"
                />
                <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                  {config.unit}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Date & Time</label>
            <Input
              type="datetime-local"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this measurement..."
              rows={2}
            />
          </div>

          <Button type="submit" disabled={loading || !value} className="w-full">
            {config.icon}
            Record {config.label}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}