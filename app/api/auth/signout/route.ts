import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Clear cookie by setting expired token
  const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`;
  res.headers.set("Set-Cookie", cookie);
  return res;
}

export async function GET() {
  return POST();
}
