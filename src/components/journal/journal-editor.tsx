'use client';

import React, { useState, useEffect } from 'react';
import { useJournalStore } from '@/stores/journal-store';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Lock, MapPin, Cloud, Tag, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface JournalEditorProps {
  entryId?: string;
  initialContent?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const moods = [
  { value: 'happy', label: '😊 Happy', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'neutral', label: '😐 Neutral', color: 'bg-gray-100 text-gray-800' },
  { value: 'sad', label: '😢 Sad', color: 'bg-blue-100 text-blue-800' },
  { value: 'anxious', label: '😰 Anxious', color: 'bg-purple-100 text-purple-800' },
  { value: 'excited', label: '🎉 Excited', color: 'bg-green-100 text-green-800' },
  { value: 'angry', label: '😠 Angry', color: 'bg-red-100 text-red-800' },
  { value: 'calm', label: '😌 Calm', color: 'bg-cyan-100 text-cyan-800' },
];

export function JournalEditor({ entryId, initialContent = '', onSave, onCancel }: JournalEditorProps) {
  const { addEntry, updateEntry, encryptionKey, loading } = useJournalStore();
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [weather, setWeather] = useState('');
  const [location, setLocation] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!encryptionKey) {
      toast.error('No encryption key set. Please set up encryption first.');
    }
  }, [encryptionKey]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something in your journal');
      return;
    }

    if (!encryptionKey) {
      toast.error('No encryption key set');
      return;
    }

    try {
      if (entryId) {
        await updateEntry(entryId, {
          content,
          mood: mood as any || undefined,
          tags,
          weather: weather || undefined,
          location: location || undefined,
        });
        toast.success('Journal entry updated');
      } else {
        await addEntry({
          content,
          mood: mood as any || undefined,
          tags,
          entry_date: entryDate,
          weather: weather || undefined,
          location: location || undefined,
        });
        toast.success('Journal entry saved');
        
        // Reset form
        setContent('');
        setMood('');
        setTags([]);
        setWeather('');
        setLocation('');
      }
      
      onSave?.();
    } catch (error) {
      toast.error('Failed to save journal entry');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {entryId ? 'Edit Journal Entry' : 'New Journal Entry'}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(entryDate), 'EEEE, MMMM d, yyyy')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!entryId && (
          <div>
            <label className="text-sm font-medium mb-1 block">Entry Date</label>
            <Input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-1 block">How are you feeling?</label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger>
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent>
              {moods.map(m => (
                <SelectItem key={m.value} value={m.value}>
                  <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${m.color}`}>
                    {m.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-1">
              <Cloud className="w-4 h-4" />
              Weather
            </label>
            <Input
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              placeholder="Sunny, rainy, cloudy..."
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Home, office, park..."
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Write your thoughts</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today?"
            rows={10}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground mt-1">
            Your entry will be encrypted before saving
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tags..."
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag} size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading || !encryptionKey || !content.trim()}>
            <Save className="w-4 h-4 mr-2" />
            {entryId ? 'Update Entry' : 'Save Entry'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}