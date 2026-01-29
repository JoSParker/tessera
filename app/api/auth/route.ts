import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function makeCookie(token: string) {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const secure = process.env.NODE_ENV === "production";
  return `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; ${secure ? "Secure;" : ""}`;
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password, name, mode } = body as any;
    if (mode === "signup") {
      const existing = await User.findOne({ email });
      if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash, full_name: name });
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      const res = NextResponse.json({ user, token });
      res.headers.set("Set-Cookie", makeCookie(token));
      return res;
    } else {
      const user = await User.findOne({ email });
      if (!user || !user.password) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      const res = NextResponse.json({ user, token });
      res.headers.set("Set-Cookie", makeCookie(token));
      return res;
    }
  } catch (err: any) {
    console.error("Auth API error:", err);
    return NextResponse.json({ error: "Internal server error", details: err?.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Check cookie first
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.split("; ").find((c) => c.startsWith("token="));
    const token = match ? match.split("=")[1] : request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      await dbConnect();
      const user = await User.findById(decoded.id);
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return NextResponse.json({ user, token });
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (err: any) {
    console.error('Auth GET error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
