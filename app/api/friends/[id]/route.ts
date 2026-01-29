import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getEntries } from "../../../../lib/api";
import Friendship from "../../../../models/Friendship";
import { DEFAULT_TASKS } from "../../../../app/constants";

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

export async function GET(request: NextRequest, _ctx: any) {
  const viewerId = await getUserIdFromRequest(request);
  // extract id from the request path as a fallback to params
  const pathname = request.nextUrl?.pathname || new URL(request.url).pathname;
  const parts = pathname.split('/').filter(Boolean);
  const targetId = parts[parts.length - 1];
  if (!viewerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // allow if same user
  if (String(viewerId) !== String(targetId)) {
    // check friendship bidirectionally with direct query
    console.log('[friends/:id] viewerId=', String(viewerId), 'targetId=', String(targetId));
    const existing = await Friendship.findOne({
      status: 'accepted',
      $or: [
        { requester_id: String(viewerId), addressee_id: String(targetId) },
        { requester_id: String(targetId), addressee_id: String(viewerId) }
      ]
    }).lean();
    console.log('[friends/:id] friendship found=', existing);
    if (!existing) {
      console.log('[friends/:id] access denied - no accepted friendship');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    const { data: entries } = await getEntries(targetId);
    const cellData: { [key: string]: string } = {};
    const timeDistribution: { [taskId: string]: number } = {};
    DEFAULT_TASKS.forEach(t => (timeDistribution[t.id] = 0));
    (entries || []).forEach((e: any) => {
      const key = `${e.day_index}-${e.hour}`;
      cellData[key] = e.task_id;
      if (timeDistribution[e.task_id] !== undefined) timeDistribution[e.task_id]++;
    });
    const totalHours = Object.values(timeDistribution).reduce((a, b) => a + b, 0);

    // pie segments
    const circumference = 2 * Math.PI * 40;
    let offset = 0;
    const pieChartSegments = DEFAULT_TASKS.map(task => {
      const hours = timeDistribution[task.id] || 0;
      const percentage = totalHours === 0 ? 0 : (hours / totalHours) * 100;
      const dashArray = (percentage / 100) * circumference;
      const seg = { task, hours, percentage, dashArray, dashOffset: -offset };
      offset += dashArray;
      return seg;
    }).filter((s: any) => s.hours > 0);

    // weeklyData placeholder - aggregate by week index (simple)
    const weeklyData: { week: string; hours: number }[] = [];
    for (let i = 0; i < 52; i++) weeklyData.push({ week: `W${i + 1}`, hours: 0 });
    // naive week assignment based on day_index
    (entries || []).forEach((e: any) => {
      const weekIndex = Math.floor(e.day_index / 7);
      if (weeklyData[weekIndex]) weeklyData[weekIndex].hours++;
    });

    return NextResponse.json({ tasks: DEFAULT_TASKS, cellData, timeDistribution, totalHours, pieChartSegments, weeklyData });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
