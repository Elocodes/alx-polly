'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

/**
 * @interface PollFormProps
 * @description Defines the props for the PollForm component.
 * It includes a callback for form submission and optional initial data for editing polls.
 */
interface PollFormProps {
  onSubmit: (data: { title: string; description: string; options: string[] }) => void;
  initialData?: {
    title: string;
    description: string;
    options: string[];
  };
}

/**
 * @component PollForm
 * @description A reusable form for creating and editing polls.
 * It manages the state for the poll's title, description, and options, and handles user interactions
 * for adding, removing, and updating options.
 * Why: This component abstracts the form logic, making it easy to use in different parts of the application.
 *
 * @param {PollFormProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered poll form.
 */
export function PollForm({ onSubmit, initialData }: PollFormProps) {
  // State management for form fields.
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [options, setOptions] = useState(initialData?.options || ['', '']);
  
  /**
   * @function addOption
   * @description Adds a new, empty option field to the form.
   */
  const addOption = () => {
    setOptions([...options, '']);
  };

  /**
   * @function removeOption
   * @description Removes an option field from the form.
   * Edge case: Prevents removing options if there are only two left, ensuring the minimum requirement is met.
   * @param {number} index - The index of the option to remove.
   */
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required.
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  /**
   * @function updateOption
   * @description Updates the value of a specific option field.
   * @param {number} index - The index of the option to update.
   * @param {string} value - The new value of the option.
   */
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  /**
   * @function handleSubmit
   * @description Handles the form submission.
   * It filters out empty options and validates that at least two valid options are provided before calling the onSubmit prop.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out any options that are just empty strings.
    const validOptions = options.filter(option => option.trim() !== '');
    
    // Complex logic: Ensure that the poll is submitted only if it meets the minimum requirements.
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
            {/* Conditionally render the remove button only when there are more than 2 options. */}
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
        {/* Dynamically change the button text based on whether we are creating or editing a poll. */}
        {initialData ? 'Update Poll' : 'Create Poll'}
      </Button>
    </form>
  );
}
