import { NextResponse } from "next/server";
import { hasAdminSession, hasValidRequestOrigin } from "@/src/app/lib/adminAuth";
import { getSiteContent, saveSiteContent } from "@/src/app/lib/siteContentStore";
import { siteContentSchema } from "@/src/app/lib/siteContentSchema";
import { removeUnusedAdminProjectImages } from "@/src/app/lib/adminProjectImageStore";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json(await getSiteContent(), {
    headers: { "Cache-Control": "private, no-store, max-age=0" }
  });
}

export async function PUT(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const input = await request.json().catch(() => null);
  const parsed = siteContentSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Content is invalid." }, { status: 400 });
  }

  try {
    await saveSiteContent(parsed.data);
    try {
      await removeUnusedAdminProjectImages(parsed.data);
    } catch (cleanupError) {
      console.error("Could not remove unused project images.", cleanupError);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Could not save site content.", error);
    return NextResponse.json({ error: "Could not save changes on this server." }, { status: 500 });
  }
}
