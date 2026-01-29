import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");
  const next = searchParams.get("next") ?? "/";

  if (!token || !JWT_SECRET) {
    return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`);
  }

  try {
    // verify token to ensure it's valid before setting cookie
    const payload = jwt.verify(token, JWT_SECRET);

    // set HttpOnly cookie with the token
    const res = NextResponse.redirect(`${origin}${next}`);
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    const secure = process.env.NODE_ENV === "production";
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; ${
      secure ? "Secure;" : ""
    }`;
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (err) {
    return NextResponse.redirect(`${origin}/auth?error=Invalid token`);
  }
}
