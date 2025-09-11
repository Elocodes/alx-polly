'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import ProtectedRoute from '../auth/protected-route';
import { supabase } from '@/lib/supabase';

function CreatePollPageContent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const router = useRouter();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty options
    const validOptions = options.filter(option => option.trim() !== '');
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 valid options');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to create a poll.');
      router.push('/auth/login');
      return;
    }

    // Insert the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({ question: title, user_id: user.id })
      .select()
      .single();

    if (pollError || !poll) {
      console.error('Error creating poll:', pollError);
      alert('There was an error creating your poll. Please try again.');
      return;
    }

    // Insert the poll options
    const pollOptions = validOptions.map(option => ({
      text: option,
      poll_id: poll.id,
    }));

    const { error: optionsError } = await supabase.from('poll_options').insert(pollOptions);

    if (optionsError) {
      console.error('Error creating poll options:', optionsError);
      alert('There was an error creating the poll options. Please try again.');
      // Optionally, delete the poll that was just created
      await supabase.from('polls').delete().match({ id: poll.id });
      return;
    }
    
    // Reset form after submission
    setTitle('');
    setDescription('');
    setOptions(['', '']);
    
    alert('Poll created successfully!');
    router.push('/polls');
  };

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
          <CardDescription>Fill out the form below to create your poll</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Poll
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function CreatePollPage() {
    return (
        <ProtectedRoute>
            <CreatePollPageContent />
        </ProtectedRoute>
    )
}