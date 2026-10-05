/**
 * Prüft nach `next build`, ob Titel, Meta-Descriptions oder H1 auf mehreren
 * Seiten identisch sind (SEO-Roadmap 2027, Phase 6).
 *
 * Liest das vorgerenderte HTML unter .next/server/app/**\/*.html — also genau
 * das, was Google bekommt. Seiten, die Next erst bei Bedarf rendert, fehlen
 * darin; für die Betragsseiten sind alle Whitelist-Beträge vorgerendert.
 *
 * AUSFÜHREN:  npm run build && npm run check:seo
 * Exit-Code 1 bei Duplikaten.
 *
 * Bewusst NICHT Teil von `npm run build`: Der Deploy auf dem Server ruft
 * `next build` auf. Ein Abbruch dort käme nach dem Überschreiben von .next und
 * vor dem pm2-Neustart — das wäre schlimmer als ein doppelter Titel.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, ".next", "server", "app");

// Nicht indexierbare oder interne Seiten
const IGNORE = [/^\/admin/, /^\/_not-found/, /^\/embed/, /^\/404/, /^\/500/];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

if (!fs.existsSync(APP)) {
  console.error("Kein Build gefunden (.next/server/app). Erst `npm run build` ausführen.");
  process.exit(2);
}

const seiten = [];
for (const file of walk(APP)) {
  let route = "/" + path.relative(APP, file).replace(/\\/g, "/").replace(/\.html$/, "");
  if (route === "/index") route = "/";
  if (IGNORE.some((r) => r.test(route))) continue;
  const html = fs.readFileSync(file, "utf8");
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue;
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "");
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1]));
  seiten.push({ route, title, description, h1: h1s[0] ?? "", h1Anzahl: h1s.length });
}

let fehler = 0;
function pruefe(feld) {
  const map = new Map();
  for (const s of seiten) {
    const v = s[feld];
    if (!v) continue;
    if (!map.has(v)) map.set(v, []);
    map.get(v).push(s.route);
  }
  for (const [v, routes] of map) {
    if (routes.length > 1) {
      fehler++;
      console.log(`✗ Doppelter ${feld} (${routes.length}×): "${v.slice(0, 90)}"`);
      for (const r of routes.slice(0, 8)) console.log(`    ${r}`);
    }
  }
}
pruefe("title");
pruefe("description");
pruefe("h1");

const ohneTitel = seiten.filter((s) => !s.title).map((s) => s.route);
const ohneH1 = seiten.filter((s) => s.h1Anzahl === 0).map((s) => s.route);
const mehrH1 = seiten.filter((s) => s.h1Anzahl > 1).map((s) => s.route);
if (ohneTitel.length) { fehler++; console.log(`✗ Ohne <title>: ${ohneTitel.join(", ")}`); }
if (ohneH1.length) console.log(`! Ohne <h1> (${ohneH1.length}): ${ohneH1.slice(0, 10).join(", ")}`);
if (mehrH1.length) console.log(`! Mehr als eine <h1> (${mehrH1.length}): ${mehrH1.slice(0, 10).join(", ")}`);

console.log(`\n${seiten.length} Seiten geprüft, ${fehler} Problem(e).`);
process.exit(fehler ? 1 : 0);
