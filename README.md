# ALX Polly

ALX Polly is a modern polling application built with Next.js, TypeScript, and Supabase. It allows users to create accounts, sign in, and participate in polls.

## Features

-   **User Authentication:** Secure user registration and login functionality powered by Supabase Auth.
-   **Protected Routes:** Certain pages like creating and viewing polls are only accessible to authenticated users.
-   **Create Polls:** An intuitive interface for users to create new polls with multiple options.
-   **View & Vote:** Users can view a list of all polls and vote on individual polls.
-   **View Results:** After voting, users can see the results of the poll.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Authentication:** [Supabase](https://supabase.io/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [Supabase](https://supabase.io/) account to get your project URL and anon key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd alx-polly
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1.  Navigate to the `/auth/register` page to create a new account.
2.  Log in with your new credentials on the `/auth/login` page.
3.  Once logged in, you will be redirected to the `/polls` page where you can see all available polls.
4.  Click the "Create New Poll" button to create your own poll.
5.  Click on any poll to view it and cast your vote.