import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button } from '@/components/ui';
import Link from 'next/link';
import ProtectedRoute from '../auth/protected-route';

// Mock data for polls
const mockPolls = [
  {
    id: '1',
    title: 'Favorite Programming Language',
    description: 'What is your favorite programming language?',
    options: ['JavaScript', 'Python', 'Java', 'C#', 'Go'],
    votes: 42,
    createdBy: 'John Doe',
    createdAt: '2023-06-15',
  },
  {
    id: '2',
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you prefer?',
    options: ['React', 'Vue', 'Angular', 'Svelte'],
    votes: 38,
    createdBy: 'Jane Smith',
    createdAt: '2023-06-10',
  },
  {
    id: '3',
    title: 'Preferred Database',
    description: 'What database do you use most often?',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis'],
    votes: 27,
    createdBy: 'Alex Johnson',
    createdAt: '2023-06-05',
  },
];

function PollsPageContent() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Link key={poll.id} href={`/polls/${poll.id}`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {poll.options.length} options • {poll.votes} votes
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">By {poll.createdBy}</p>
                <p className="text-sm text-muted-foreground">{poll.createdAt}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
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
