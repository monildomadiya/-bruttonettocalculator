import { revalidatePath, revalidateTag } from "next/cache";
import { destroyAsset, getCloudinaryConfig, type CloudinaryConfig } from "@/lib/cloudinary";
import {
  countWords,
  isPostImageId,
  isPostSlug,
  MIN_BODY_WORDS,
  POST_CATEGORIES,
  POST_LIMITS,
  type Post,
  type PostCategory,
} from "@/lib/posts";
import {
  deletePostFiles,
  listPosts,
  POSTS_CACHE_TAG,
  savePostFile,
  signPostImageUpload,
} from "@/lib/postsStore";
import { checkStoriesAdmin } from "@/lib/storiesAuth";

/**
 * Infografiken admin API — same password as the story admin.
 *
 *   GET                             all posts (fresh)
 *   POST {action:"sign-image"}      signed parameters for a direct image upload
 *   POST {action:"save", mode, …}   create or update a post
 *   DELETE ?slug=…                  delete a post and its image
 */
export const dynamic = "force-dynamic";

function fail(error: string, status = 400) {
  return Response.json({ error }, { status });
}

function refresh(slug: string) {
  revalidateTag(POSTS_CACHE_TAG);
  revalidatePath("/infografiken");
  revalidatePath(`/infografiken/${slug}`);
}

/** The Cloudinary config, or the error response to send instead. */
async function guard(req: Request): Promise<CloudinaryConfig | Response> {
  const denied = await checkStoriesAdmin(req);
  if (denied) return denied;
  return getCloudinaryConfig() ?? fail("Cloudinary ist nicht eingerichtet (CLOUDINARY_* in .env fehlt).", 503);
}

export async function GET(req: Request) {
  const cfg = await guard(req);
  if (cfg instanceof Response) return cfg;
  try {
    return Response.json({ posts: await listPosts(cfg, { fresh: true }) });
  } catch (err) {
    console.error("[posts admin]", err);
    return fail("Cloudinary nicht erreichbar.", 502);
  }
}

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const cfg = await guard(req);
  if (cfg instanceof Response) return cfg;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (body?.action === "sign-image") return Response.json(signPostImageUpload(cfg));
  if (body?.action !== "save") return fail("Unbekannte Aktion.");

  const mode = body.mode === "edit" ? "edit" : "create";
  const slug = text(body.slug, 80);
  if (!isPostSlug(slug)) return fail("URL-Slug: nur a–z, 0–9 und Bindestriche.");

  const title = text(body.title, POST_LIMITS.title);
  if (title.length < 10) return fail("Titel ist zu kurz (mindestens 10 Zeichen).");

  const description = text(body.description, POST_LIMITS.description);
  if (description.length < POST_LIMITS.descriptionMin) {
    return fail(`Beschreibung: mindestens ${POST_LIMITS.descriptionMin} Zeichen.`);
  }

  const category = body.category as PostCategory;
  if (!POST_CATEGORIES.includes(category)) return fail("Ungültige Kategorie.");

  const postBody = typeof body.body === "string" ? body.body.trim().slice(0, POST_LIMITS.body) : "";
  if (countWords(postBody) < MIN_BODY_WORDS) {
    return fail(
      `Text: mindestens ${MIN_BODY_WORDS} Wörter. Nur ein Bild ist für Google „dünner Inhalt“ und rankt nicht.`
    );
  }

  const calculator = text(body.calculator, 200);
  if (calculator && (!calculator.startsWith("/") || calculator.startsWith("//") || /\s/.test(calculator))) {
    return fail("Rechner-Link muss ein Pfad dieser Website sein (/…).");
  }

  const facts = (Array.isArray(body.facts) ? body.facts : [])
    .map((f) => ({
      label: text((f as Record<string, unknown>)?.label, POST_LIMITS.factText),
      value: text((f as Record<string, unknown>)?.value, POST_LIMITS.factText),
    }))
    .filter((f) => f.label && f.value)
    .slice(0, POST_LIMITS.facts);

  const img = (body.image ?? {}) as Record<string, unknown>;
  const image = {
    id: String(img.id ?? ""),
    version: Number(img.version),
    width: Number(img.width),
    height: Number(img.height),
    alt: text(img.alt, POST_LIMITS.alt),
  };
  if (!isPostImageId(image.id) || ![image.version, image.width, image.height].every(Number.isInteger)) {
    return fail("Bild fehlt oder ist ungültig.");
  }
  if (!image.alt) return fail("Alt-Text fehlt — Google Bilder braucht ihn.");

  let existing: Post[];
  try {
    existing = await listPosts(cfg, { fresh: true });
  } catch {
    return fail("Cloudinary nicht erreichbar.", 502);
  }
  const previous = existing.find((p) => p.slug === slug);
  if (mode === "create" && previous) return fail("Diesen URL-Slug gibt es schon — bitte einen anderen wählen.");
  if (mode === "edit" && !previous) return fail("Beitrag nicht gefunden.", 404);

  const now = new Date().toISOString();
  const post: Post = {
    slug,
    title,
    description,
    category,
    body: postBody,
    facts,
    calculator,
    image,
    publishedAt: previous?.publishedAt ?? now,
    updatedAt: now,
  };

  try {
    await savePostFile(cfg, post);
  } catch (err) {
    console.error("[posts admin]", err);
    return fail("Speichern bei Cloudinary fehlgeschlagen.", 502);
  }

  // A replaced image is no longer referenced by anything.
  if (previous && previous.image.id !== image.id) {
    await destroyAsset(cfg, "image", previous.image.id).catch((err) => console.error("[posts admin]", err));
  }

  refresh(slug);
  return Response.json({ ok: true, post });
}

export async function DELETE(req: Request) {
  const cfg = await guard(req);
  if (cfg instanceof Response) return cfg;

  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!isPostSlug(slug)) return fail("Ungültiger Slug.");

  try {
    const post = (await listPosts(cfg, { fresh: true })).find((p) => p.slug === slug);
    if (!post) return fail("Beitrag nicht gefunden.", 404);
    await deletePostFiles(cfg, post);
  } catch (err) {
    console.error("[posts admin]", err);
    return fail("Löschen fehlgeschlagen.", 502);
  }
  refresh(slug);
  return Response.json({ ok: true });
}
