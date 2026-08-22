#!/usr/bin/env node
/**
 * keyword-discovery.mjs — automatisierte Keyword-Recherche für den Ratgeber.
 *
 * Warum es das gibt: Die Blog-Themen sollen nicht geraten, sondern aus echten
 * Suchanfragen abgeleitet werden. Google Autocomplete liefert genau das —
 * reale, von Nutzern getippte Queries, kostenlos und ohne API-Kontingent
 * (Semrush-Units sind endlich, Autocomplete nicht).
 *
 * Pipeline:
 *   1. Seeds  → Themen, zu denen die Seite Autorität hat (Lohn/Steuer/SV).
 *   2. Expand → jeder Seed × {a–z, Fragewörter, Modifier} gegen Google Suggest.
 *   3. Depth-2 → die besten Treffer werden erneut expandiert.
 *   4. Filter → Queries, die eine bestehende Route schon bedient, fliegen raus
 *      (Kannibalisierung vermeiden — die Rechner-Seiten sollen ranken).
 *   5. Klassifikation → transaktional (= Rechner-Seite) vs. informational
 *      (= Ratgeber-Artikel). Nur informational ist Blog-Material.
 *   6. Clustering → Queries mit gleichem Kern werden zu EINEM Artikel-Thema
 *      gebündelt, damit nicht 20 dünne Seiten zum selben Thema entstehen.
 *
 * Nutzung:
 *   node scripts/keyword-discovery.mjs                # volle Recherche
 *   node scripts/keyword-discovery.mjs --depth 1      # schneller Lauf
 *   node scripts/keyword-discovery.mjs --out foo.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/* ─────────────────────────── Konfiguration ─────────────────────────── */

/** Themen, zu denen die Domain fachlich Autorität besitzt. */
const SEEDS = [
  "brutto netto",
  "netto gehalt",
  "lohnsteuer",
  "steuerklasse",
  "steuerklasse wechseln",
  "sozialabgaben",
  "krankenkasse beitrag",
  "rentenversicherung beitrag",
  "gehalt verhandeln",
  "gehaltserhöhung",
  "minijob",
  "midijob",
  "werkstudent",
  "teilzeit gehalt",
  "abfindung steuer",
  "weihnachtsgeld",
  "urlaubsgeld",
  "bonus versteuern",
  "firmenwagen versteuern",
  "betriebliche altersvorsorge",
  "steuererklärung",
  "steuerrückerstattung",
  "werbungskosten",
  "pendlerpauschale",
  "homeoffice pauschale",
  "kinderfreibetrag",
  "elterngeld",
  "kurzarbeitergeld",
  "arbeitslosengeld",
  "krankengeld",
  "mindestlohn",
  "tvöd",
  "beamte besoldung",
  "rente netto",
  "witwenrente",
  "nebenjob steuer",
  "zweitjob",
  "freibetrag lohnsteuer",
  "geldwerter vorteil",
  "vermögenswirksame leistungen",
  "kirchensteuer",
  "solidaritätszuschlag",
  "brutto netto 2027",
  "gehaltsabrechnung verstehen",
  "lohnabrechnung",
];

/** Fragewörter — starke Indikatoren für informationale (= Blog-)Intention. */
const QUESTION_PREFIXES = [
  "wie", "wie viel", "wie hoch", "wie berechnet man", "was", "was ist",
  "was bedeutet", "wann", "warum", "wer", "welche", "welcher", "wo",
  "lohnt sich", "muss ich", "kann ich", "darf ich", "wie lange",
];

/** Modifier, die typischerweise Longtail mit klarer Absicht erzeugen. */
const MODIFIERS = [
  "2026", "2027", "beispiel", "tabelle", "höhe", "berechnen", "unterschied",
  "trotz", "ohne", "bei", "für", "vs", "oder", "abzüge", "netto",
];

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * Routen, die es schon gibt. Eine Query, die exakt dahin gehört, wird NICHT
 * zum Blogartikel — sonst konkurriert der Ratgeber mit der eigenen Geldseite.
 */
function existingRouteTokens() {
  const appDir = path.join(ROOT, "app");
  const tokens = new Set();
  const walk = (dir, depth = 0) => {
    if (depth > 2) return;
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith("_") || e.name.startsWith("[") || e.name === "api") continue;
      if (["admin-secure", "node_modules"].includes(e.name)) continue;
      tokens.add(e.name.replace(/-/g, " ").toLowerCase());
      walk(path.join(dir, e.name), depth + 1);
    }
  };
  walk(appDir);
  return [...tokens];
}

/* ─────────────────────────── Google Suggest ─────────────────────────── */

