import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getFriends, getPendingFriendRequests, getSentFriendRequests, sendFriendRequest, respondToFriendRequest, searchUsers } from "../../../lib/api";
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

async function enrichFriendships(friendships: any[], currentUserId: string) {
  const out: any[] = [];
  for (const f of friendships) {
    const friendId = f.requester_id === currentUserId ? f.addressee_id : f.requester_id;
    const user = await User.findById(friendId).lean();
    out.push({ id: friendId, name: user?.full_name || user?.email, avatar: user?.avatar_url || null, friendshipId: f._id, hoursThisWeek: 0 });
  }
  return out;
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data: accepted } = await getFriends(userId);
    const { data: incoming } = await getPendingFriendRequests(userId);
    const { data: outgoing } = await getSentFriendRequests(userId);

    const friends = await enrichFriendships(accepted || [], userId);

    // For incoming/outgoing include requester/addressee user info
    const inRes: any[] = [];
    for (const r of incoming || []) {
      const u = await User.findById(r.requester_id).lean();
      inRes.push({ _id: r._id, user: u, requester_id: r.requester_id });
    }

    const outRes: any[] = [];
    for (const r of outgoing || []) {
      const u = await User.findById(r.addressee_id).lean();
      outRes.push({ _id: r._id, user: u, addressee_id: r.addressee_id });
    }

    return NextResponse.json({ friends, incoming: inRes, outgoing: outRes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const action = body.action;

  try {
    if (action === 'search') {
      const q = body.query || '';
      const { data } = await searchUsers(q);
      // normalize and filter out current user
      const users = (data || [])
        .filter((u: any) => String(u._id) !== String(userId))
        .map((u: any) => ({ _id: String(u._id), email: u.email, full_name: u.full_name, avatar: u.avatar_url }));
      return NextResponse.json({ data: users });
    }

    if (action === 'request') {
      const addresseeId = body.addresseeId;
      const { data } = await sendFriendRequest(userId, addresseeId);
      return NextResponse.json({ data });
    }

    if (action === 'respond') {
      const { friendshipId, status } = body;
      const { data } = await respondToFriendRequest(friendshipId, status);
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
