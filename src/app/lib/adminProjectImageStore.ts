import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import {
  MAX_STORED_PROJECT_IMAGE_BYTES,
  collectProjectImageFilenames,
  detectProjectImageType,
  projectImageFilenameFromUrl
} from "@/src/app/lib/projectImageUtils.mjs";

function imageDirectory() {
  const configuredPath = process.env.ADMIN_CONTENT_PATH;
  const contentPath = !configuredPath
    ? join(process.cwd(), ".data", "site-content.json")
    : isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath);
  return join(dirname(contentPath), "project-images");
}

export async function storeAdminProjectImage(bytes: Buffer, declaredMime: string) {
  if (bytes.byteLength > MAX_STORED_PROJECT_IMAGE_BYTES) throw new Error("Image is larger than the upload limit.");
  const detected = detectProjectImageType(bytes);
  if (!detected || detected.mime !== declaredMime) throw new Error("The file is not a supported image.");

  const filename = `project-${randomUUID()}.${detected.extension}`;
  const directory = imageDirectory();
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, filename), bytes, { flag: "wx", mode: 0o644 });
  return { filename, url: `/admin-media/${filename}`, mime: detected.mime };
}

export async function readAdminProjectImage(filename: string) {
  const safeFilename = projectImageFilenameFromUrl(`/admin-media/${filename}`);
  if (!safeFilename) return null;
  try {
    const bytes = await readFile(join(imageDirectory(), safeFilename));
    const detected = detectProjectImageType(bytes);
    return detected ? { bytes, mime: detected.mime } : null;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}

export async function removeUnusedAdminProjectImages(content: unknown) {
  const directory = imageDirectory();
  const referenced = collectProjectImageFilenames(content);
  let filenames: string[];
  try {
    filenames = await readdir(directory);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
    throw error;
  }

  await Promise.all(filenames.map(async (filename) => {
    if (!projectImageFilenameFromUrl(`/admin-media/${filename}`) || referenced.has(filename)) return;
    await unlink(join(directory, filename));
  }));
}
