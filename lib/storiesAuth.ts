/**
 * Password check for the story admin (server-only).
 *
 * The password lives in STORIES_ADMIN_PASSWORD on the server and is sent by the
 * admin page in the `x-stories-password` header on every request — there is no
 * session cookie to forge (the old admin panel fell to exactly that). Without the
 * variable, or with one shorter than 12 characters, the admin API stays closed.
 */
import crypto from "crypto";

const MIN_PASSWORD_LENGTH = 12;
const MAX_FAILURES = 10;
const LOCKOUT_MS = 15 * 60 * 1000;

/** Failed attempts per client IP. In-memory is enough for one pm2 process. */
const failures = new Map<string, { count: number; until: number }>();

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function digest(v: string): Buffer {
  return crypto.createHash("sha256").update(v).digest();
}

/** Returns an error response, or null when the request is authorised. */
export async function checkStoriesAdmin(req: Request): Promise<Response | null> {
  const expected = process.env.STORIES_ADMIN_PASSWORD ?? "";
  if (expected.length < MIN_PASSWORD_LENGTH) {
    return Response.json(
      { error: "Story-Admin ist nicht eingerichtet (STORIES_ADMIN_PASSWORD fehlt oder ist kürzer als 12 Zeichen)." },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  const now = Date.now();
  const entry = failures.get(ip);
  if (entry && entry.count >= MAX_FAILURES && entry.until > now) {
    return Response.json({ error: "Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen." }, { status: 429 });
  }

  const given = req.headers.get("x-stories-password") ?? "";
  if (crypto.timingSafeEqual(digest(given), digest(expected))) {
    failures.delete(ip);
    return null;
  }

  const count = entry && entry.until > now ? entry.count + 1 : 1;
  failures.set(ip, { count, until: now + LOCKOUT_MS });
  await new Promise((r) => setTimeout(r, 700));
  return Response.json({ error: "Falsches Passwort." }, { status: 401 });
}
