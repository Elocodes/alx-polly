'use client';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollResultsProps {
  options: PollOption[];
  totalVotes: number;
}

export function PollResults({ options, totalVotes }: PollResultsProps) {
  // Calculate percentages for the results view
  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return '0.0';
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
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
  );
}