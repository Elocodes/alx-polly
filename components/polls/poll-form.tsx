'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

interface PollFormProps {
  onSubmit: (data: { title: string; description: string; options: string[] }) => void;
  initialData?: {
    title: string;
    description: string;
    options: string[];
  };
}

export function PollForm({ onSubmit, initialData }: PollFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [options, setOptions] = useState(initialData?.options || ['', '']);
  
  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty options
    const validOptions = options.filter(option => option.trim() !== '');
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 valid options');
      return;
    }

    onSubmit({ title, description, options: validOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Poll Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your question here"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description (Optional)
        </label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more context to your question"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Poll Options</label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeOption(index)}
                className="px-3"
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addOption}
          className="w-full mt-2"
        >
          Add Option
        </Button>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Poll' : 'Create Poll'}
      </Button>
    </form>
  );
}