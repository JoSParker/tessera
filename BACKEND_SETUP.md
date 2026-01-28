# ChronosMatrix Backend Setup

## Database Setup (Supabase)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your credentials from Supabase:
   - Go to **Project Settings** → **API**
   - Copy the **Project URL** and **anon/public** key

3. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Run Database Migrations

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `database_setup.sql`
5. Click **Run** to execute the SQL

### 4. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
5. Copy the **Client ID** and **Client Secret**
6. In Supabase dashboard, go to **Authentication** → **Providers** → **Google**
7. Enable Google and paste your credentials

### 5. Configure Email Templates (Optional)

1. In Supabase dashboard, go to **Authentication** → **Email Templates**
2. Customize the confirmation and reset password emails

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `tasks` | User's custom tasks with colors |
| `entries` | Time matrix entries (day_index + hour) |
| `goals` | User's goals and progress |
| `friendships` | Friend connections and requests |
| `achievements` | Unlocked achievements |

### Key Features

- **Row Level Security (RLS)**: Each user can only access their own data
- **Auto Profile Creation**: Profile is automatically created on signup
- **Default Tasks**: 5 default tasks are created for new users
- **Friend System**: Send/accept/decline friend requests
- **Weekly Hours Tracking**: Function to get user's weekly hours

## API Functions

All API functions are in `lib/api.ts`:

### Authentication
- `signInWithEmail(email, password)`
- `signUpWithEmail(email, password, fullName)`
- `signInWithGoogle()`
- `signOut()`
- `getCurrentUser()`
- `getCurrentSession()`

### Tasks
- `getTasks(userId)`
- `createTask(userId, task)`
- `updateTask(taskId, updates)`
- `deleteTask(taskId)`

### Entries
- `getEntries(userId, year)`
- `createEntry(userId, entry)`
- `createEntries(userId, entries)` - Bulk insert with upsert
- `deleteEntry(entryId)`
- `deleteEntriesByCell(userId, cells, year)`

### Goals
- `getGoals(userId)`
- `createGoal(userId, goal)`
- `updateGoal(goalId, updates)`
- `deleteGoal(goalId)`

### Friends
- `getFriends(userId)`
- `getPendingFriendRequests(userId)`
- `getSentFriendRequests(userId)`
- `sendFriendRequest(requesterId, addresseeId)`
- `respondToFriendRequest(friendshipId, status)`
- `removeFriend(friendshipId)`
- `searchUsers(email)`

### Stats
- `getWeeklyHours(userId)`
- `getFriendWeeklyHours(friendId)`

## File Structure

```
tessera/
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── database.types.ts    # TypeScript types
│   └── api.ts               # API functions
├── app/
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth provider
│   └── auth/
│       ├── page.tsx         # Login/Signup page
│       └── callback/
│           └── route.ts     # OAuth callback
├── database_setup.sql       # Database migrations
├── .env.example             # Environment template
└── BACKEND_SETUP.md         # This file
```

## Usage Example

```tsx
"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { getTasks, createEntry } from "@/lib/api";

export default function MyComponent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      // Fetch user's tasks
      getTasks(user.id).then(({ data, error }) => {
        if (data) setTasks(data);
      });
    }
  }, [user]);

  const handleSaveEntry = async () => {
    if (user) {
      await createEntry(user.id, {
        task_id: selectedTaskId,
        day_index: 0,
        hour: 10,
      });
    }
  };
}
```

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists with valid credentials
- Restart the dev server after adding environment variables

### "Invalid API key"
- Check that you're using the **anon/public** key, not the service role key
- Verify the URL matches your Supabase project

### Google OAuth not working
- Check redirect URI matches exactly
- Ensure Google provider is enabled in Supabase dashboard

### RLS blocking queries
- Make sure you're authenticated before making requests
- Check that RLS policies are correctly set up
