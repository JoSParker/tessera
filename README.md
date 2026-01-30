# Tessera

Tessera is a dark-themed, hour-by-hour time-tracking matrix built with Next.js. It focuses on precise logging, visual analytics, and lightweight social features (friends and leaderboards) so you can track, analyze, and compare how you spend time.

**Screenshots**

- Matrix overview: `public/screenshots/matrix-overview.png`
- Friends dashboard: `public/screenshots/friends.png`
- Analytics & breakdown: `public/screenshots/analytics.png`

Place the provided screenshots in `public/screenshots/` with those filenames to render them in this README.

**Overview**

- Purpose: fast, granular time capture using a compact matrix UI (days × 24 hours).
- Interaction model: select a task from the sidebar and paint hours on the matrix; confirm or clear selections from the right panel.
- Visuals: pie chart, weekly activity, and task breakdown provide immediate insight into time allocation.

**Tech Stack**

- Framework: Next.js (App Router)
- UI: React + Tailwind CSS
- Optional services: Supabase / PostgreSQL (SQL schema included)

**Where to look**

- App shell and global layout: [app/layout.tsx](app/layout.tsx)
- Main app logic and page: [app/page.tsx](app/page.tsx)
- Core UI components: [app/components](app/components) (Header, TaskSidebar, MatrixGrid, RightPanel, Footer)
- API routes: [app/api](app/api) — entries, tasks, friends, auth
- Utilities and DB helpers: [lib](lib)
- Static assets and logos: [public](public)

**Quick Start (local)**

1. Install dependencies

```bash
npm install
```

2. Create `.env.local` at the project root and add the environment variables your setup requires. Common variables used by the app:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
```

3. (Optional) If using Postgres for persistence, import `database_setup.sql` into your database.

4. Start the dev server

```bash
npm run dev
```

5. Open http://localhost:3000

**API & Data flow**

- Client-side UI triggers local state updates immediately, then calls API routes under [app/api](app/api) to persist changes.
- Entries are posted to [app/api/entries/route.ts](app/api/entries/route.ts) (POST/DELETE) and tasks are managed via [app/api/tasks/route.ts](app/api/tasks/route.ts).

**Branding & Assets**

- Replace `public/logo.png` to change the app logo.
- `public/next.svg` was updated to reference the local logo so the Next.js mark no longer appears in the UI.

**Deployment**

- Deploy to Vercel for simplest setup. Make sure you add required env vars (Supabase keys, DATABASE_URL) in the Vercel project settings.

**Development notes & tips**

- Change default task colors in [app/constants](app/constants).
- The `AuthContext` in [app/contexts/AuthContext.tsx](app/contexts/AuthContext.tsx) handles sign-in/out flows used throughout the app.
- Keyboard shortcuts and selection behavior are implemented in [app/page.tsx](app/page.tsx) and `useKeyboardShortcuts` under [app/hooks](app/hooks).

**Contributing**

- Fork the repo, create a feature branch, run the app locally, and open a pull request. Include screenshots for visual changes.

**License**

MIT

---

If you want, I can add the three attached screenshots into `public/screenshots/` now and create a short `CONTRIBUTING.md` with development and PR guidelines. Which would you like next?
# Tessera

Tessera is a dark-themed time-tracking matrix application built with Next.js. It lets you assign tasks to hourly cells over days, visualize time distribution and analytics, and compete with friends.

<!-- Screenshots: save the attached images under `public/screenshots/` with the filenames used below -->

## Screenshots

Matrix view

![Matrix view](public/screenshots/matrix-overview.png)

Friends dashboard

![Friends view](public/screenshots/friends.png)

Analytics & breakdown

![Analytics view](public/screenshots/analytics.png)

## Features

- Hour-by-hour day matrix for precise activity logging
- Persistent tasks with colors and shortcuts
- Visual analytics: time distribution, weekly activity, task breakdown
- Friends, leaderboards, and per-friend dashboards
- Lightweight, dark UI optimized for long sessions

## Quick Start

Prerequisites:

- Node.js 18+ (or current LTS)
- Optional: PostgreSQL (for production) — `database_setup.sql` is included

Local development:

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` file and add any required environment variables. Typical variables may include:

```
# example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
```

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Database

If you plan to use the bundled SQL schema, import `database_setup.sql` into your Postgres instance and wire `DATABASE_URL`.

## Deployment

This is a standard Next.js app and can be deployed to Vercel, Render, or any platform that supports Next.js. Ensure environment variables and any external services (Supabase, DB) are configured.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request. Include screenshots and a brief description of changes.

## License

MIT

---

This project was bootstrapped from Create Next App and adapted into the Tessera interface.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
