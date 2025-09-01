import * as React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} ALX Polly. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}