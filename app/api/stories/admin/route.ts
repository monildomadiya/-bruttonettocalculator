import { revalidatePath, revalidateTag } from "next/cache";
import {
  destroyStory,
  getCloudinaryConfig,
  isExpired,
  listStoryRecords,
  signStoryUpload,
  STORIES_CACHE_TAG,
} from "@/lib/cloudinary";
import { checkStoriesAdmin } from "@/lib/storiesAuth";
import { isStoryId, normalizeStoryLink, STORY_DURATIONS, STORY_LIMITS } from "@/lib/stories";

/**
 * Story admin API — every method requires the `x-stories-password` header.
 *
 *   GET                         all stories, including expired ones
 *   POST {action:"sign", …}     signed parameters for a direct Cloudinary upload
 *   POST {action:"published"}   refresh the tray on every page after an upload
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

export async function POST(req: Request) {
  const denied = await checkStoriesAdmin(req);
  if (denied) return denied;
  const cfg = getCloudinaryConfig();
  if (!cfg) return notConfigured();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

  if (body?.action === "published") {
    refreshTray();
    return Response.json({ ok: true });
  }

  if (body?.action !== "sign") {
    return Response.json({ error: "Unbekannte Aktion." }, { status: 400 });
  }

  const title = text(body.title, STORY_LIMITS.title);
  if (!title) return Response.json({ error: "Titel fehlt." }, { status: 400 });

  const link = normalizeStoryLink(typeof body.link === "string" ? body.link : "");
  if (link === null) {
    return Response.json(
      { error: "Link muss mit / beginnen (interne Seite) oder eine https-Adresse sein." },
      { status: 400 }
    );
  }

  const hours = Number(body.durationHours);
  if (!STORY_DURATIONS.some((d) => d.hours === hours)) {
    return Response.json({ error: "Ungültige Laufzeit." }, { status: 400 });
  }

  return Response.json(
    signStoryUpload(cfg, {
      title,
      caption: text(body.caption, STORY_LIMITS.caption),
      link,
      linkLabel: link ? text(body.linkLabel, STORY_LIMITS.linkLabel) : "",
      expiresAt: hours ? new Date(Date.now() + hours * 3600 * 1000).toISOString() : null,
    })
  );
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
