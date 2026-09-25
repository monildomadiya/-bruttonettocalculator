/**
 * Server-only storage for Infografiken (see lib/posts.ts).
 *
 * Like stories, posts need no database: each post is a small JSON file stored
 * in Cloudinary as a raw asset `posts/<slug>.json` (tag `site_post`), next to
 * its image `posts/img-<key>`. That survives redeploys and a rebuilt VM, and
 * uses the credentials the site already has.
 *
 * Reading costs one Admin API call (the tag listing, cached for an hour and
 * refreshed on every save) plus one CDN fetch per post, cached for good because
 * the URL carries the file's version.
 */
import crypto from "crypto";
import {
  destroyAsset,
  getCloudinaryConfig,
  sign,
  STORIES_REVALIDATE_SECONDS,
  type CloudinaryConfig,
} from "@/lib/cloudinary";
import {
  isPostImageId,
  isPostSlug,
  POST_CATEGORIES,
  type Post,
  type PostImageSize,
} from "@/lib/posts";

const POST_TAG = "site_post";
/** Next.js cache tag; `revalidateTag(POSTS_CACHE_TAG)` refreshes every page that lists posts. */
export const POSTS_CACHE_TAG = "posts";

/** Delivery sizes; also generated eagerly at upload. Keep in sync with lib/posts.ts. */
export const POST_TRANSFORMS: Record<PostImageSize, string> = {
  thumb: "c_fill,g_auto,w_600,h_600,q_auto,f_webp",
  full: "c_limit,w_1200,h_1800,q_auto,f_webp",
  og: "c_limit,w_1200,h_1200,q_auto,f_jpg",
};

const INCOMING_TRANSFORM = "c_limit,w_2400,h_3600";

function jsonId(slug: string) {
  return `posts/${slug}.json`;
}

/* ─────────────────────────── Reading ─────────────────────────── */

interface RawResource {
  public_id: string;
  version: number;
}

async function listPostFiles(cfg: CloudinaryConfig, fresh: boolean): Promise<RawResource[]> {
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/resources/raw/tags/${POST_TAG}?max_results=500`,
    {
      headers: {
        Authorization: "Basic " + Buffer.from(`${cfg.apiKey}:${cfg.apiSecret}`).toString("base64"),
      },
      ...(fresh
        ? { cache: "no-store" as const }
        : { next: { revalidate: STORIES_REVALIDATE_SECONDS, tags: [POSTS_CACHE_TAG] } }),
    }
  );
  if (!res.ok) throw new Error(`Cloudinary post list failed: ${res.status}`);
  const data = (await res.json()) as { resources?: RawResource[] };
  return (data.resources ?? []).filter((r) => /^posts\/[a-z0-9-]+\.json$/.test(r.public_id));
}

/** Rejects anything that isn't a complete post, so one bad file can't break a page. */
function toPost(data: unknown): Post | null {
  const p = data as Partial<Post> | null;
  if (
    !p ||
    typeof p.slug !== "string" ||
    !isPostSlug(p.slug) ||
    typeof p.title !== "string" ||
    typeof p.description !== "string" ||
    typeof p.body !== "string" ||
    !POST_CATEGORIES.includes(p.category as Post["category"]) ||
    !p.image ||
    !isPostImageId(p.image.id) ||
    !Number.isInteger(p.image.version) ||
    !Number.isInteger(p.image.width) ||
    !Number.isInteger(p.image.height) ||
    typeof p.publishedAt !== "string" ||
    typeof p.updatedAt !== "string"
  ) {
    return null;
  }
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category as Post["category"],
    body: p.body,
    facts: Array.isArray(p.facts) ? p.facts.filter((f) => f && f.label && f.value) : [],
    calculator: typeof p.calculator === "string" ? p.calculator : "",
    image: {
      id: p.image.id,
      version: p.image.version,
      width: p.image.width,
      height: p.image.height,
      alt: typeof p.image.alt === "string" ? p.image.alt : p.title,
    },
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
  };
}

async function loadPost(cfg: CloudinaryConfig, r: RawResource): Promise<Post | null> {
  try {
    const res = await fetch(
      `https://res.cloudinary.com/${cfg.cloudName}/raw/upload/v${r.version}/${r.public_id}`,
      { cache: "force-cache" }
    );
    return res.ok ? toPost(await res.json()) : null;
  } catch {
    return null;
  }
}

export async function listPosts(cfg: CloudinaryConfig, { fresh = false } = {}): Promise<Post[]> {
  const files = await listPostFiles(cfg, fresh);
  const posts = await Promise.all(files.map((f) => loadPost(cfg, f)));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

/** All posts, newest first, for public pages. Never throws: an outage shows no posts. */
export async function getPublishedPosts(): Promise<Post[]> {
  const cfg = getCloudinaryConfig();
  if (!cfg) return [];
  try {
    return await listPosts(cfg);
  } catch (err) {
    console.error("[posts]", err);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<Post | undefined> {
  return (await getPublishedPosts()).find((p) => p.slug === slug);
}

/**
 * Up to `count` other posts: same category first, then the newest of the rest —
 * so the end of every post page leads straight into the next one.
 */
export function relatedPosts(all: Post[], current: Post, count = 6): Post[] {
  const others = all.filter((p) => p.slug !== current.slug);
  const same = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, count);
}

/* ─────────────────────────── Writing ─────────────────────────── */

/** Signed parameters for uploading a post image straight from the admin's browser. */
export function signPostImageUpload(cfg: CloudinaryConfig) {
  const params: Record<string, string | number> = {
    allowed_formats: "jpg,jpeg,png,webp,avif,heic,heif",
    eager: `${POST_TRANSFORMS.thumb}|${POST_TRANSFORMS.full}|${POST_TRANSFORMS.og}`,
    public_id: `posts/img-${crypto.randomBytes(12).toString("base64url")}`,
    tags: "site_post_image",
    timestamp: Math.floor(Date.now() / 1000),
    transformation: INCOMING_TRANSFORM,
  };
  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`,
    fields: { ...params, api_key: cfg.apiKey, signature: sign(params, cfg.apiSecret) },
  };
}

/** Writes (or overwrites) `posts/<slug>.json`. Runs on our server, never in the browser. */
export async function savePostFile(cfg: CloudinaryConfig, post: Post): Promise<void> {
  const params = {
    invalidate: "true",
    overwrite: "true",
    public_id: jsonId(post.slug),
    tags: POST_TAG,
    timestamp: Math.floor(Date.now() / 1000),
  };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  form.append("api_key", cfg.apiKey);
  form.append("signature", sign(params, cfg.apiSecret));
  form.append("file", new Blob([JSON.stringify(post)], { type: "application/json" }), "post.json");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/raw/upload`, {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(`Cloudinary save failed: ${res.status} ${data.error?.message ?? ""}`);
  }
}

export async function deletePostFiles(cfg: CloudinaryConfig, post: Pick<Post, "slug" | "image">) {
  await destroyAsset(cfg, "raw", jsonId(post.slug));
  await destroyAsset(cfg, "image", post.image.id);
}
