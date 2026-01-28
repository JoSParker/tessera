// Task types
export interface Task {
  id: string;
  name: string;
  color: string;
  shortcut: string;
}

// Cell data - maps "dayIndex-hour" to taskId
export interface CellData {
  [key: string]: string | null;
}

// Goal types
export interface Goal {
  id: string;
  taskId: string;
  targetHours: number;
  period: "daily" | "weekly" | "monthly";
}

// Friend types
export interface Friend {
  id: string;
  name: string;
  avatar: string;
  hoursThisWeek: number;
  status: "online" | "offline" | "away";
}

// Goal type for goals page
export interface GoalItem {
  id: string;
  title: string;
  category: string;
  progress: number;
  completed: boolean;
}

// Achievement type
export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

// Day type for year matrix
export interface YearDay {
  date: Date;
  label: string;
}

// Pie chart segment
export interface PieChartSegment {
  task: Task;
  hours: number;
  percentage: number;
  dashArray: number;
  dashOffset: number;
}

// Page types
export type PageType = "matrix" | "analytics" | "goals" | "friends";

// Undo stack item
export interface UndoItem {
  cellKey: string;
  taskId: string;
}
