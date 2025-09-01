'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';

// Mock data for a single poll
const mockPoll = {
  id: '1',
  title: 'Favorite Programming Language',
  description: 'What is your favorite programming language?',
  options: [
    { id: '1', text: 'JavaScript', votes: 15 },
    { id: '2', text: 'Python', votes: 12 },
    { id: '3', text: 'Java', votes: 8 },
    { id: '4', text: 'C#', votes: 5 },
    { id: '5', text: 'Go', votes: 2 },
  ],
  totalVotes: 42,
  createdBy: 'John Doe',
  createdAt: '2023-06-15',
};

export default function PollPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (selectedOption) {
      // TODO: Implement actual voting logic
      console.log(`Voted for option ${selectedOption} in poll ${params.id}`);
      setHasVoted(true);
    }
  };

  // Calculate percentages for the results view
  const getPercentage = (votes: number) => {
    return ((votes / mockPoll.totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{mockPoll.title}</CardTitle>
          <CardDescription>{mockPoll.description}</CardDescription>
          <div className="text-sm text-muted-foreground mt-2">
            Created by {mockPoll.createdBy} on {mockPoll.createdAt}
          </div>
        </CardHeader>
        <CardContent>
          {hasVoted ? (
            <div className="space-y-4">
              <h3 className="font-medium">Results:</h3>
              {mockPoll.options.map((option) => (
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
                Total votes: {mockPoll.totalVotes}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Cast your vote:</h3>
              {mockPoll.options.map((option) => (
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
          {hasVoted && (
            <Button variant="outline" onClick={() => setHasVoted(false)}>
              Vote Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}