const SUGGEST_ENDPOINT = "https://suggestqueries.google.com/complete/search";
const seen = new Set();
let requestCount = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function suggest(query) {
  const url = `${SUGGEST_ENDPOINT}?client=firefox&hl=de&gl=de&q=${encodeURIComponent(query)}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          // Ohne UA antwortet der Endpoint gelegentlich mit 403.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          "Accept-Language": "de-DE,de;q=0.9",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      requestCount++;
      return Array.isArray(json?.[1]) ? json[1] : [];
    } catch {
      await sleep(400 * (attempt + 1));
    }
  }
  return [];
}

/** Führt viele Suggest-Aufrufe mit begrenzter Parallelität aus. */
async function suggestMany(queries, concurrency = 6) {
  const out = new Set();
  const queue = [...new Set(queries)];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const q = queue.shift();
      if (!q || seen.has(q)) continue;
      seen.add(q);
      const results = await suggest(q);
      for (const r of results) out.add(r.toLowerCase().trim());
      await sleep(60); // höflich bleiben
    }
  });
  await Promise.all(workers);
  return [...out];
}

/* ─────────────────────────── Klassifikation ─────────────────────────── */

/** Transaktional = der Nutzer will rechnen, nicht lesen → gehört auf eine Tool-Seite. */
const TRANSACTIONAL_MARKERS = [
  "rechner", "calculator", "rechnen online", "tool", "app",
];

/** Klare Ausschlüsse — anderes Land / anderes Steuerrecht / irrelevant. */
const EXCLUDE_MARKERS = [
  "österreich", "osterreich", "schweiz", "luxemburg", "südtirol", "suedtirol",
  "ak ", " ak", "wko", "arbeiterkammer", "chf", "brutto netto rechner ak",
  "2020", "2021", "2022", "2023", "2024",
];

function classify(query) {
  const q = query.toLowerCase();

  if (EXCLUDE_MARKERS.some((m) => q.includes(m))) return "excluded";

  // Reine Betragsabfragen ("3000 brutto netto") bedient bereits die
  // programmatische /rechner/<betrag>-euro-brutto-netto-Strecke.
  if (/^\d[\d.,]*\s*(€|euro)?\s*(brutto|netto)/.test(q)) return "programmatic";

  if (TRANSACTIONAL_MARKERS.some((m) => q.includes(m))) return "transactional";

  const isQuestion =
    QUESTION_PREFIXES.some((p) => q.startsWith(p + " ")) ||
    /^(wie|was|wann|warum|wer|welche|wo|lohnt|muss|kann|darf)\b/.test(q);

  if (isQuestion) return "informational";

  // Vergleichs- und Erklär-Muster sind ebenfalls Lesestoff.
  if (/\b(unterschied|vs|oder|vergleich|erklärt|bedeutet|vorteile|nachteile|tipps|fehler|checkliste)\b/.test(q)) {
    return "informational";
  }

  return "ambiguous";
}

/**
 * Grober Wert-Score. Kein Suchvolumen (das kostet API-Units), aber gute
 * Heuristiken: Autocomplete-Rang, Longtail-Länge, Jahresbezug, Geldnähe.
 */
function scoreQuery(query, rank) {
  let score = 100 - Math.min(rank, 50);
  const q = query.toLowerCase();
  const words = q.split(/\s+/).length;

  if (words >= 4 && words <= 9) score += 25; // Longtail-Sweetspot
  if (words > 10) score -= 20;
  if (q.includes("2026")) score += 18;
  if (q.includes("2027")) score += 22; // Reformjahr, wenig Wettbewerb
  if (/\b(netto|brutto|abzüge|steuer|beitrag)\b/.test(q)) score += 12;
  if (/\b(lohnt sich|unterschied|wie viel|wie hoch|was bleibt)\b/.test(q)) score += 15;
  if (/\b(muster|vorlage|formular|pdf)\b/.test(q)) score -= 15;
  return score;
}

/** Bündelt Queries mit gleichem semantischem Kern zu einem Artikel-Thema. */
const STOPWORDS = new Set([
  "wie", "viel", "hoch", "was", "ist", "wann", "warum", "wer", "welche",
  "welcher", "wo", "der", "die", "das", "den", "dem", "ein", "eine", "einen",
  "bei", "in", "im", "von", "vom", "zu", "zum", "für", "fur", "und", "oder",
  "man", "ich", "sich", "es", "mit", "auf", "berechnet", "berechnen", "lohnt",
  "muss", "kann", "darf", "mehr", "man's", "als", "am", "an",
]);

function clusterKey(query) {
  const core = query
    .toLowerCase()
    .replace(/[^\wäöüß\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w) && !/^\d+$/.test(w))
    .sort()
    .slice(0, 3)
    .join("-");
  return core || query;
}

/* ─────────────────────────────── Main ─────────────────────────────── */

async function main() {
  const args = process.argv.slice(2);
  const depth = Number(args[args.indexOf("--depth") + 1]) || 2;
  const outArg = args.indexOf("--out");
  const outFile = outArg !== -1 ? args[outArg + 1] : path.join(ROOT, "data", "keyword-research.json");

  console.log(`🔎 Keyword-Recherche — ${SEEDS.length} Seeds, Tiefe ${depth}\n`);

  // ── Runde 1: Seeds × Prefixe/Modifier/Alphabet ────────────────────
  const round1Queries = [];
  for (const seed of SEEDS) {
    round1Queries.push(seed);
    for (const p of QUESTION_PREFIXES) round1Queries.push(`${p} ${seed}`);
    for (const m of MODIFIERS) round1Queries.push(`${seed} ${m}`);
    for (const l of ALPHABET) round1Queries.push(`${seed} ${l}`);
  }

  console.log(`⏳ Runde 1: ${round1Queries.length} Suggest-Abfragen …`);
  let harvested = await suggestMany(round1Queries);
  console.log(`   → ${harvested.length} eindeutige Queries\n`);

  // ── Runde 2: die besten Treffer erneut expandieren ────────────────
  if (depth >= 2) {
    const promising = harvested
      .filter((q) => classify(q) === "informational" || classify(q) === "ambiguous")
      .map((q, i) => ({ q, s: scoreQuery(q, i) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 150)
      .map((x) => x.q);

    console.log(`⏳ Runde 2: ${promising.length} Top-Queries erneut expandieren …`);
    const round2 = await suggestMany(promising);
    harvested = [...new Set([...harvested, ...round2])];
    console.log(`   → ${harvested.length} Queries gesamt\n`);
  }

  // ── Filtern, klassifizieren, scoren ───────────────────────────────
  const routeTokens = existingRouteTokens();

  const rows = harvested
    .map((q, i) => ({
      query: q,
      intent: classify(q),
      score: scoreQuery(q, i),
      cluster: clusterKey(q),
      coveredByRoute: routeTokens.some((t) => t.length > 6 && q.includes(t)),
    }))
    .filter((r) => r.intent !== "excluded" && r.intent !== "programmatic");

  const blogCandidates = rows
    .filter((r) => r.intent === "informational")
    .sort((a, b) => b.score - a.score);

  // ── Zu Artikel-Themen clustern ────────────────────────────────────
  const clusters = new Map();
  for (const r of blogCandidates) {
    if (!clusters.has(r.cluster)) {
      clusters.set(r.cluster, { cluster: r.cluster, score: 0, queries: [], coveredByRoute: r.coveredByRoute });
    }
    const c = clusters.get(r.cluster);
    c.queries.push(r.query);
    c.score += r.score;
  }

  const topics = [...clusters.values()]
    .map((c) => ({
      ...c,
      // Die kürzeste Query eines Clusters ist meist der Head-Term.
      head: [...c.queries].sort((a, b) => a.length - b.length)[0],
      queryCount: c.queries.length,
      // Cluster mit vielen Varianten = breites Suchinteresse = besserer Artikel.
      weightedScore: Math.round(c.score / c.queries.length + c.queries.length * 12),
    }))
    .filter((c) => c.queryCount >= 2)
    .sort((a, b) => b.weightedScore - a.weightedScore);

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "Google Autocomplete (hl=de, gl=de)",
    suggestRequests: requestCount,
    totals: {
      harvested: harvested.length,
      informational: blogCandidates.length,
      transactional: rows.filter((r) => r.intent === "transactional").length,
      topics: topics.length,
    },
    topics: topics.slice(0, 120),
    allInformational: blogCandidates.slice(0, 600).map((r) => r.query),
  };

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf8");

  console.log(`✅ ${requestCount} Suggest-Requests · ${harvested.length} Queries · ${topics.length} Themen-Cluster`);
  console.log(`📄 ${path.relative(ROOT, outFile)}\n`);
  console.log("── Top 40 Artikel-Themen ──────────────────────────────");
  for (const [i, t] of topics.slice(0, 40).entries()) {
    console.log(
      `${String(i + 1).padStart(2)}. [${String(t.weightedScore).padStart(3)}] ${t.head}` +
        `  (${t.queryCount} Varianten${t.coveredByRoute ? ", Route existiert" : ""})`
    );
  }
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
