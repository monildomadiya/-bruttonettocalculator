/**
 * Phase 2 blog work applied through the running app's admin API (the DB is only
 * reachable by the Next process). Idempotent.
 *
 *   BASE_URL=http://localhost:3000 node scripts/apply-phase2-articles.mjs
 *
 *  1. minijob-grenze-2026: append a contextual "Passende Rechner" section with
 *     internal links to the Minijob-, Mindestlohn- and Arbeitgeberrechner
 *     (Task 6) — only if not already present.
 *  2. teilzeit-und-steuerklasse-was-bleibt-vom-brutto: create the article
 *     targeting "lohnt sich teilzeit bei steuerklasse 5" (Task 5). If it already
 *     exists, update it.
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const COOKIE = "admin_session=authenticated_secret_token_2026";
const H = { "Content-Type": "application/json", Cookie: COOKIE };

async function getArticle(slug) {
  const res = await fetch(`${BASE}/api/articles/${slug}`);
  if (!res.ok) return null;
  const j = await res.json().catch(() => ({}));
  return j.success ? j.article : null;
}

/* ---------- Task 6: minijob internal links ---------- */
const MINIJOB_RECHNER_BLOCK = `
<h2>Passende Rechner</h2>
<p>Prüfen Sie Ihren konkreten Fall direkt mit unseren kostenlosen Rechnern: Mit dem <a href="/minijob-rechner">Minijob-Rechner</a> ermitteln Sie Verdienst und zulässige Stunden, der <a href="/mindestlohn">Mindestlohn-Rechner</a> zeigt Brutto und Netto beim gesetzlichen Mindestlohn, und als Arbeitgeber berechnen Sie die Gesamtkosten mit dem <a href="/arbeitgeber-brutto-netto-rechner">Arbeitgeberrechner</a>. Ihr reguläres Nettogehalt bei einer sozialversicherungspflichtigen Stelle berechnen Sie mit dem <a href="/">Brutto-Netto-Rechner</a>.</p>`;

async function fixMinijob() {
  const art = await getArticle("minijob-grenze-2026");
  if (!art) {
    console.log("⏭️  minijob-grenze-2026 not found — skipped.");
    return;
  }
  if ((art.content || "").includes("/minijob-rechner")) {
    console.log("✓ minijob-grenze-2026 already has calculator links — skipped.");
    return;
  }
  const body = {
    ...art,
    content: (art.content || "") + MINIJOB_RECHNER_BLOCK,
    meta_title: "Minijob-Grenze 2026: 603 Euro im Monat",
    headline: "Minijob-Grenze 2026: Alle Beträge und Änderungen",
    faqs: art.faqs,
    status: "Published",
  };
  const res = await fetch(`${BASE}/api/articles/minijob-grenze-2026`, { method: "PUT", headers: H, body: JSON.stringify(body) });
  const j = await res.json().catch(() => ({}));
  console.log(res.ok && j.success ? "✅ minijob-grenze-2026 updated (links + title/H1)." : `❌ minijob update failed: ${j.error || res.status}`);
}

