'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button } from '@/components/ui';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../auth/context/auth-context';
import ProtectedRoute from '../auth/protected-route';

interface Poll {
  id: string;
  question: string;
  user_id: string;
  created_at: string;
}

function PollsPageContent() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching polls:', error);
      } else {
        setPolls(data as Poll[]);
      }
      setLoading(false);
    };

    fetchPolls();
  }, []);

  const handleDelete = async (pollId: string) => {
    if (confirm('Are you sure you want to delete this poll?')) {
      // First, delete the votes associated with the poll's options
      const { data: options, error: optionsError } = await supabase
        .from('poll_options')
        .select('id')
        .eq('poll_id', pollId);

      if (optionsError) {
        console.error('Error fetching poll options for deletion:', optionsError);
        return;
      }

      const optionIds = options.map(option => option.id);

      if (optionIds.length > 0) {
        const { error: votesError } = await supabase
          .from('votes')
          .delete()
          .in('option_id', optionIds);

        if (votesError) {
          console.error('Error deleting votes:', votesError);
          return;
        }
      }

      // Then, delete the poll options
      const { error: pollOptionsError } = await supabase
        .from('poll_options')
        .delete()
        .eq('poll_id', pollId);

      if (pollOptionsError) {
        console.error('Error deleting poll options:', pollOptionsError);
        return;
      }

      // Finally, delete the poll itself
      const { error: pollError } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

      if (pollError) {
        console.error('Error deleting poll:', pollError);
      } else {
        setPolls(polls.filter(p => p.id !== pollId));
        alert('Poll deleted successfully.');
      }
    }
  };

  if (loading) {
    return <div className="container py-10 text-center">Loading polls...</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>No polls have been created yet.</p>
          <Link href="/create" className="text-primary hover:underline">
            Create the first one!
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{poll.question}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(poll.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="outline">View Poll</Button>
                </Link>
                {user && user.id === poll.user_id && (
                  <div className="flex gap-2">
                    <Link href={`/polls/${poll.id}/edit`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(poll.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PollsPage() {
  return (
    <ProtectedRoute>
      <PollsPageContent />
    </ProtectedRoute>
  );
}
