import * as React from "react";
import Link from "next/link";

interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ALX Polly</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/polls"
              className="transition-colors hover:text-foreground/80"
            >
              Polls
            </Link>
            <Link
              href="/create"
              className="transition-colors hover:text-foreground/80"
            >
              Create Poll
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {children}
          <nav className="flex items-center">
            <Link
              href="/auth/login"
              className="transition-colors hover:text-foreground/80 px-3"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="transition-colors hover:text-foreground/80 px-3"
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}