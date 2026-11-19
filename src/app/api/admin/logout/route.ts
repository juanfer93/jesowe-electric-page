import { NextResponse } from "next/server";
import { clearAdminSessionCookie, hasValidRequestOrigin } from "@/src/app/lib/adminAuth";

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearAdminSessionCookie());
  return response;
}
