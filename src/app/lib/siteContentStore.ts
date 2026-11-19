import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { DEFAULT_SITE_CONTENT, siteContentSchema, type SiteContent } from "@/src/app/lib/siteContentSchema";

function contentFilePath() {
  const configuredPath = process.env.ADMIN_CONTENT_PATH;
  if (!configuredPath) return join(process.cwd(), ".data", "site-content.json");
  return isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath);
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(contentFilePath(), "utf8");
    return siteContentSchema.parse(JSON.parse(raw));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return DEFAULT_SITE_CONTENT;
    }
    console.error("Could not read saved site content.", error);
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(input: unknown): Promise<SiteContent> {
  const content = siteContentSchema.parse(input);
  const filePath = contentFilePath();
  const folderPath = dirname(filePath);
  await mkdir(folderPath, { recursive: true });
  const temporaryPath = join(folderPath, `.site-content-${process.pid}-${Date.now()}.tmp`);
  await writeFile(temporaryPath, JSON.stringify(content, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temporaryPath, filePath);
  return content;
}
