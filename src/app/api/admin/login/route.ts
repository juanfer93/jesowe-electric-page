import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSessionToken, hasValidRequestOrigin, verifyAdminCredentials } from "@/src/app/lib/adminAuth";
import { RequestBodyTooLargeError, readJsonWithinLimit } from "@/src/app/lib/requestBody";
import { clearRateLimit, consumeRateLimit, getClientAddress } from "@/src/app/lib/rateLimit";

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

  let json: unknown;
  try {
    json = await readJsonWithinLimit(request, 4 * 1024);
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    return NextResponse.json({ error: "Invalid username or password." }, { status });
  }
  const credentials = typeof json === "object" && json !== null ? json as Record<string, unknown> : {};
  const username = typeof credentials.username === "string" ? credentials.username : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  if (username.length > 120 || password.length > 1024) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 400 });
  }

  const rateLimitKey = `admin-login:${getClientAddress(request)}`;
  const rateLimit = await consumeRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
    });
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Username or password is incorrect." }, { status: 401 });
  }

  await clearRateLimit(rateLimitKey);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie(createAdminSessionToken()));
  return response;
}
