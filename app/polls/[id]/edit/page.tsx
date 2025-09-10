'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/auth/context/auth-context';
import ProtectedRoute from '@/app/auth/protected-route';

interface PollOption {
  id: string;
  text: string;
  poll_id: string;
}

function EditPollPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pollId = params.id as string;

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<{ id?: string; text: string }[]>([{ text: '' }, { text: '' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId || !user) return;

    const fetchPollData = async () => {
      setLoading(true);
      
      // Fetch poll details
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (pollError || !pollData) {
        setError('Poll not found or an error occurred.');
        console.error('Error fetching poll:', pollError);
        setLoading(false);
        return;
      }

      // Verify ownership
      if (pollData.user_id !== user.id) {
        setError('You are not authorized to edit this poll.');
        router.push('/polls');
        setLoading(false);
        return;
      }

      setQuestion(pollData.question);

      // Fetch poll options
      const { data: optionsData, error: optionsError } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', pollId);

      if (optionsError) {
        setError('Failed to fetch poll options.');
        console.error('Error fetching options:', optionsError);
      } else {
        setOptions(optionsData.map(o => ({ id: o.id, text: o.text })));
      }

      setLoading(false);
    };

    fetchPollData();
  }, [pollId, user, router]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      alert('A poll must have at least two options.');
      return;
    }
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.text.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 valid options.');
      return;
    }

    // Update poll question
    const { error: pollUpdateError } = await supabase
      .from('polls')
      .update({ question })
      .eq('id', pollId);

    if (pollUpdateError) {
      alert('Failed to update the poll. Please try again.');
      console.error('Error updating poll:', pollUpdateError);
      return;
    }

    // A simple way to handle option updates: delete all existing and insert the new set
    const { error: deleteError } = await supabase
      .from('poll_options')
      .delete()
      .eq('poll_id', pollId);

    if (deleteError) {
      alert('Failed to update poll options. Please try again.');
      console.error('Error deleting old options:', deleteError);
      return;
    }

    const newOptionsToInsert = validOptions.map(opt => ({
      text: opt.text,
      poll_id: pollId,
    }));

    const { error: insertError } = await supabase
      .from('poll_options')
      .insert(newOptionsToInsert);

    if (insertError) {
      alert('Failed to save new poll options. Please try again.');
      console.error('Error inserting new options:', insertError);
      return;
    }

    alert('Poll updated successfully!');
    router.push('/polls');
  };

  if (loading) return <div className="container py-10 text-center">Loading...</div>;
  if (error) return <div className="container py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Poll</CardTitle>
          <CardDescription>Update your poll question and options below.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium">
                Poll Question
              </label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Options</label>
              {options.map((option, index) => (
                <div key={option.id || index} className="flex items-center gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <Button type="button" variant="ghost" onClick={() => removeOption(index)}>
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addOption} className="w-full mt-2">
                Add Option
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Update Poll
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function EditPollPage() {
  return (
    <ProtectedRoute>
      <EditPollPageContent />
    </ProtectedRoute>
  );
}
