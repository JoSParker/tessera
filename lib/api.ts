import dbConnect from "./mongodb";
import User from "../models/User";
import Task from "../models/Task";
import Entry from "../models/Entry";
import Goal from "../models/Goal";
import Friendship from "../models/Friendship";
import Achievement from "../models/Achievement";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// ============================================
// AUTH FUNCTIONS (JWT + bcrypt)
// ============================================

export async function signInWithEmail(email: string, password: string) {
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return { data: null, error: "Invalid credentials" };
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { data: null, error: "Invalid credentials" };
  }
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  return { data: { user, token }, error: null };
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  await dbConnect();
  const existing = await User.findOne({ email });
  if (existing) {
    return { data: null, error: "Email already in use" };
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash, full_name: fullName });
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  return { data: { user, token }, error: null };
}

// For JWT, sign out is handled client-side by removing the token
export async function signOut() {
  return { error: null };
}

export async function getCurrentUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await dbConnect();
    const user = await User.findById(decoded.id);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: "Invalid token" };
  }
}

// For JWT, session is the token itself
export async function getCurrentSession(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { session: decoded, error: null };
  } catch (error) {
    return { session: null, error: "Invalid token" };
  }
}

// ============================================
// PROFILE FUNCTIONS
// ============================================

export async function getProfile(userId: string) {
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) return { data: null, error: "User not found" };
  return { data: user, error: null };
}

export async function updateProfile(userId: string, updates: any) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) return { data: null, error: "User not found" };
  return { data: user, error: null };
}

// ============================================
// TASKS FUNCTIONS
// ============================================

export async function getTasks(userId: string) {
  await dbConnect();
  const tasks = await Task.find({ user_id: userId }).sort({ created_at: 1 });
  return { data: tasks, error: null };
}

export async function createTask(userId: string, task: { name: string; color: string; shortcut?: string }) {
  await dbConnect();
  const newTask = await Task.create({ user_id: userId, ...task });
  return { data: newTask, error: null };
}

export async function updateTask(taskId: string, updates: { name?: string; color?: string; shortcut?: string }) {
  await dbConnect();
  const updated = await Task.findByIdAndUpdate(taskId, updates, { new: true });
  return { data: updated, error: null };
}

export async function deleteTask(taskId: string) {
  await dbConnect();
  await Task.findByIdAndDelete(taskId);
  return { error: null };
}

// ============================================
// ENTRIES FUNCTIONS
// ============================================

export async function getEntries(userId: string, year: number = new Date().getFullYear()) {
  await dbConnect();
  const entries = await Entry.find({ user_id: userId, year });
  return { data: entries, error: null };
}

export async function createEntry(userId: string, entry: { task_id: string; day_index: number; hour: number; year?: number }) {
  await dbConnect();
  const newEntry = await Entry.create({ user_id: userId, ...entry, year: entry.year || new Date().getFullYear() });
  return { data: newEntry, error: null };
}

export async function createEntries(userId: string, entries: { task_id: string; day_index: number; hour: number; year?: number }[]) {
  await dbConnect();
  const year = new Date().getFullYear();
  const entriesWithUser = entries.map((e) => ({ user_id: userId, ...e, year: e.year || year }));
  const created = await Entry.insertMany(entriesWithUser);
  return { data: created, error: null };
}

export async function deleteEntry(entryId: string) {
  await dbConnect();
  await Entry.findByIdAndDelete(entryId);
  return { error: null };
}

export async function deleteEntriesByCell(userId: string, cells: { day_index: number; hour: number }[], year: number = new Date().getFullYear()) {
  await dbConnect();
  for (const cell of cells) {
    await Entry.deleteMany({ user_id: userId, day_index: cell.day_index, hour: cell.hour, year });
  }
  return { error: null };
}

// ============================================
// GOALS FUNCTIONS
// ============================================

export async function getGoals(userId: string) {
  await dbConnect();
  const goals = await Goal.find({ user_id: userId }).sort({ created_at: 1 });
  return { data: goals, error: null };
}

export async function createGoal(userId: string, goal: { title: string; category?: string }) {
  await dbConnect();
  const newGoal = await Goal.create({ user_id: userId, ...goal });
  return { data: newGoal, error: null };
}

export async function updateGoal(goalId: string, updates: { title?: string; category?: string; progress?: number; completed?: boolean }) {
  await dbConnect();
  const updated = await Goal.findByIdAndUpdate(goalId, updates, { new: true });
  return { data: updated, error: null };
}

export async function deleteGoal(goalId: string) {
  await dbConnect();
  await Goal.findByIdAndDelete(goalId);
  return { error: null };
}

// ============================================
// FRIENDS FUNCTIONS
// ============================================

export async function getFriends(userId: string) {
  await dbConnect();
  const friendships = await Friendship.find({
    status: "accepted",
    $or: [{ requester_id: userId }, { addressee_id: userId }],
  });
  return { data: friendships, error: null };
}

export async function getPendingFriendRequests(userId: string) {
  await dbConnect();
  const requests = await Friendship.find({ addressee_id: userId, status: "pending" });
  return { data: requests, error: null };
}

export async function getSentFriendRequests(userId: string) {
  await dbConnect();
  const requests = await Friendship.find({ requester_id: userId, status: "pending" });
  return { data: requests, error: null };
}

export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  await dbConnect();
  const request = await Friendship.create({ requester_id: requesterId, addressee_id: addresseeId, status: "pending" });
  return { data: request, error: null };
}

export async function respondToFriendRequest(friendshipId: string, status: "accepted" | "declined") {
  await dbConnect();
  const updated = await Friendship.findByIdAndUpdate(friendshipId, { status }, { new: true });
  return { data: updated, error: null };
}

export async function removeFriend(friendshipId: string) {
  await dbConnect();
  await Friendship.findByIdAndDelete(friendshipId);
  return { error: null };
}

export async function searchUsers(email: string) {
  await dbConnect();
  const users = await User.find({ email: { $regex: email, $options: "i" } });
  return { data: users, error: null };
}

// ============================================
// ACHIEVEMENTS FUNCTIONS
// ============================================

export async function getAchievements(userId: string) {
  await dbConnect();
  const achievements = await Achievement.find({ user_id: userId });
  return { data: achievements, error: null };
}

export async function unlockAchievement(userId: string, achievementKey: string) {
  await dbConnect();
  const achievement = await Achievement.create({ user_id: userId, achievement_key: achievementKey });
  return { data: achievement, error: null };
}

// Implement getWeeklyHours and getFriendWeeklyHours using Entry aggregation if needed
