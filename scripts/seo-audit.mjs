/**
 * Full-site SEO audit — die breite Variante von `seo-check.mjs` (das nur eine
 * feste Handvoll Pfade prüft). Zieht *alle* URLs aus der laufenden Sitemap,
 * lädt jede einzeln und meldet doppelte, fehlende oder fehlerhafte On-Page-
 * Signale: Titles, Descriptions, Canonicals, H1, JSON-LD, og:image, hreflang,
 * verwaiste Seiten und interne Links ins Leere.
 *
 * Gegen einen laufenden `next dev` / `next start`:
 *   node scripts/seo-audit.mjs                        # alle Sitemap-URLs
 *   LIMIT=60 node scripts/seo-audit.mjs               # Stichprobe
 *   BASE_URL=https://bruttonettocalculator.com node scripts/seo-audit.mjs
 *
 * Schwellenwerte: Title 25–60 Zeichen, Description 70–165, Body ab 300 Wörtern.
 * Hinweis: JSON-LD in einem `@graph`-Container wird als Typ "?" gezählt — das
 * ist gültiges Markup, kein Befund.
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const CANON_HOST = "bruttonettocalculator.com";
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT) : Infinity;
const CONC = 6;

const pick = (re, html) => { const m = re.exec(html); return m ? m[1].trim() : null; };
const decode = (s) => s && s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

async function getSitemapUrls() {
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https:\/\/[^/]+/, ""))
    .map((p) => (p === "" ? "/" : p));
}

function analyze(path, status, html) {
  const title = decode(pick(/<title[^>]*>([\s\S]*?)<\/title>/i, html));
  const desc = decode(pick(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i, html));
  const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i, html);
  const robots = pick(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i, html);
  const ogImg = pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i, html)
             || pick(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i, html);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()));
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const hreflangs = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi)].map((m) => m[1]);

  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ld, ldTypes = [], ldBad = 0;
  while ((ld = ldRe.exec(html))) {
    try { const j = JSON.parse(ld[1]); ldTypes.push(j["@type"] || "?"); } catch { ldBad++; }
  }

  // crude body word count (strip head, scripts, tags)
  const body = html.replace(/<head[\s\S]*?<\/head>/i, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const words = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;

  // internal links
  const links = [...html.matchAll(/<a[^>]+href=["'](\/[^"'#?]*)["']/gi)].map((m) => m[1].replace(/\/$/, "") || "/");

  const problems = [];
  if (status !== 200) problems.push(`status ${status}`);
  if (!title) problems.push("missing title");
  else if (title.length > 60) problems.push(`title ${title.length}c`);
  else if (title.length < 25) problems.push(`title short ${title.length}c`);
  if (!desc) problems.push("missing description");
  else if (desc.length > 165) problems.push(`desc ${desc.length}c`);
  else if (desc.length < 70) problems.push(`desc short ${desc.length}c`);
  if (!canonical) problems.push("missing canonical");
  else {
    if (!canonical.startsWith("https://" + CANON_HOST)) problems.push(`canonical host: ${canonical}`);
    else {
      const cp = canonical.replace("https://" + CANON_HOST, "").replace(/\/$/, "") || "/";
      const pp = path.replace(/\/$/, "") || "/";
      if (cp !== pp) problems.push(`canonical mismatch -> ${cp}`);
    }
  }
  if (h1s.length !== 1) problems.push(`h1 count ${h1s.length}`);
  if (ldBad) problems.push(`${ldBad} bad JSON-LD`);
  if (!ogImg) problems.push("missing og:image");
  if (robots && /noindex/i.test(robots)) problems.push(`ROBOTS ${robots}`);
  if (words < 300) problems.push(`thin ${words}w`);

  return { path, status, title, desc, canonical, h1: h1s[0] || null, h1s, h2Count, ldTypes, ldBad, ogImg, robots, words, hreflangs, links, problems };
}

async function main() {
  const paths = (await getSitemapUrls()).slice(0, LIMIT);
  console.log(`Auditing ${paths.length} URLs from sitemap against ${BASE}\n`);
  const results = [];
  for (let i = 0; i < paths.length; i += CONC) {
    await Promise.all(paths.slice(i, i + CONC).map(async (p) => {
      try {
        const res = await fetch(BASE + p, { redirect: "manual" });
        if (res.status >= 300 && res.status < 400) { results.push({ path: p, status: res.status, redirect: res.headers.get("location"), problems: [`redirect ${res.status} -> ${res.headers.get("location")}`], links: [], hreflangs: [], ldTypes: [] }); return; }
        results.push(analyze(p, res.status, await res.text()));
      } catch (e) { results.push({ path: p, status: 0, problems: [`fetch error ${e.message}`], links: [], hreflangs: [], ldTypes: [] }); }
    }));
    process.stdout.write(`\r  fetched ${Math.min(i + CONC, paths.length)}/${paths.length}`);
  }
  console.log("\n");

  const byKey = (fn) => { const m = new Map(); for (const r of results) { const k = fn(r); if (!k) continue; if (!m.has(k)) m.set(k, []); m.get(k).push(r.path); } return [...m].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length); };

  console.log("=== DUPLICATE TITLES ===");
  const dt = byKey((r) => r.title);
  dt.slice(0, 15).forEach(([t, ps]) => console.log(`  [${ps.length}x] ${t}\n        ${ps.slice(0, 4).join("  ")}${ps.length > 4 ? "  …" : ""}`));
  console.log(dt.length ? `  (${dt.length} duplicate title groups)\n` : "  none\n");

  console.log("=== DUPLICATE META DESCRIPTIONS ===");
  const dd = byKey((r) => r.desc);
  dd.slice(0, 15).forEach(([t, ps]) => console.log(`  [${ps.length}x] ${String(t).slice(0, 90)}…\n        ${ps.slice(0, 4).join("  ")}${ps.length > 4 ? "  …" : ""}`));
  console.log(dd.length ? `  (${dd.length} duplicate description groups)\n` : "  none\n");

  console.log("=== DUPLICATE H1 ===");
  const dh = byKey((r) => r.h1);
  dh.slice(0, 10).forEach(([t, ps]) => console.log(`  [${ps.length}x] ${t}\n        ${ps.slice(0, 4).join("  ")}${ps.length > 4 ? "  …" : ""}`));
  console.log(dh.length ? `  (${dh.length} duplicate h1 groups)\n` : "  none\n");

  console.log("=== PAGES WITH PROBLEMS ===");
  const bad = results.filter((r) => r.problems.length).sort((a, b) => b.problems.length - a.problems.length);
  bad.slice(0, 45).forEach((r) => console.log(`  ${r.path}\n      ${r.problems.join("; ")}`));
  console.log(`  (${bad.length}/${results.length} pages with at least one problem)\n`);

  console.log("=== PROBLEM FREQUENCY ===");
  const freq = new Map();
  for (const r of results) for (const p of r.problems) { const k = p.replace(/\d+/g, "N").replace(/->.*/, "-> …"); freq.set(k, (freq.get(k) || 0) + 1); }
  [...freq].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

  console.log("\n=== ORPHANS (in sitemap, not linked from any crawled page) ===");
  const linked = new Set(results.flatMap((r) => r.links || []));
  const orphans = results.map((r) => r.path).filter((p) => !linked.has(p.replace(/\/$/, "") || "/"));
  console.log(`  ${orphans.length} orphan(s)`);
  orphans.slice(0, 25).forEach((p) => console.log(`    ${p}`));

  console.log("\n=== INTERNAL LINKS -> NON-SITEMAP TARGETS (top 20) ===");
  const inSitemap = new Set(results.map((r) => r.path.replace(/\/$/, "") || "/"));
  const outCount = new Map();
  for (const r of results) for (const l of r.links || []) if (!inSitemap.has(l)) outCount.set(l, (outCount.get(l) || 0) + 1);
  [...outCount].sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([l, c]) => console.log(`  ${String(c).padStart(4)}x  ${l}`));

  console.log("\n=== SCHEMA TYPE COVERAGE ===");
  const st = new Map();
  for (const r of results) for (const t of r.ldTypes || []) st.set(t, (st.get(t) || 0) + 1);
  [...st].sort((a, b) => b[1] - a[1]).forEach(([t, c]) => console.log(`  ${String(c).padStart(4)}  ${t}`));
  const noLd = results.filter((r) => r.status === 200 && (!r.ldTypes || !r.ldTypes.length));
  console.log(`  pages with NO JSON-LD: ${noLd.length}`);
  noLd.slice(0, 15).forEach((r) => console.log(`    ${r.path}`));

  console.log("\n=== HREFLANG ===");
  const withH = results.filter((r) => r.hreflangs && r.hreflangs.length);
  console.log(`  pages emitting hreflang: ${withH.length}`);
  withH.slice(0, 6).forEach((r) => console.log(`    ${r.path} -> ${r.hreflangs.join(", ")}`));
}

main();
