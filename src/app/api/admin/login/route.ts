import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSessionToken, hasValidRequestOrigin, verifyAdminCredentials } from "@/src/app/lib/adminAuth";

const attempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const configReady = Boolean(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD_HASH &&
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_SESSION_SECRET.length >= 32
  );
  if (!configReady) {
    return NextResponse.json({ error: "Admin access is not configured on this server." }, { status: 503 });
  }

  const json = await request.json().catch(() => null);
  const username = typeof json?.username === "string" ? json.username : "";
  const password = typeof json?.password === "string" ? json.password : "";
  if (username.length > 120 || password.length > 1024) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const current = attempts.get(ip);
  const now = Date.now();
  if (current?.blockedUntil && current.blockedUntil > now) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  if (!verifyAdminCredentials(username, password)) {
    const nextCount = current?.blockedUntil && current.blockedUntil <= now ? 1 : (current?.count || 0) + 1;
    attempts.set(ip, {
      count: nextCount,
      blockedUntil: nextCount >= MAX_ATTEMPTS ? now + BLOCK_DURATION_MS : 0
    });
    return NextResponse.json({ error: "Username or password is incorrect." }, { status: 401 });
  }

  attempts.delete(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie(createAdminSessionToken()));
  return response;
}
