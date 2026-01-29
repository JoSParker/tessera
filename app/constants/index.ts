import { Task, Goal, Friend, YearDay, GoalItem, Achievement } from "../types";

// Default tasks
export const DEFAULT_TASKS: Task[] = [
  { id: "deep-work", name: "Deep Work", color: "#13b6ec", shortcut: "1" },
  { id: "meetings", name: "Meetings", color: "#a855f7", shortcut: "2" },
  { id: "learning", name: "Learning", color: "#10b981", shortcut: "3" },
  { id: "rest", name: "Rest", color: "#f59e0b", shortcut: "4" },
  { id: "creative", name: "Creative", color: "#ec4899", shortcut: "5" },
];

// Default goals for Goals page
export const DEFAULT_GOALS: GoalItem[] = [
  { id: "g1", title: "Complete 1000 hours of deep work", category: "Productivity", progress: 45, completed: false },
  { id: "g2", title: "Learn a new programming language", category: "Learning", progress: 72, completed: false },
  { id: "g3", title: "Build 5 side projects", category: "Creative", progress: 60, completed: false },
  { id: "g4", title: "Read 24 books", category: "Personal", progress: 100, completed: true },
];

// Default friends
export const DEFAULT_FRIENDS: Friend[] = [
  { id: "f1", name: "Alex Chen", avatar: "https://i.pravatar.cc/150?img=1", hoursThisWeek: 42, status: "online" },
  { id: "f2", name: "Sarah Miller", avatar: "https://i.pravatar.cc/150?img=5", hoursThisWeek: 38, status: "away" },
  { id: "f3", name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=3", hoursThisWeek: 35, status: "offline" },
  { id: "f4", name: "Emily Davis", avatar: "https://i.pravatar.cc/150?img=9", hoursThisWeek: 28, status: "online" },
];

// Task colors for new tasks
export const TASK_COLORS = ["#f43f5e", "#06b6d4", "#8b5cf6", "#84cc16", "#f97316", "#6366f1"];

// User avatar URL
// App branding
export const APP_NAME = "tessera";
export const LOGO_URL = "/logo.png";

// User avatar (use local image in `public/`)
export const USER_AVATAR_URL = "/user.png";

// Helper to generate all days of the year
export const generateYearDays = (year: number): YearDay[] => {
  const days: YearDay[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate().toString().padStart(2, '0');
    days.push({
      date: new Date(d),
      label: `${month} ${day}`
    });
  }
  return days;
};

// Achievements config
export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", icon: "🔥", name: "7 Day Streak", description: "Log time 7 days in a row", unlocked: true },
  { id: "a2", icon: "🚀", name: "100 Hours", description: "Log 100 total hours", unlocked: true },
  { id: "a3", icon: "💎", name: "500 Hours", description: "Log 500 total hours", unlocked: false },
  { id: "a4", icon: "🏆", name: "1000 Hours", description: "Log 1000 total hours", unlocked: false },
];
