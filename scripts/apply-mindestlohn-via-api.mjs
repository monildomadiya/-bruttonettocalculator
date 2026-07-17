/**
 * Applies the rewritten mindestlohn article (scripts/mindestlohn-article-data.mjs)
 * through the running app's admin API (PUT /api/articles/<slug>). Use this when
 * the MySQL DB is only reachable by the Next.js process (e.g. a sandboxed dev
 * server) and not by a standalone script.
 *
 *   BASE_URL=http://localhost:3000 node scripts/apply-mindestlohn-via-api.mjs
 *
 * It GETs the current row first so unrelated fields (category, featured_image,
 * read_time, …) are preserved, then overrides only the rewritten fields.
 * Auth uses the same admin_session cookie the admin panel sets.
 */
import {
  SLUG, CANONICAL, HEADLINE, META_TITLE, META_DESCRIPTION, EXCERPT,
  FOCUS_KEYWORD, TAGS, CONTENT, FAQS, CATEGORY, READ_TIME,
} from "./mindestlohn-article-data.mjs";

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const COOKIE = "admin_session=authenticated_secret_token_2026";

async function main() {
  // 1. Fetch the current article to preserve unrelated fields.
  const getRes = await fetch(`${BASE}/api/articles/${SLUG}`);
  const getJson = await getRes.json().catch(() => ({}));
  if (!getRes.ok || !getJson.success) {
    console.error(`❌ Could not load article "${SLUG}": ${getJson.error || getRes.status}`);
    process.exitCode = 1;
    return;
  }
  const current = getJson.article;

  // 2. Merge: keep everything, override the rewritten fields.
  const body = {
    ...current,
    slug: SLUG,
    headline: HEADLINE,
    meta_title: META_TITLE,
    meta_description: META_DESCRIPTION,
    excerpt: EXCERPT,
    focus_keyword: FOCUS_KEYWORD,
    tags: TAGS,
    canonical_url: CANONICAL,
    enable_toc: true,
    content: CONTENT,
    faqs: FAQS,
    og_title: META_TITLE,
    og_description: META_DESCRIPTION,
    category: current.category || CATEGORY,
    read_time: current.read_time || READ_TIME,
    status: "Published",
  };

  // 3. PUT it back.
  const putRes = await fetch(`${BASE}/api/articles/${SLUG}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: COOKIE },
    body: JSON.stringify(body),
  });
  const putJson = await putRes.json().catch(() => ({}));
  if (!putRes.ok || !putJson.success) {
    console.error(`❌ Update failed: ${putJson.error || putRes.status}`);
    process.exitCode = 1;
    return;
  }
  console.log(`✅ Article "${SLUG}" updated via admin API.`);
}

main().catch((err) => {
  console.error("❌ apply-via-api failed:", err.message);
  process.exitCode = 1;
});
