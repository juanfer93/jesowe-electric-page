import { createHash, createHmac, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { isIP } from "node:net";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const entries = new Map<string, RateLimitEntry>();
const MAX_ENTRIES = 10_000;
let callsSinceCleanup = 0;
let stateLoad: Promise<void> | undefined;
let stateWrite: Promise<void> = Promise.resolve();

function stateFilePath() {
  const configuredPath = process.env.ADMIN_CONTENT_PATH;
  const contentPath = !configuredPath
    ? join(process.cwd(), ".data", "site-content.json")
    : isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath);
  return join(dirname(contentPath), "request-rate-limits.json");
}

function storageKey(key: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret
    ? createHmac("sha256", secret).update(key).digest("hex")
    : createHash("sha256").update(key).digest("hex");
}

async function loadState() {
  if (stateLoad) return stateLoad;
  stateLoad = (async () => {
    try {
      const raw = await readFile(stateFilePath(), "utf8");
      if (Buffer.byteLength(raw, "utf8") > 2 * 1024 * 1024) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const now = Date.now();
      for (const item of parsed) {
        if (!Array.isArray(item) || item.length !== 2) continue;
        const [key, entry] = item as [unknown, unknown];
        if (typeof key !== "string" || !/^[a-f0-9]{64}$/i.test(key) ||
          typeof entry !== "object" || entry === null) continue;
        const saved = entry as Partial<RateLimitEntry>;
        if (typeof saved.count !== "number" || !Number.isSafeInteger(saved.count) || saved.count < 1 ||
          typeof saved.resetAt !== "number" || saved.resetAt <= now) continue;
        entries.set(key, { count: saved.count, resetAt: saved.resetAt });
        if (entries.size >= MAX_ENTRIES) break;
      }
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
        console.error("Could not read saved rate-limit state.", error);
      }
    }
  })();
  return stateLoad;
}

async function persistState() {
  const now = Date.now();
  const path = stateFilePath();
  const folder = dirname(path);
  const temporaryPath = join(folder, `.request-rate-limits-${process.pid}-${randomUUID()}.tmp`);
  const snapshot = JSON.stringify([...entries.entries()].filter(([, entry]) => entry.resetAt > now));
  const nextWrite = stateWrite.catch(() => undefined).then(async () => {
    await mkdir(folder, { recursive: true });
    await writeFile(temporaryPath, snapshot, { encoding: "utf8", mode: 0o600 });
    await rename(temporaryPath, path);
  });
  stateWrite = nextWrite;
  try {
    await nextWrite;
  } catch (error) {
    console.error("Could not save rate-limit state.", error);
  }
}

export function getClientAddress(request: Request) {
  const cloudflareAddress = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareAddress && isIP(cloudflareAddress)) return cloudflareAddress;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const addresses = forwardedFor?.split(",").map((address) => address.trim()).filter((address) => isIP(address));
  return addresses?.at(-1) || "unknown";
}

export async function consumeRateLimit(key: string, limit: number, windowMs: number) {
  await loadState();
  const now = Date.now();
  const hashedKey = storageKey(key);
  const current = entries.get(hashedKey);

  if (current && current.resetAt > now) {
    if (current.count >= limit) {
      return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
    }

    current.count += 1;
    await persistState();
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entries.set(hashedKey, { count: 1, resetAt: now + windowMs });
  callsSinceCleanup += 1;

  if (callsSinceCleanup >= 256 || entries.size > MAX_ENTRIES) {
    callsSinceCleanup = 0;
    for (const [entryKey, entry] of entries) {
      if (entry.resetAt <= now || entries.size > MAX_ENTRIES) entries.delete(entryKey);
    }
  }

  await persistState();
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function clearRateLimit(key: string) {
  await loadState();
  entries.delete(storageKey(key));
  await persistState();
}
