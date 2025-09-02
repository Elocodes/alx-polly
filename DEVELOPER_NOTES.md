# Developer Notes: ALX Polly Project

This document serves as a high-level technical overview and development log for the ALX Polly application. It's intended for developers (including my future self!) to quickly understand the project's architecture, key decisions, and development history.

## 1. Project Vision & Architecture

-   **Core Idea:** A simple, modern polling application where users can sign up, create polls, and vote on them.
-   **Frontend:** Built with Next.js using the App Router. This choice was made for its modern features, server-side rendering capabilities, and clear project structure.
-   **Backend & Database:** Supabase was chosen as the Backend-as-a-Service (BaaS). This decision significantly simplifies development by providing authentication, a Postgres database, and APIs out of the box, allowing me to focus on the frontend and user experience.
-   **Styling:** The project uses Tailwind CSS with shadcn/ui for a clean, utility-first approach to styling and a set of pre-built, accessible components.

## 2. Development Log & Key Milestones

### Phase 1: Authentication Setup (September 2025)

The initial development phase focused on establishing a secure and robust authentication system, as it's the foundation for all user-specific interactions.

-   **Technology:** `supabase-js` library was integrated into the Next.js application.
-   **Supabase Client:** A singleton Supabase client was created in `lib/supabase.ts` to be used throughout the application. It's configured using environment variables (`.env.local`) for security.
-   **Authentication Logic (`AuthContext`):**
    -   A React Context (`app/auth/context/auth-context.tsx`) was created to manage the global authentication state.
    -   This context handles user login, registration, and logout by making asynchronous calls to Supabase Auth.
    -   It listens for `onAuthStateChange` events from Supabase, automatically updating the application's state when a user logs in or out. This provides a seamless, real-time experience.
-   **UI Implementation:**
    -   The login (`/auth/login`) and register (`/auth/register`) pages were updated to use the `AuthContext`. The forms now capture user input and trigger the respective authentication functions.
    -   Upon successful login or registration, the user is programmatically redirected to the main polls page using Next.js's `useRouter`.
-   **Route Protection:**
    -   A Higher-Order Component (HOC), `app/auth/protected-route.tsx`, was created to restrict access to certain pages.
    -   This component checks the user's authentication state via the `AuthContext`. If the user is not logged in, it redirects them to the login page.
    -   This protection was applied to the main poll listing, poll creation, and individual poll view pages to ensure only authenticated users can access them.

## 3. Development Environment & Tooling

This project was developed in a collaborative environment, leveraging modern AI-powered tools to accelerate development and ensure best practices.

-   **Primary Tool:** The Gemini CLI was used extensively for a variety of software engineering tasks.
-   **Workflow:** The development process involved a conversational, interactive workflow where I would describe the desired feature or fix, and the Gemini CLI would help implement it by:
    -   Installing necessary libraries (`npm install`).
    -   Scaffolding files and directories.
    -   Reading existing code to understand the context.
    -   Writing and refactoring code (e.g., updating React components, creating the Supabase client).
    -   Applying protected routes to the pages.
    -   Generating documentation like the `README.md` and this developer log.
-   **Editor Integration:** All of this was done within Visual Studio Code, providing a seamless and efficient development experience.

This collaborative approach has been instrumental in the rapid setup and development of the project's foundational features.
