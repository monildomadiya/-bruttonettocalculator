/**
 * Infografiken — Instagram-style image posts, each with its own indexable page
 * at /infografiken/<slug>. Shared types and helpers (safe for client components).
 *
 * Unlike stories, posts are permanent SEO content. An image alone is thin
 * content for Google, so every post carries real text: a meta description, an
 * alt text, key facts and a body of at least MIN_BODY_WORDS words. Storage and
 * server-side access live in lib/postsStore.ts.
 */

export const POST_CATEGORIES = [
  "Gehalt & Netto",
  "Steuern",
  "Sozialversicherung",
  "Krankenversicherung",
  "Rente & Vorsorge",
  "Immobilien & Finanzen",
  "Familie & Sozialleistungen",
  "Arbeit & Recht",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export interface PostFact {
  label: string;
  value: string;
}

export interface PostImage {
  /** Cloudinary public_id, always `posts/img-<key>`. */
  id: string;
  version: number;
  width: number;
  height: number;
  alt: string;
}

/** What is stored as JSON in Cloudinary (`posts/<slug>.json`). */
export interface Post {
  slug: string;
  title: string;
  description: string;
  category: PostCategory;
  /** Plain text: blank line = new paragraph, "## " = subheading, "- " = list item, **bold**. */
  body: string;
  facts: PostFact[];
  /** Site path of the matching calculator ("" when none). */
  calculator: string;
  image: PostImage;
  publishedAt: string;
  updatedAt: string;
}

export const POST_LIMITS = {
  title: 90,
  /** Google shows ~60 characters of a title before cutting it. */
  titleIdeal: 60,
  descriptionMin: 50,
  description: 160,
  alt: 150,
  body: 8000,
  facts: 6,
  factText: 60,
  fileBytes: 10 * 1024 * 1024,
} as const;

/** Below this a post is thin content — the API refuses to publish it. */
export const MIN_BODY_WORDS = 80;
/** What the admin checklist recommends for a post that can rank. */
export const GOOD_BODY_WORDS = 150;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_ID_RE = /^posts\/img-[A-Za-z0-9_-]{8,40}$/;

export function isPostSlug(slug: string): boolean {
  return slug.length <= 80 && SLUG_RE.test(slug);
}

export function isPostImageId(id: string): boolean {
  return IMAGE_ID_RE.test(id);
}

/** "Mindestlohn 2027: Was bleibt?" → "mindestlohn-2027-was-bleibt" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/* ─────────────────────────── Images ─────────────────────────── */

export type PostImageSize = "thumb" | "full" | "og";

/** Longest edges of the delivered sizes — must match POST_TRANSFORMS in lib/postsStore.ts. */
const FULL_MAX = { w: 1200, h: 1800 };
const OG_MAX = { w: 1200, h: 1200 };

/**
 * Images are served from our own origin under /bilder/ — crawlable (unlike
 * /api/, which robots.txt blocks) so they can rank in Google Images, and named
 * after the post slug, which Google reads as a relevance signal.
 */
export function postImagePath(post: Pick<Post, "slug" | "image">, size: PostImageSize): string {
  const key = post.image.id.slice("posts/img-".length);
  const ext = size === "og" ? "jpg" : "webp";
  return `/bilder/${size}/${post.image.version}/${key}/${post.slug}.${ext}`;
}

/** Pixel size of a delivered image (c_limit never upscales). */
export function postImageSize(image: PostImage, size: "full" | "og"): { width: number; height: number } {
  const max = size === "full" ? FULL_MAX : OG_MAX;
  const scale = Math.min(1, max.w / image.width, max.h / image.height);
  return { width: Math.round(image.width * scale), height: Math.round(image.height * scale) };
}

/* ─────────────────────────── Body text ─────────────────────────── */

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

/** Plain-text body → blocks. No HTML is ever accepted, so nothing can be injected. */
export function parsePostBody(body: string): PostBlock[] {
  const blocks: PostBlock[] = [];
  for (const chunk of body.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    let para: string[] = [];
    const flush = () => {
      if (para.length) blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    };
    for (const line of lines) {
      if (line.startsWith("## ")) {
        flush();
        blocks.push({ type: "h2", text: line.slice(3).trim() });
      } else if (/^[-•*] /.test(line)) {
        flush();
        const last = blocks[blocks.length - 1];
        const item = line.slice(2).trim();
        if (last?.type === "ul") last.items.push(item);
        else blocks.push({ type: "ul", items: [item] });
      } else {
        para.push(line);
      }
    }
    flush();
  }
  return blocks;
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}
