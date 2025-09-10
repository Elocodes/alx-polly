'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/auth/context/auth-context';
import ProtectedRoute from '@/app/auth/protected-route';

interface Poll {
  id: string;
  question: string;
  user_id: string;
  created_at: string;
}

interface PollOption {
  id: string;
  text: string;
  poll_id: string;
}

interface Vote {
  id: number;
  option_id: string;
  user_id: string;
  poll_id: string;
}

interface OptionWithVotes extends PollOption {
  votes: number;
}

function PollPageContent() {
  const { user } = useAuth();
  const params = useParams();
  const pollId = params.id as string;
  const router = useRouter();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<OptionWithVotes[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId || !user) return;

    const fetchPollData = async () => {
      setLoading(true);
      setError(null);

      // Fetch poll details
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (pollError || !pollData) {
        setError('Poll not found.');
        setLoading(false);
        return;
      }
      setPoll(pollData);

      // Fetch poll options and their vote counts
      const { data: optionsData, error: optionsError } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', pollId);

      if (optionsError) {
        setError('Failed to fetch poll options.');
        setLoading(false);
        return;
      }

      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('option_id')
        .eq('poll_id', pollId);

      if (votesError) {
        setError('Failed to fetch votes.');
        setLoading(false);
        return;
      }

      const userVote = votesData.find((vote: any) => vote.user_id === user.id);
      if (userVote) {
        setHasVoted(true);
      }

      const optionsWithVotes = optionsData.map(option => ({
        ...option,
        votes: votesData.filter(vote => vote.option_id === option.id).length,
      }));

      setOptions(optionsWithVotes);
      setLoading(false);
    };

    fetchPollData();
  }, [pollId, user]);

  const handleVote = async () => {
    if (!selectedOption || !user) return;

    const { error } = await supabase.from('votes').insert({
      option_id: selectedOption,
      user_id: user.id,
      poll_id: pollId,
    });

    if (error) {
      alert('Error submitting vote. You may have already voted.');
      console.error('Vote submission error:', error);
    } else {
      setHasVoted(true);
      // Update vote counts locally for immediate feedback
      setOptions(
        options.map(opt =>
          opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
        )
      );
    }
  };

  const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);
  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0';
  };

  if (loading) return <div className="container py-10 text-center">Loading poll...</div>;
  if (error) return <div className="container py-10 text-center text-red-500">{error}</div>;
  if (!poll) return <div className="container py-10 text-center">Poll not found.</div>;

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
          <div className="text-sm text-muted-foreground mt-2">
            Created on {new Date(poll.created_at).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          {hasVoted ? (
            <div className="space-y-4">
              <h3 className="font-medium">Results:</h3>
              {options.map((option) => (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span>
                      {option.votes} votes ({getPercentage(option.votes)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${getPercentage(option.votes)}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="text-sm text-muted-foreground mt-4">
                Total votes: {totalVotes}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Cast your vote:</h3>
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option.id}
                    name="poll-option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={option.id} className="text-sm">
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!hasVoted && (
            <Button onClick={handleVote} disabled={!selectedOption}>
              Submit Vote
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PollPage() {
    return (
        <ProtectedRoute>
            <PollPageContent />
        </ProtectedRoute>
    )
}