/* ---------- Task 5: create teilzeit article ---------- */
const TEILZEIT_SLUG = "teilzeit-und-steuerklasse-was-bleibt-vom-brutto";
const TEILZEIT = {
  slug: TEILZEIT_SLUG,
  headline: "Teilzeit und Steuerklasse 5: Was bleibt netto?",
  meta_title: "Lohnt sich Teilzeit bei Steuerklasse 5?",
  meta_description:
    "Steuerklasse 5 wirkt teuer – doch die endgültige Steuer entscheidet die Veranlagung. Was bei Teilzeit netto bleibt, mit Beispiel und Steuerklasse-4-mit-Faktor-Vergleich.",
  excerpt:
    "Steuerklasse V führt zu hohen monatlichen Abzügen, ändert aber nicht die Jahressteuer eines Ehepaars. Warum sich Teilzeit trotzdem lohnen kann – verständlich erklärt.",
  focus_keyword: "lohnt sich teilzeit bei steuerklasse 5",
  tags: "Teilzeit,Steuerklasse 5,Steuerklasse 4 mit Faktor,Veranlagung",
  category: "Steuerklassen & Gehalt",
  canonical_url: `https://bruttonettocalculator.com/blog/${TEILZEIT_SLUG}`,
  read_time: "5 min read",
  enable_toc: true,
  status: "Published",
  faqs: [
    {
      question: "Lohnt sich Teilzeit bei Steuerklasse 5?",
      answer:
        "Die Steuerklasse V ändert nicht, wie viel ein Ehepaar am Jahresende insgesamt an Steuern zahlt – sie verlagert die Last nur in den Monat. Ob sich Teilzeit lohnt, entscheiden Stundenlohn, Sozialversicherung und Rentenansprüche, nicht die Steuerklasse. Zu viel gezahlte Lohnsteuer wird über die gemeinsame Veranlagung erstattet.",
    },
    {
      question: "Warum ist das Netto in Steuerklasse 5 so niedrig?",
      answer:
        "In Steuerklasse V werden der Grundfreibetrag und viele Freibeträge nicht berücksichtigt, weil sie beim Partner in Steuerklasse III liegen. Dadurch ist der monatliche Lohnsteuerabzug hoch – das ist gewollt, damit das Paar zusammen ungefähr die richtige Summe vorauszahlt.",
    },
    {
      question: "Ist Steuerklasse 4 mit Faktor besser?",
      answer:
        "Für viele Paare ja: Der Lohnsteuerabzug wird dann gerechter auf beide verteilt und die monatliche Belastung ist realistischer. Die Jahressteuer bleibt gleich, aber sehr hohe Nachzahlungen oder große Erstattungen werden seltener.",
    },
    {
      question: "Muss ich bei Steuerklasse 5 eine Steuererklärung abgeben?",
      answer:
        "Ja. Bei der Kombination III/V besteht Pflicht zur Einkommensteuererklärung. Dort wird die tatsächliche Jahressteuer ermittelt und zu viel gezahlte Lohnsteuer erstattet – oder eine Nachzahlung fällig.",
    },
    {
      question: "Wie berechne ich mein Netto in Teilzeit?",
      answer:
        "Nutzen Sie den Teilzeitrechner oder den Brutto-Netto-Rechner: Geben Sie Ihr Teilzeit-Bruttogehalt und Ihre Steuerklasse ein. Für den Vergleich der Kombinationen hilft die Steuerklassen-Übersicht.",
    },
  ],
  content: `
<p><strong>Kurz erklärt:</strong> Ob sich Teilzeit in <strong>Steuerklasse V</strong> lohnt, hängt fast nie an der Steuerklasse selbst. Steuerklasse V sorgt zwar für hohe monatliche Lohnsteuerabzüge, doch die endgültige Steuer eines Ehepaars wird erst über die gemeinsame Veranlagung (Steuererklärung) festgelegt. Unterm Strich zahlt ein Paar mit der Kombination III/V dieselbe Jahressteuer wie mit IV/IV – nur die monatliche Verteilung ist anders. Ihr konkretes Netto berechnen Sie mit dem <a href="/">Brutto-Netto-Rechner</a>.</p>

<h2>Warum wirkt Steuerklasse 5 so teuer?</h2>
<p>In der Kombination III/V bündelt ein Partner in <strong>Steuerklasse III</strong> die Freibeträge des Paares – vor allem den doppelten Grundfreibetrag. Der Partner in <strong>Steuerklasse V</strong> erhält diese Freibeträge im Lohnsteuerabzug nicht. Deshalb wird dort ab dem ersten Euro vergleichsweise viel Lohnsteuer einbehalten, und das monatliche Netto fällt niedrig aus. Das betrifft besonders Teilzeitkräfte, weil ihr ohnehin niedrigeres Bruttogehalt anteilig stark belastet wirkt.</p>

<h2>Monatliche Lohnsteuer vs. endgültige Jahressteuer</h2>
<p>Der entscheidende Punkt: Die Steuerklasse bestimmt nur die <strong>monatliche Vorauszahlung</strong> (den Lohnsteuerabzug), nicht die endgültige Steuer. Ehepaare werden zusammen veranlagt. Bei der Einkommensteuererklärung wird die tatsächliche Jahressteuer nach dem Splittingtarif berechnet und mit den bereits gezahlten Lohnsteuern verrechnet. War der monatliche Abzug in Steuerklasse V zu hoch, gibt es eine <strong>Erstattung</strong>. Die Steuerklasse verschiebt also vor allem die Liquidität über das Jahr – nicht die Höhe der Steuer.</p>

<h2>Beispiel: Teilzeit in Steuerklasse 5</h2>
<p>Ein einfaches Bild: Verdient die Teilzeitkraft in Steuerklasse V etwa 1.500 € brutto im Monat, wird darauf spürbar mehr Lohnsteuer einbehalten als in Steuerklasse IV – oft ein dreistelliger Betrag pro Monat. Dieselbe Person käme in Steuerklasse IV auf ein höheres monatliches Netto, müsste dafür aber im Gegenzug beim besserverdienenden Partner (dann ebenfalls IV) mehr Abzug hinnehmen. Am Jahresende gleicht die Veranlagung beide Varianten aus. Die genauen Netto-Beträge für Ihr Gehalt und jede Steuerklasse berechnen Sie im <a href="/teilzeitrechner">Teilzeitrechner</a> oder im <a href="/">Brutto-Netto-Rechner</a>.</p>

<h2>Steuerklasse 4 mit Faktor als Alternative</h2>
<p>Wer die hohen monatlichen Abzüge in Steuerklasse V vermeiden möchte, kann die Kombination <strong>IV/IV mit Faktor</strong> wählen. Dabei berücksichtigt das Finanzamt das voraussichtliche Verhältnis der Einkommen und verteilt den Lohnsteuerabzug fairer auf beide Partner. Ergebnis: Das monatliche Netto beider ist realistischer, und die Steuererklärung führt seltener zu großen Nachzahlungen oder Erstattungen. Die Jahressteuer bleibt gleich. Einen Vergleich der Kombinationen bietet die <a href="/steuerklassen">Steuerklassen-Übersicht</a>; den Wechsel prüfen Sie mit dem <a href="/steuerklassenwechsel-rechner">Steuerklassenwechsel-Rechner</a>.</p>

<h2>Wann sich Teilzeit wirklich lohnt</h2>
<p>Ob sich Teilzeit lohnt, entscheiden nicht die Steuerklasse, sondern reale Faktoren:</p>
<ul>
  <li><strong>Stundenlohn und Arbeitszeit:</strong> Wie viel Brutto bleibt pro Stunde? Das zeigt der <a href="/stundenlohn-rechner">Stundenlohnrechner</a>.</li>
  <li><strong>Sozialversicherung:</strong> Teilzeit oberhalb der Minijob-Grenze bleibt voll versichert – wichtig für Kranken- und Rentenversicherung.</li>
  <li><strong>Rentenansprüche:</strong> Weniger Bruttoentgelt bedeutet weniger Rentenpunkte.</li>
  <li><strong>Familienzeit und Vereinbarkeit:</strong> Der eigentliche Grund für Teilzeit ist meist nicht steuerlich, sondern persönlich.</li>
</ul>

<h2>Fazit</h2>
<p>Steuerklasse V lässt Teilzeit auf den ersten Blick unattraktiv wirken, weil monatlich viel Lohnsteuer abgeht. Die endgültige Steuerlast eines Ehepaars ändert sich dadurch aber nicht – sie wird über die gemeinsame Veranlagung ausgeglichen. Wer die monatliche Belastung fairer verteilen will, prüft Steuerklasse IV mit Faktor. Ob sich Teilzeit lohnt, hängt letztlich an Stundenlohn, Sozialversicherung und persönlicher Situation. Rechnen Sie Ihren Fall mit dem <a href="/">Brutto-Netto-Rechner</a> durch. Dieser Ratgeber ersetzt keine Steuerberatung.</p>
`.trim(),
};

async function createOrUpdateTeilzeit() {
  const existing = await getArticle(TEILZEIT_SLUG);
  if (existing) {
    const res = await fetch(`${BASE}/api/articles/${TEILZEIT_SLUG}`, { method: "PUT", headers: H, body: JSON.stringify({ ...existing, ...TEILZEIT }) });
    const j = await res.json().catch(() => ({}));
    console.log(res.ok && j.success ? "✅ teilzeit article updated." : `❌ teilzeit update failed: ${j.error || res.status}`);
  } else {
    const res = await fetch(`${BASE}/api/articles`, { method: "POST", headers: H, body: JSON.stringify(TEILZEIT) });
    const j = await res.json().catch(() => ({}));
    console.log(res.ok && j.success ? "✅ teilzeit article created." : `❌ teilzeit create failed: ${j.error || res.status}`);
  }
}

async function main() {
  await fixMinijob();
  await createOrUpdateTeilzeit();
}

main().catch((e) => {
  console.error("❌ apply-phase2-articles failed:", e.message);
  process.exitCode = 1;
});
