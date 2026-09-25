/**
 * Server-only Cloudinary access for the Stories feature.
 *
 * Credentials come from the environment (.env on the server, never the repo):
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Without them every function here degrades to "no stories" — the site builds
 * and runs exactly as before.
 *
 * Talks to the REST API with fetch + a SHA-1 signature instead of pulling in the
 * cloudinary SDK: three calls (list by tag, signed upload, destroy) don't justify
 * a dependency that was removed from this project once already.
 */
import crypto from "crypto";
import { isStoryId, type Story } from "@/lib/stories";
import { resolveStoryLink } from "@/lib/storyLinks";

/** Cloudinary tag that marks an asset as a story. */
const STORY_TAG = "site_story";
/** Next.js cache tag; `revalidateTag(STORIES_CACHE_TAG)` refreshes every page. */
export const STORIES_CACHE_TAG = "stories";
/** How long a page may show a stale story list before it is re-fetched. */
export const STORIES_REVALIDATE_SECONDS = 3600;
/** At most this many stories are shown in the tray. */
const MAX_STORIES = 20;

/**
 * Delivery transformations. They are also requested as `eager` at upload time,
 * so both sizes exist before the first visitor asks for them and the account's
 * "strict transformations" setting can stay on.
 */
export const STORY_TRANSFORMS = {
  thumb: "c_fill,g_auto,w_176,h_176,q_auto,f_webp",
  full: "c_limit,w_1080,h_1920,q_auto,f_webp",
} as const;

/** Applied on upload: caps the stored original so phone photos don't eat storage. */
const INCOMING_TRANSFORM = "c_limit,w_2160,h_3840";

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/** https://cloudinary.com/documentation/authentication_signatures */
function sign(params: Record<string, string | number>, secret: string): string {
  const payload = Object.keys(params)
    .filter((k) => params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(payload + secret).digest("hex");
}

/** Context values separate pairs with `|` and key/value with `=`; both must be escaped. */
function contextValue(v: string): string {
  return v.replace(/[\\\r\n\t]+/g, " ").trim().replace(/([=|])/g, "\\$1");
}

function buildContext(fields: Record<string, string>): string {
  return Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${contextValue(v)}`)
    .join("|");
}

/* ─────────────────────────── Reading ─────────────────────────── */

interface CloudinaryResource {
  public_id: string;
  version: number;
  created_at: string;
  context?: { custom?: Record<string, string> };
}

export interface StoryRecord {
  id: string;
  version: number;
  title: string;
  caption: string;
  link: string;
  linkLabel: string;
  createdAt: string;
  expiresAt: string | null;
}

function toRecord(r: CloudinaryResource): StoryRecord {
  const c = r.context?.custom ?? {};
  const expires = c.expires && !Number.isNaN(Date.parse(c.expires)) ? c.expires : null;
  return {
    id: r.public_id,
    version: r.version,
    title: c.title ?? "",
    caption: c.caption ?? "",
    link: c.link ?? "",
    linkLabel: c.label ?? "",
    createdAt: r.created_at,
    expiresAt: expires,
  };
}

export function isExpired(s: Pick<StoryRecord, "expiresAt">, now = Date.now()): boolean {
  return s.expiresAt !== null && Date.parse(s.expiresAt) <= now;
}

/**
 * All story assets, newest first. `fresh` bypasses the Next.js data cache (admin
 * view); otherwise the result is shared by every page render for up to an hour,
 * so ISR regenerating hundreds of pages still costs one Admin API call.
 */
export async function listStoryRecords(
  cfg: CloudinaryConfig,
  { fresh = false }: { fresh?: boolean } = {}
): Promise<StoryRecord[]> {
  const url =
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/resources/image/tags/${STORY_TAG}` +
    `?context=true&max_results=100`;
  const res = await fetch(url, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${cfg.apiKey}:${cfg.apiSecret}`).toString("base64"),
    },
    ...(fresh
      ? { cache: "no-store" as const }
      : { next: { revalidate: STORIES_REVALIDATE_SECONDS, tags: [STORIES_CACHE_TAG] } }),
  });
  if (!res.ok) throw new Error(`Cloudinary list failed: ${res.status}`);
  const data = (await res.json()) as { resources?: CloudinaryResource[] };
  return (data.resources ?? [])
    .filter((r) => isStoryId(r.public_id))
    .map(toRecord)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

/** Stories for the public tray. Never throws: a Cloudinary outage just hides the tray. */
export async function getActiveStories(): Promise<Story[]> {
  const cfg = getCloudinaryConfig();
  if (!cfg) return [];

  let records: StoryRecord[];
  try {
    records = await listStoryRecords(cfg);
  } catch (err) {
    console.error("[stories]", err);
    return [];
  }

  const now = Date.now();
  return records
    .filter((r) => !isExpired(r, now))
    .slice(0, MAX_STORIES)
    .map((r) => {
      const { defaultLabel, ...resolved } = resolveStoryLink(r.link);
      return {
        ...r,
        ...resolved,
        linkLabel: r.linkLabel || defaultLabel || "",
        isNew: now - Date.parse(r.createdAt) < 24 * 3600 * 1000,
      };
    });
}

/* ─────────────────────────── Writing ─────────────────────────── */

export interface StoryUploadInput {
  title: string;
  caption: string;
  link: string;
  linkLabel: string;
  expiresAt: string | null;
}

/**
 * Parameters for a signed upload straight from the admin's browser to
 * Cloudinary. The image never passes through our server (no body-size limit in
 * nginx/Next to fight), yet nothing can be changed client-side: public_id,
 * folder, tag, metadata and transformations are all covered by the signature.
 */
export function signStoryUpload(cfg: CloudinaryConfig, input: StoryUploadInput) {
  const params: Record<string, string | number> = {
    allowed_formats: "jpg,jpeg,png,webp,avif,heic,heif",
    context: buildContext({
      title: input.title,
      caption: input.caption,
      link: input.link,
      label: input.linkLabel,
      expires: input.expiresAt ?? "",
    }),
    eager: `${STORY_TRANSFORMS.thumb}|${STORY_TRANSFORMS.full}`,
    public_id: `stories/${crypto.randomBytes(12).toString("base64url")}`,
    tags: STORY_TAG,
    timestamp: Math.floor(Date.now() / 1000),
    transformation: INCOMING_TRANSFORM,
  };
  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`,
    fields: { ...params, api_key: cfg.apiKey, signature: sign(params, cfg.apiSecret) },
  };
}

export async function destroyStory(cfg: CloudinaryConfig, id: string): Promise<void> {
  const params = { invalidate: "true", public_id: id, timestamp: Math.floor(Date.now() / 1000) };
  const body = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    api_key: cfg.apiKey,
    signature: sign(params, cfg.apiSecret),
  });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/destroy`, {
    method: "POST",
    body,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { result?: string };
  if (!res.ok || (data.result !== "ok" && data.result !== "not found")) {
    throw new Error(`Cloudinary destroy failed: ${res.status} ${data.result ?? ""}`);
  }
}
