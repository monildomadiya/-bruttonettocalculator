/**
 * Stories — shared types and helpers (safe to import from client components).
 *
 * A story is one image uploaded to Cloudinary, tagged `site_story`, with its
 * text stored as Cloudinary "context" metadata. There is no database: the
 * Cloudinary tag listing *is* the list of stories. Server-side access lives in
 * lib/cloudinary.ts; this file must not import anything server-only.
 */

export type StoryLinkKind = "article" | "tool" | "page" | "external";

export interface Story {
  /** Cloudinary public_id, always `stories/<random>`. */
  id: string;
  version: number;
  /** Short label under the ring (like an Instagram username). */
  title: string;
  /** Text shown on the story itself. */
  caption: string;
  /** Linked post/page, "" when the story links nowhere. */
  link: string;
  /** Text of the link card at the bottom of the story. */
  linkLabel: string;
  linkKind: StoryLinkKind;
  /** Teaser of the linked blog post / tool, resolved server-side. */
  linkExcerpt?: string;
  /** Site-relative thumbnail of the linked post, resolved server-side. */
  linkImage?: string;
  createdAt: string;
  /** ISO timestamp, or null for a story that never expires. */
  expiresAt: string | null;
  /** Uploaded less than 24 h ago (computed at render time on the server). */
  isNew: boolean;
}

export const STORY_LIMITS = {
  title: 24,
  caption: 220,
  linkLabel: 90,
  /** Cloudinary's free plan rejects images above 10 MB. */
  fileBytes: 10 * 1024 * 1024,
} as const;

export const STORY_DURATIONS = [
  { hours: 24, label: "24 Stunden" },
  { hours: 72, label: "3 Tage" },
  { hours: 168, label: "7 Tage" },
  { hours: 720, label: "30 Tage" },
  { hours: 0, label: "Unbegrenzt" },
] as const;

export const DEFAULT_STORY_HOURS = 168;

const STORY_ID_RE = /^stories\/[A-Za-z0-9_-]{6,64}$/;

export function isStoryId(id: string): boolean {
  return STORY_ID_RE.test(id);
}

/** The part after `stories/` — what goes into a shareable `?story=` URL. */
export function storyShortId(id: string): string {
  return id.slice(id.indexOf("/") + 1);
}

/**
 * Images are served through our own route (app/api/stories/image), not straight
 * from res.cloudinary.com: visitors' browsers then never contact a third party,
 * so the privacy policy needs no new processor, and the cloud name stays private.
 */
export function storyImageSrc(story: Pick<Story, "id" | "version">, size: "thumb" | "full"): string {
  return `/api/stories/image?id=${encodeURIComponent(story.id)}&v=${story.version}&s=${size}`;
}

/**
 * Accepts a site-relative path ("/blog/foo") or an absolute https URL.
 * Returns "" for empty input and null for anything else — in particular
 * `javascript:` and protocol-relative URLs never reach an href.
 */
export function normalizeStoryLink(raw: string): string | null {
  const link = raw.trim();
  if (!link) return "";
  if (link.startsWith("/") && !link.startsWith("//") && !/\s/.test(link)) return link;
  try {
    const url = new URL(link);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

/** GA4 event; a no-op wherever Analytics isn't loaded (internal routes, blockers). */
export function trackStory(event: string, params: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}
