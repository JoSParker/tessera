import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getTasks, createTask, updateTask, deleteTask as deleteTaskFn } from "../../../lib/api";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

async function getUserIdFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.id as string;
  } catch (err) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getTasks(userId);
  if (error) return NextResponse.json({ error }, { status: 500 });
  // include last_task_order if set on user
  try {
    const user = await User.findById(userId).lean();
    const last_task_order = user?.last_task_order || null;
    return NextResponse.json({ data, last_task_order });
  } catch (err) {
    return NextResponse.json({ data });
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = body.name;
  const color = body.color || "#7c3aed";
  const shortcut = body.shortcut || null;
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const { data, error } = await createTask(userId, { name, color, shortcut });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const taskId = body.taskId;
  const updates = body.updates || {};
  if (!taskId) return NextResponse.json({ error: "Missing taskId" }, { status: 400 });

  const { data, error } = await updateTask(taskId, updates);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const taskId = body.taskId;
  if (!taskId) return NextResponse.json({ error: "Missing taskId" }, { status: 400 });

  const { error } = await deleteTaskFn(taskId);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
