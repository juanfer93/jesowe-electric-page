import { readAdminProjectImage } from "@/src/app/lib/adminProjectImageStore";

export async function GET(_request: Request, context: { params: { filename: string } }) {
  try {
    const image = await readAdminProjectImage(context.params.filename);
    if (!image) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(image.bytes), {
      headers: {
        "Content-Type": image.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("Could not read project image.", error);
    return new Response("Could not read image", { status: 500 });
  }
}
