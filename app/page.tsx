import { Button } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Create and Share Polls with ALX Polly</h1>
      <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
        A modern polling application that makes it easy to create polls, gather opinions, and analyze results.
      </p>
      
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link href="/polls">
          <Button size="lg">Browse Polls</Button>
        </Link>
        <Link href="/create">
          <Button size="lg" variant="outline">Create a Poll</Button>
        </Link>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Easy to Create</h3>
          <p className="mt-2 text-muted-foreground">
            Create polls in seconds with our intuitive interface. Add as many options as you need.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Share with Anyone</h3>
          <p className="mt-2 text-muted-foreground">
            Share your polls with friends, colleagues, or the public. Collect responses from anyone.
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Real-time Results</h3>
          <p className="mt-2 text-muted-foreground">
            Watch results update in real-time as votes come in. Visualize data with beautiful charts.
          </p>
        </div>
      </div>
    </div>
  );
}
