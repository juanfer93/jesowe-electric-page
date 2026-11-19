import { NextResponse } from "next/server";
import { hasAdminSession, hasValidRequestOrigin } from "@/src/app/lib/adminAuth";
import { MAX_SOURCE_PROJECT_IMAGE_BYTES, MAX_STORED_PROJECT_IMAGE_BYTES, isSupportedProjectImageMime } from "@/src/app/lib/projectImageUtils.mjs";
import { storeAdminProjectImage } from "@/src/app/lib/adminProjectImageStore";

async function readBodyWithinLimit(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return Buffer.alloc(0);

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_STORED_PROJECT_IMAGE_BYTES) {
      await reader.cancel();
      throw new Error("Image is larger than the optimized upload limit.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks, total);
}

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const declaredMime = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() || "";
  if (!isSupportedProjectImageMime(declaredMime)) {
    return NextResponse.json({ error: "Use a PNG, JPEG, WebP or AVIF image." }, { status: 415 });
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_SOURCE_PROJECT_IMAGE_BYTES) {
    return NextResponse.json({ error: "Choose an image smaller than 10 MB before upload." }, { status: 413 });
  }

  let bytes: Buffer;
  try {
    bytes = await readBodyWithinLimit(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read image.";
    return NextResponse.json({ error: message }, { status: 413 });
  }

  try {
    const image = await storeAdminProjectImage(bytes, declaredMime);
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save image.";
    const status = message.includes("larger") ? 413 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
