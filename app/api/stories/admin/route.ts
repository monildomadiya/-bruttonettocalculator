import { revalidatePath, revalidateTag } from "next/cache";
import {
  createStoryFromImage,
  destroyStory,
  getCloudinaryConfig,
  isExpired,
  listStoryRecords,
  signStoryUpload,
  STORIES_CACHE_TAG,
  updateStoryContext,
} from "@/lib/cloudinary";
import { listPosts } from "@/lib/postsStore";
import { checkStoriesAdmin } from "@/lib/storiesAuth";
import { isStoryId, normalizeStoryLink, STORY_DURATIONS, STORY_LIMITS } from "@/lib/stories";

/**
 * Story admin API — every method requires the `x-stories-password` header.
 *
 *   GET                         all stories, including expired ones
 *   POST {action:"sign", …}     signed parameters for a direct Cloudinary upload
 *   POST {action:"published"}   refresh the tray on every page after an upload
 *   POST {action:"update", id, …} edit text/link/expiry, or extend (`extendHours`)
 *   POST {action:"from-post", slug, …} new story reusing an infographic's image
 *   DELETE ?id=stories/…        delete a story
 */
export const dynamic = "force-dynamic";

function notConfigured() {
  return Response.json(
    { error: "Cloudinary ist nicht eingerichtet (CLOUDINARY_* in .env fehlt)." },
    { status: 503 }
  );
}

/** Rebuild the story tray on every page: cached list + every ISR page. */
function refreshTray() {
  revalidateTag(STORIES_CACHE_TAG);
  revalidatePath("/", "layout");
}

export async function GET(req: Request) {
  const denied = await checkStoriesAdmin(req);
  if (denied) return denied;
  const cfg = getCloudinaryConfig();
  if (!cfg) return notConfigured();

  try {
    const records = await listStoryRecords(cfg, { fresh: true });
    const now = Date.now();
    return Response.json({
      stories: records.map((r) => ({ ...r, expired: isExpired(r, now) })),
    });
  } catch (err) {
    console.error("[stories admin]", err);
    return Response.json({ error: "Cloudinary nicht erreichbar." }, { status: 502 });
  }
}

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}

/** Validated story text + link from a request body, or an error message. */
function storyFields(body: Record<string, unknown>) {
  const title = text(body.title, STORY_LIMITS.title);
  if (!title) return "Titel fehlt.";
  const link = normalizeStoryLink(typeof body.link === "string" ? body.link : "");
  if (link === null) return "Link muss mit / beginnen (interne Seite) oder eine https-Adresse sein.";
  return {
    title,
    caption: text(body.caption, STORY_LIMITS.caption),
    link,
    linkLabel: link ? text(body.linkLabel, STORY_LIMITS.linkLabel) : "",
  };
}

function expiryFromHours(hours: number): string | null {
  return hours ? new Date(Date.now() + hours * 3600 * 1000).toISOString() : null;
}

export async function POST(req: Request) {
  const denied = await checkStoriesAdmin(req);
  if (denied) return denied;
  const cfg = getCloudinaryConfig();
  if (!cfg) return notConfigured();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return bad("Ungültige Anfrage.");

  if (body.action === "published") {
    refreshTray();
    return Response.json({ ok: true });
  }

  // Edit text/link/expiry of an existing story, or extend it (`extendHours`).
  if (body.action === "update") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!isStoryId(id)) return bad("Ungültige ID.");
    let current;
    try {
      current = (await listStoryRecords(cfg, { fresh: true })).find((r) => r.id === id);
    } catch {
      return bad("Cloudinary nicht erreichbar.", 502);
    }
    if (!current) return bad("Story nicht gefunden.", 404);

    const fields = body.title === undefined ? current : storyFields(body);
    if (typeof fields === "string") return bad(fields);

    let expiresAt = current.expiresAt;
    const extend = Number(body.extendHours);
    const hours = Number(body.durationHours);
    if (extend > 0) {
      // Unlimited stays unlimited; an expired story restarts from now.
      if (expiresAt) {
        const base = Math.max(Date.now(), Date.parse(expiresAt));
        expiresAt = new Date(base + extend * 3600 * 1000).toISOString();
      }
    } else if (body.durationHours !== undefined && hours !== -1) {
      if (!STORY_DURATIONS.some((d) => d.hours === hours)) return bad("Ungültige Laufzeit.");
      expiresAt = expiryFromHours(hours);
    }

    try {
      await updateStoryContext(cfg, id, { ...fields, expiresAt });
    } catch (err) {
      console.error("[stories admin]", err);
      return bad("Speichern bei Cloudinary fehlgeschlagen.", 502);
    }
    refreshTray();
    return Response.json({ ok: true, expiresAt });
  }

  if (body.action !== "sign" && body.action !== "from-post") return bad("Unbekannte Aktion.");

  const fields = storyFields(body);
  if (typeof fields === "string") return bad(fields);
  const hours = Number(body.durationHours);
  if (!STORY_DURATIONS.some((d) => d.hours === hours)) return bad("Ungültige Laufzeit.");
  const input = { ...fields, expiresAt: expiryFromHours(hours) };

  if (body.action === "sign") return Response.json(signStoryUpload(cfg, input));

  // Story from an infographic: reuse its image, no upload from the phone.
  const slug = typeof body.slug === "string" ? body.slug : "";
  let post;
  try {
    post = (await listPosts(cfg, { fresh: true })).find((p) => p.slug === slug);
  } catch {
    return bad("Cloudinary nicht erreichbar.", 502);
  }
  if (!post) return bad("Infografik nicht gefunden.", 404);
  try {
    await createStoryFromImage(cfg, post.image, input);
  } catch (err) {
    console.error("[stories admin]", err);
    return bad("Story konnte nicht erstellt werden.", 502);
  }
  refreshTray();
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const denied = await checkStoriesAdmin(req);
  if (denied) return denied;
  const cfg = getCloudinaryConfig();
  if (!cfg) return notConfigured();

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!isStoryId(id)) return Response.json({ error: "Ungültige ID." }, { status: 400 });

  try {
    await destroyStory(cfg, id);
  } catch (err) {
    console.error("[stories admin]", err);
    return Response.json({ error: "Löschen fehlgeschlagen." }, { status: 502 });
  }
  refreshTray();
  return Response.json({ ok: true });
}
