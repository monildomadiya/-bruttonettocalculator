/**
 * Lightweight SEO smoke-check. Crawls a set of representative URLs on a running
 * instance and validates the on-page SEO essentials:
 *   status code · title + length · meta description · canonical (non-WWW,
 *   self-referencing) · single <h1> · robots directive · JSON-LD parses.
 *
 * Usage (against a running `next start` / `next dev`):
 *   node scripts/seo-check.mjs                       # defaults to :3000
 *   BASE_URL=http://localhost:3007 node scripts/seo-check.mjs
 *
 * Exit code is non-zero if any hard check fails, so it can gate CI.
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const CANON_HOST = "bruttonettocalculator.com";
const TITLE_MAX = 65;

const PATHS = [
  "/",
  "/gehaltsrechner",
  "/blog",
  "/blog/brutto-netto-rechner-2026-mindestlohn-2027",
  "/rechner/3000-euro-brutto-netto",
  "/brutto-netto-gehaltstabelle",
  "/mindestlohn",
  "/steuerklassen",
  "/brutto-netto-rechner/bayern",
  "/kontakt",
  "/impressum",
  // Phase 2 priority pages
  "/weihnachtsgeld-rechner",
  "/arbeitgeber-brutto-netto-rechner",
  "/arbeitslosengeld-rechner",
  "/firmenwagenrechner",
  "/stundenlohn-rechner",
  "/rechner/2500-euro-brutto-netto",
  "/rechner/4000-euro-brutto-netto",
  "/rechner/5000-euro-brutto-netto",
];

function pick(re, html) {
  const m = re.exec(html);
  return m ? m[1].trim() : null;
}

function checkPage(path, status, html) {
  const problems = [];
  const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
  const desc = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i, html);
  const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i, html);
  const robots = pick(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i, html);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;

  // JSON-LD blocks
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ld, ldCount = 0, ldBad = 0;
  while ((ld = ldRe.exec(html))) {
    ldCount++;
    try { JSON.parse(ld[1]); } catch { ldBad++; }
  }

  if (status !== 200) problems.push(`status ${status}`);
  if (!title) problems.push("missing <title>");
  else if (title.length > TITLE_MAX) problems.push(`title ${title.length} chars (>${TITLE_MAX})`);
  if (!desc) problems.push("missing meta description");
  if (!canonical) problems.push("missing canonical");
  else {
    if (/\/\/www\./i.test(canonical)) problems.push(`canonical uses www: ${canonical}`);
    if (!canonical.startsWith("https://" + CANON_HOST)) problems.push(`canonical wrong host: ${canonical}`);
  }
  if (h1Count !== 1) problems.push(`h1 count = ${h1Count}`);
  if (ldBad > 0) problems.push(`${ldBad}/${ldCount} JSON-LD blocks invalid`);

  return { title, desc: !!desc, canonical, robots, h1Count, ldCount, ldBad, problems };
}

async function main() {
  let failures = 0;
  console.log(`SEO check against ${BASE}\n`);
  for (const path of PATHS) {
    try {
      const res = await fetch(BASE + path, { redirect: "manual" });
      if (res.status >= 300 && res.status < 400) {
        console.log(`↪︎  ${path}  → ${res.status} ${res.headers.get("location")}`);
        continue;
      }
      const html = await res.text();
      const r = checkPage(path, res.status, html);
      const ok = r.problems.length === 0;
      if (!ok) failures++;
      console.log(`${ok ? "✅" : "❌"} ${path}`);
      console.log(`     title(${r.title ? r.title.length : 0}): ${r.title || "—"}`);
      console.log(`     canonical: ${r.canonical || "—"}  | h1: ${r.h1Count}  | jsonld: ${r.ldCount} (${r.ldBad} bad)  | robots: ${r.robots || "default"}`);
      if (!ok) console.log(`     ⚠️  ${r.problems.join("; ")}`);
    } catch (err) {
      failures++;
      console.log(`❌ ${path} — fetch error: ${err.message}`);
    }
  }
  console.log(`\n${failures === 0 ? "All pages passed." : failures + " page(s) with problems."}`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main();
