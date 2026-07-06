import mysql from "mysql2/promise";

// Global type for connection pool caching in Next.js development
declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

export interface Article {
  id?: number;
  headline: string;
  slug: string;
  category?: string;
  tags?: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  featured_image?: string;
  featured_image_alt?: string;
  featured_image_caption?: string;
  enable_toc?: boolean;
  content?: string;
  faqs?: string | any; // JSON string or parsed array
  og_title?: string;
  og_description?: string;
  og_image?: string;
  status?: string;
  read_time?: string;
  created_at?: string;
  updated_at?: string;
}

// Create MySQL connection pool
function getPool(): mysql.Pool {
  if (global._mysqlPool) {
    return global._mysqlPool;
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "darshan",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "Darshan@2000-",
    database: process.env.DB_NAME || "bruttonetto_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  if (process.env.NODE_ENV !== "production") {
    global._mysqlPool = pool;
  }

  return pool;
}

// In-memory fallback store if local MySQL server is offline during development/testing
let fallbackArticles: Article[] = [
  {
    id: 1,
    headline: "Das neue Steuerjahr 2026/2027: Was Arbeitnehmer jetzt wissen müssen",
    slug: "steuern-grundfreibetrag-2026-2027-uebersicht",
    category: "Steuerrecht",
    tags: "Steuern, Grundfreibetrag, Lohnsteuer, 2026",
    excerpt: "Alles über die neuen Tarifzonen, den angehobenen Grundfreibetrag und wie Sie auf Ihrem Gehaltszettel das Maximum an Netto herausholen.",
    meta_title: "Steuerjahr 2026/2027: Alle Änderungen für Arbeitnehmer",
    meta_description: "Erfahren Sie, wie sich die Steueränderungen 2026 und 2027 auf Ihr Nettogehalt auswirken. Inklusive amtlicher Berechnungen.",
    focus_keyword: "Grundfreibetrag 2026",
    canonical_url: "https://bruttonettocalculator.com/blog/steuern-grundfreibetrag-2026-2027-uebersicht",
    featured_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Taschenrechner und Steuerunterlagen auf einem Schreibtisch",
    featured_image_caption: "Offizielle Änderungen nach § 32a EStG für 2026 und 2027",
    enable_toc: true,
    content: `<h2>Der neue Grundfreibetrag 2026</h2>
<p>Im Jahr 2026 steigt der amtliche Grundfreibetrag für Alleinstehende auf genau <strong>12.348 Euro</strong>. Für zusammen veranlagte Ehepaare verdoppelt sich dieser Wert auf <strong>24.696 Euro</strong>. Das bedeutet: Bis zu dieser Grenze bleibt Ihr Einkommen komplett steuerfrei!</p>
<h3>Was ändert sich bei den Sozialabgaben?</h3>
<p>Neben der Lohnsteuer wurden auch die Beitragsbemessungsgrenzen (BBG) angepasst. In der Kranken- und Pflegeversicherung liegt die BBG für 2026 bundesweit einheitlich bei <strong>69.750 Euro</strong> jährlich (5.812,50 Euro im Monat).</p>
<blockquote>Tipp: Nutzen Sie unseren präzisen Brutto-Netto-Rechner, um Ihr exaktes Nettogehalt auf den Cent genau zu ermitteln.</blockquote>
<h2>Vorschau auf das Jahr 2027</h2>
<p>Auch für 2027 sind weitere Entlastungen geplant, um der kalten Progression entgegenzuwirken. Sobald die endgültigen Gesetzesentwürfe verabschiedet sind, fließen diese sofort in unsere amtlichen Rechenkerne ein.</p>`,
    faqs: JSON.stringify([
      { question: "Wie hoch ist der Grundfreibetrag 2026?", answer: "Der Grundfreibetrag beträgt 12.348 Euro für Ledige und 24.696 Euro für Verheiratete." },
      { question: "Muss ich für die Steueränderungen einen neuen Antrag stellen?", answer: "Nein, Arbeitgeber berücksichtigen die neuen Lohnsteuertabellen automatisch bei der Gehaltsabrechnung." }
    ]),
    status: "Published",
    read_time: "3 min read",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    headline: "Steuerklassenwechsel 2026: Wann lohnt es sich für Ehepaare?",
    slug: "steuerklassenwechsel-ehepaare-2026-lohnsteuer",
    category: "Lohnsteuer & Familie",
    tags: "Steuerklassen, Ehepaare, Lohnsteuer, Steuerklasse III, Steuerklasse V, Faktorverfahren, 2026",
    excerpt: "Ein Wechsel der Steuerklasse kann das monatliche Nettogehalt von Ehepaaren spürbar beeinflussen. Wir erklären den Unterschied zwischen III/V und IV/IV mit Faktor sowie die geplante Reform.",
    meta_title: "Steuerklassenwechsel 2026 für Ehepaare: III/V vs. IV/IV",
    meta_description: "Lohnt sich der Wechsel der Steuerklasse für Ehepaare? Alles zu III/V, IV/IV mit Faktorverfahren, der geplanten Steuerreform und Nachzahlungen.",
    focus_keyword: "Steuerklassenwechsel Ehepaare 2026",
    canonical_url: "https://bruttonettocalculator.com/blog/steuerklassenwechsel-ehepaare-2026-lohnsteuer",
    featured_image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Ehepaar prüft gemeinsam Lohnsteuer und Gehaltsabrechnung",
    featured_image_caption: "Die Wahl der Steuerklassen entscheidet über die monatliche Liquidität von Ehepaaren",
    enable_toc: true,
    content: `<h2>Warum ist die Wahl der Steuerklasse für Ehepaare so entscheidend?</h2>
<p>Nach der Eheschließung werden Ehepaare in Deutschland vom Finanzamt automatisch in die <strong>Steuerklassenkombination IV/IV</strong> eingestuft. Diese Einstufung ist ideal, wenn beide Ehepartner ein annähernd gleiches Bruttogehalt beziehen. Sobald die Einkommen jedoch stärker voneinander abweichen, stellen sich viele Paare die Frage: Lohnt sich ein Steuerklassenwechsel in die Kombination <strong>III/V</strong> oder das moderne <strong>Faktorverfahren (IV/IV mit Faktor)</strong>?</p>
<p>Wichtig ist vorab ein grundlegendes Prinzip des deutschen Steuerrechts: Die Wahl der Lohnsteuerklasse beeinflusst <em>ausschließlich die monatliche Lohnsteuer-Vorauszahlung</em>, nicht aber die tatsächliche Jahressteuerlast. Am Ende des Steuerjahres führt die Pflicht zur Abgabe einer Einkommensteuererklärung über das sogenannte Ehegatten-Splitting immer zur exakt gleichen Jahressteuerschuld. Ein Wechsel optimiert daher in erster Linie Ihre monatliche Liquidität.</p>

<h2>Die traditionelle Kombination: Steuerklasse III und V</h2>
<p>Die Kombination III/V lohnt sich monatlich dann, wenn ein Ehepartner deutlich mehr verdient als der andere (als Faustregel gilt: ein Verhältnis von mindestens 60:40 des gemeinsamen Familieneinkommens). Der Besserverdiener wählt Steuerklasse III, in der sowohl der eigene Grundfreibetrag (12.348 € für 2026) als auch der Grundfreibetrag des Partners abgebildet wird. Der geringer verdienende Partner erhält Steuerklasse V, in der ab dem ersten Euro Lohnsteuer ohne Grundfreibetrag einbehalten wird.</p>
<ul>
  <li><strong>Vorteil:</strong> Das monatliche gemeinsame Nettogehalt fällt höher aus, weil die Freibeträge beim Hauptverdiener sofort greifen.</li>
  <li><strong>Nachteil:</strong> Der Partner in Steuerklasse V hat unverhältnismäßig hohe monatliche Abzüge, was oft als ungerecht empfunden wird und finanzielle Fehlanreize für Mehrarbeit schaffen kann. Zudem besteht nach Ablauf des Jahres eine strikte <strong>Pflicht zur Abgabe einer Einkommensteuererklärung</strong>, da es durch die Systematik häufig zu Steuernachzahlungen kommt.</li>
</ul>
<blockquote>Tipp: Testen Sie verschiedene Gehaltskonstellationen direkt in unserem <a href="/rechner/brutto-zu-netto" className="text-[#E60A1C] font-semibold hover:underline">Brutto Netto Rechner 2026</a>, um die monatliche Differenz für Ihren Haushalt exakt zu berechnen.</blockquote>

<h2>Die faire Alternative: Steuerklasse IV/IV mit Faktorverfahren</h2>
<p>Um die Nachteile der Kombination III/V zu vermeiden, hat der Gesetzgeber das <strong>Faktorverfahren</strong> eingeführt. Hierbei bleiben beide Partner in Steuerklasse IV, das Finanzamt berechnet jedoch auf Basis der voraussichtlichen Jahresbruttoeinkommen einen individuellen Multiplikator (den Faktor, z. B. 0,928).</p>
<p>Durch diesen Faktor wird die Lohnsteuer beim jeweiligen Partner genau entsprechend seinem Anteil am gemeinsamen Einkommen gedämpft. Das Ergebnis: Beide Partner erhalten den ihnen zustehenden Grundfreibetrag, das monatliche Netto wird fair aufgeteilt, und am Jahresende kommt es so gut wie nie zu bösen Überraschungen oder Nachzahlungen.</p>

<h3>Vergleich der Modelle für ein Ehepaar (Besserverdiener: 4.500 € Brutto, Partner: 2.000 € Brutto)</h3>
<div className="overflow-x-auto my-6">
  <table className="w-full text-left border-collapse border border-white/20 text-sm">
    <thead>
      <tr className="bg-white/10 text-white font-bold">
        <th className="p-3 border border-white/20">Modell</th>
        <th className="p-3 border border-white/20">Netto Partner 1 (4.500 €)</th>
        <th className="p-3 border border-white/20">Netto Partner 2 (2.000 €)</th>
        <th className="p-3 border border-white/20">Familien-Netto / Monat</th>
        <th className="p-3 border border-white/20">Steuernachzahlung?</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-white/10">
        <td className="p-3 border border-white/20 font-semibold">Kombination IV / IV</td>
        <td className="p-3 border border-white/20">ca. 2.890 €</td>
        <td className="p-3 border border-white/20">ca. 1.450 €</td>
        <td className="p-3 border border-white/20 font-bold text-white">4.340 €</td>
        <td className="p-3 border border-white/20 text-emerald-400">Selten / Eher Erstattung</td>
      </tr>
      <tr className="border-b border-white/10 bg-white/[0.02]">
        <td className="p-3 border border-white/20 font-semibold">Kombination III / V</td>
        <td className="p-3 border border-white/20 text-emerald-400">ca. 3.250 €</td>
        <td className="p-3 border border-white/20 text-rose-400">ca. 1.180 €</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">4.430 €</td>
        <td className="p-3 border border-white/20 text-rose-400">Höheres Risiko für Nachzahlung</td>
      </tr>
      <tr>
        <td className="p-3 border border-white/20 font-semibold">IV / IV mit Faktor</td>
        <td className="p-3 border border-white/20">ca. 3.080 €</td>
        <td className="p-3 border border-white/20">ca. 1.350 €</td>
        <td className="p-3 border border-white/20 font-bold text-white">4.430 €</td>
        <td className="p-3 border border-white/20 text-emerald-400">Weitgehend punktgenau</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Die geplante Reform: Abschaffung der Steuerklassen III und V</h2>
<p>Im Rahmen der Wachstumsinitiative der Bundesregierung wird seit längerem die vollständige <strong>Abschaffung der Steuerklassenkombination III und V</strong> diskutiert. Ziel dieser Reform ist es, Erwerbsanreize für den Zweitverdiener (häufig Frauen) zu verbessern. Künftig sollen Ehepaare standardmäßig in das Faktorverfahren überführt werden. Für Ihr monatliches Bruttogehalt – sei es bei einer <a href="/rechner/4000-euro-brutto-netto" className="text-[#E60A1C] font-semibold hover:underline">4.000 € Brutto-Netto-Rechnung</a> oder höheren Gehältern – bedeutet das eine gerechtere Aufteilung der monatlichen Lasten direkt bei der Gehaltsauszahlung.</p>

<h2>Einfluss der Steuerklasse auf Lohnersatzleistungen</h2>
<p>Ein oft übersehener Aspekt bei der Wahl der Steuerklasse ist die Berechnung von amtlichen Lohnersatzleistungen wie <strong>Elterngeld, Arbeitslosengeld I, Krankengeld oder Mutterschaftsgeld</strong>. Diese Leistungen berechnen sich nach dem durchschnittlichen Nettoeinkommen der letzten 12 Monate vor dem Ereignis. Wer also eine Familie plant, kann durch einen rechtzeitigen Wechsel des hauptbetreuenden Elternteils in die Steuerklasse III das maßgebliche Nettoeinkommen anheben und somit später ein deutlich höheres Elterngeld erhalten!</p>

<h2>Fazit und Handlungsempfehlung</h2>
<p>Ein Steuerklassenwechsel lohnt sich immer dann, wenn Sie monatlich mehr Liquidität benötigen oder gezielt Lohnersatzleistungen optimieren wollen. Prüfen Sie mit unserem <a href="/rechner/brutto-zu-netto" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</a> regelmäßig, ob Ihre aktuelle Steuerklasse noch zu Ihrer Lebenssituation im Steuerjahr 2026 passt. Den Wechsel können Sie heute unkompliziert elektronisch über das Elster-Portal des Finanzamts beantragen.</p>`,
    faqs: JSON.stringify([
      { question: "Wann lohnt sich Steuerklasse 3 und 5 für Ehepaare?", answer: "Die Kombination III/V lohnt sich monatlich, wenn ein Partner mindestens 60 % des gemeinsamen Familieneinkommens erzielt. Der Besserverdiener hat in Klasse III deutlich weniger Lohnsteuerabzüge." },
      { question: "Was ist das Faktorverfahren bei Steuerklasse 4?", answer: "Beim Faktorverfahren (IV/IV mit Faktor) wendet das Finanzamt einen individuellen Multiplikator auf die Lohnsteuer an, sodass beide Partner den Grundfreibetrag anteilig nutzen und die monatliche Steuerlast fair aufgeteilt wird." },
      { question: "Ändert ein Steuerklassenwechsel die Jahressteuerlast?", answer: "Nein. Die Steuerklassen regeln ausschließlich die monatlichen Lohnsteuer-Vorauszahlungen. Mit der jährlichen Einkommensteuererklärung wird die exakte Steuerschuld ermittelt; zu viel gezahlte Lohnsteuer erstattet das Finanzamt zurück." }
    ]),
    status: "Published",
    read_time: "6 min read",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    headline: "Gehaltserhöhung verhandeln: Wie viel Brutto muss ich fordern, um 200 € mehr Netto zu haben?",
    slug: "gehaltserhoehung-verhandeln-wie-viel-brutto-fuer-200-euro-netto",
    category: "Gehalt & Karriere",
    tags: "Gehaltserhöhung, Gehaltsverhandlung, Grenzsteuersatz, Kalte Progression, Nettogehalt, 2026",
    excerpt: "Durch den Grenzsteuersatz und Sozialabgaben kommt von einer Bruttoerhöhung oft nur etwa die Hälfte auf dem Konto an. So berechnen Sie Ihren Wunschbetrag für die nächste Verhandlung exakt.",
    meta_title: "Gehaltserhöhung verhandeln 2026: Brutto für 200 € Netto",
    meta_description: "Wie viel Brutto brauchen Sie für 200 € oder 300 € mehr Netto? Erklärungen zu Grenzsteuersatz, kalter Progression und Tabellen für Ihre Gehaltsverhandlung.",
    focus_keyword: "Gehaltserhöhung Brutto Netto",
    canonical_url: "https://bruttonettocalculator.com/blog/gehaltserhoehung-verhandeln-wie-viel-brutto-fuer-200-euro-netto",
    featured_image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Zwei Business-Professionals bei einer erfolgreichen Gehaltsverhandlung",
    featured_image_caption: "Eine fundierte Vorbereitung mit exakten Nettowerten stärkt Ihre Verhandlungsposition",
    enable_toc: true,
    content: `<h2>Das Phänomen: Warum von 300 € Brutto oft nur 160 € Netto bleiben</h2>
<p>Wer in eine Gehaltsverhandlung geht, hat meist ein klares Ziel für das eigene Bankkonto vor Augen: Zum Beispiel <strong>200 Euro mehr Netto</strong> im Monat, um gestiegene Lebenshaltungskosten auszugleichen oder Spielraum für Vermögensaufbau zu schaffen. Ein weit verbreiteter Fehler ist es jedoch, die Entlastung linear vom Bruttogehalt abzuleiten. Wer 200 € mehr Netto möchte und beim Arbeitgeber lediglich 250 € oder 300 € Bruttoaufschlag fordert, wird beim Blick auf die nächste Gehaltsabrechnung herb enttäuscht sein.</p>
<p>Der Grund dafür liegt in der Kombination aus dem <strong>progressiven Einkommensteuertarif (§ 32a EStG)</strong> und den prozentualen Sozialabgaben in Deutschland. Jeder zusätzliche Euro, den Sie auf Ihr bestehendes Gehalt aufschlagen, wird nicht mit Ihrem persönlichen Durchschnittssteuersatz besteuert, sondern mit Ihrem <em>Grenzsteuersatz</em>. Bei durchschnittlichen und höheren Einkommen liegt dieser schnell bei 35 % bis 42 %. Rechnet man die rund 20 % Arbeitnehmeranteil zur Sozialversicherung (Rente, Kranken-, Pflege- und Arbeitslosenversicherung) hinzu, beläuft sich die Abzugslast auf den Erhöhungsbetrag häufig auf <strong>50 % bis 55 %</strong>.</p>

<h2>Der Grenzsteuersatz vs. Durchschnittssteuersatz</h2>
<p>Um Ihre Gehaltsforderung professionell zu kalkulieren, müssen Sie den Unterschied der beiden Steuersätze verstehen:</p>
<ul>
  <li><strong>Durchschnittssteuersatz:</strong> Gibt an, wie viel Prozent Ihres <em>gesamten Bruttogehalts</em> an Lohnsteuer abgehen. Er liegt bei mittleren Einkommen meist zwischen 15 % und 23 %.</li>
  <li><strong>Grenzsteuersatz:</strong> Gibt an, mit wie viel Prozent der <em>letzte bzw. zusätzlich verdiente Euro</em> besteuert wird. Ab einem zu versteuernden Jahreseinkommen von ca. 69.879 € greift im Steuerjahr 2026 der Spitzensteuersatz von 42 %.</li>
</ul>
<blockquote>Tipp: Prüfen Sie mit unserem <a href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">Netto-zu-Brutto-Rechner</a> genau, welches Bruttogehalt erforderlich ist, um Ihr individuelles Netto-Ziel punktgenau zu erreichen.</blockquote>

<h2>Die Faustregel für die Gehaltsverhandlung</h2>
<p>Als praxisnahe Faustregel für Arbeitnehmer in Steuerklasse I (ledig, keine Kinder) gilt in Deutschland: <strong>Um einen bestimmten Nettobetrag zusätzlich zu erhalten, müssen Sie das 1,8- bis 2,1-Fache als Bruttogehaltssteigerung fordern.</strong></p>

<h3>Orientierungstabelle: Benötigter Bruttoaufschlag für Wunsch-Netto (Steuerklasse 1, Jahr 2026)</h3>
<div className="overflow-x-auto my-6">
  <table className="w-full text-left border-collapse border border-white/20 text-sm">
    <thead>
      <tr className="bg-white/10 text-white font-bold">
        <th className="p-3 border border-white/20">Aktuelles Brutto / Mon.</th>
        <th className="p-3 border border-white/20">Ziel: +100 € Netto (Bruttobedarf)</th>
        <th className="p-3 border border-white/20">Ziel: +200 € Netto (Bruttobedarf)</th>
        <th className="p-3 border border-white/20">Ziel: +300 € Netto (Bruttobedarf)</th>
        <th className="p-3 border border-white/20">Effektive Abzugsquote auf Erhöhung</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-white/10">
        <td className="p-3 border border-white/20 font-semibold text-white"><a href="/rechner/3000-euro-brutto-netto" className="hover:underline">3.000 €</a></td>
        <td className="p-3 border border-white/20">ca. +185 € Brutto</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">ca. +370 € Brutto</td>
        <td className="p-3 border border-white/20">ca. +555 € Brutto</td>
        <td className="p-3 border border-white/20 text-white/70">46 %</td>
      </tr>
      <tr className="border-b border-white/10 bg-white/[0.02]">
        <td className="p-3 border border-white/20 font-semibold text-white"><a href="/rechner/4000-euro-brutto-netto" className="hover:underline">4.000 €</a></td>
        <td className="p-3 border border-white/20">ca. +195 € Brutto</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">ca. +390 € Brutto</td>
        <td className="p-3 border border-white/20">ca. +585 € Brutto</td>
        <td className="p-3 border border-white/20 text-white/70">49 %</td>
      </tr>
      <tr className="border-b border-white/10">
        <td className="p-3 border border-white/20 font-semibold text-white"><a href="/rechner/5000-euro-brutto-netto" className="hover:underline">5.000 €</a></td>
        <td className="p-3 border border-white/20">ca. +205 € Brutto</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">ca. +410 € Brutto</td>
        <td className="p-3 border border-white/20">ca. +615 € Brutto</td>
        <td className="p-3 border border-white/20 text-white/70">51 %</td>
      </tr>
      <tr>
        <td className="p-3 border border-white/20 font-semibold text-white"><a href="/rechner/6000-euro-brutto-netto" className="hover:underline">6.000 €</a></td>
        <td className="p-3 border border-white/20">ca. +175 € Brutto*</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">ca. +350 € Brutto*</td>
        <td className="p-3 border border-white/20">ca. +525 € Brutto*</td>
        <td className="p-3 border border-white/20 text-emerald-400">42 % (über SV-Beitragsgrenze KV/PV)</td>
      </tr>
    </tbody>
  </table>
  <p className="text-xs text-white/50 mt-2">* Hinweis zu 6.000 €: Ab 5.812,50 € Monatsbrutto (2026) ist die Beitragsbemessungsgrenze der Kranken- und Pflegeversicherung überschritten. Auf weitere Bruttoerhöhungen fallen hier keine KV/PV-Beiträge mehr an, weshalb von der Erhöhung prozentual etwas mehr Netto verbleibt!</p>
</div>

<h2>Was ist die kalte Progression und wie schützt der Grundfreibetrag?</h2>
<p>Wenn Ihre Gehaltserhöhung lediglich die allgemeine Inflationsrate ausgleicht, Sie durch das höhere Bruttogehalt aber in einen höheren Steuersatz rutschen, verbleibt Ihnen real weniger Kaufkraft. Dieses Phänomen nennt man <strong>kalte Progression</strong>. Um Arbeitnehmer vor diesem Effekt zu schützen, passt die Bundesregierung regelmäßig im Herbst die Tarifeckwerte nach § 32a EStG an – darunter der Grundfreibetrag, der 2026 auf 12.348 € angehoben wurde.</p>

<h2>Steuerfreie Alternativen zur klassischen Bruttoerhöhung</h2>
<p>In vielen Verhandlungsgesprächen kann es für beide Seiten attraktiver sein, über steuer- und abgabenfreie Gehaltsbausteine (sogenannte Benefits) zu sprechen. Da auf diese Zusatzleistungen weder Lohnsteuer noch Sozialabgaben fällig werden, kommt der Betrag zu 100 % netto bei Ihnen an:</p>
<ol>
  <li><strong>Sachbezugsgutscheine:</strong> Bis zu 50 € monatlich (z. B. Tankgutscheine, Einkaufskarten) sind komplett steuerfrei.</li>
  <li><strong>Inflationsausgleichs- / Sonderprämien:</strong> Je nach aktueller Gesetzgebung können Arbeitgeber unter bestimmten Voraussetzungen steuerbegünstigte Einmalprämien auszahlen.</li>
  <li><strong>Zuschüsse zu Kinderbetreuung / Kindergarten:</strong> Arbeitgeberzuschüsse zur Unterbringung von nicht schulpflichtigen Kindern sind in unbegrenzter Höhe steuer- und sozialabgabenfrei.</li>
  <li><strong>Jobticket & Deutschlandticket:</strong> Zuschüsse für den öffentlichen Personennahverkehr können steuerfrei zusätzlich zum Gehalt gewährt werden.</li>
</ol>

<h2>Fazit: Bereiten Sie Ihre Zahlen präzise vor</h2>
<p>Gehen Sie niemals mit einer vagen Netto-Vorstellung in Ihre nächste Gehaltsverhandlung. Kalkulieren Sie im Vorfeld mit unserem <a href="/rechner/brutto-zu-netto" className="text-[#E60A1C] font-semibold hover:underline">Brutto Netto Rechner 2026</a> und unserem Netto-zu-Brutto-Tool exakt durch, welche Bruttoforderung für Ihr Ziel notwendig ist. Eine detaillierte Argumentation auf Basis belastbarer Zahlen beeindruckt Führungskräfte und führt nachweislich zu besseren Abschlüssen.</p>`,
    faqs: JSON.stringify([
      { question: "Wie viel Brutto brauche ich für 200 € mehr Netto?", answer: "Bei einem durchschnittlichen Bruttogehalt zwischen 3.500 € und 5.000 € (Steuerklasse 1) benötigen Sie eine Bruttoerhöhung von rund 390 € bis 410 €, um monatlich 200 € netto mehr auf dem Konto zu haben." },
      { question: "Warum gehen von meiner Gehaltserhöhung über 50 % Abzüge ab?", answer: "Auf zusätzliches Einkommen zahlen Sie nicht Ihren Durchschnittssteuersatz, sondern Ihren persönlichen Grenzsteuersatz (oft 35 % bis 42 %). Zusammen mit ca. 20 % Sozialabgaben summiert sich die Abzugslast auf den Erhöhungsbetrag schnell auf über 50 %." },
      { question: "Welche steuerfreien Alternativen gibt es zur Gehaltserhöhung?", answer: "Beliebte steuer- und abgabenfreie Bausteine sind monatliche Sachbezugsgutscheine bis 50 €, Zuschüsse zur Kinderbetreuung, das Jobticket für den ÖPNV oder betriebliche Gesundheitsleistungen." }
    ]),
    status: "Published",
    read_time: "5 min read",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    headline: "Teilzeit und Steuerklasse: Was bleibt vom Brutto?",
    slug: "teilzeit-und-steuerklasse-was-bleibt-vom-brutto",
    category: "Teilzeit & Arbeitsrecht",
    tags: "Teilzeit, Midijob, Gleitzone, Lohnsteuer, Sozialabgaben, Brutto Netto, 2026",
    excerpt: "Wenn Sie Ihre Arbeitszeit reduzieren, sinkt das Bruttogehalt proportional – das Nettogehalt fällt wegen der Steuerprogression jedoch oft milder aus. Alles zu Midijob, Gleitzone und Steuerklassen.",
    meta_title: "Teilzeit und Steuerklasse 2026: Was bleibt vom Brutto?",
    meta_description: "Wie wirkt sich Teilzeit auf Ihr Nettogehalt aus? Alles zu Steuerklassen, progressiver Entlastung, Midijob-Gleitzone (538–2.000 €) und Sozialabgaben.",
    focus_keyword: "Teilzeit Brutto Netto",
    canonical_url: "https://bruttonettocalculator.com/blog/teilzeit-und-steuerklasse-was-bleibt-vom-brutto",
    featured_image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
    featured_image_alt: "Planungskalender und Uhr auf Schreibtisch für Teilzeit-Arbeitszeitmodell",
    featured_image_caption: "Eine Reduzierung der Arbeitszeit führt prozentual zu geringeren Netto-Einbußen als beim Brutto",
    enable_toc: true,
    content: `<h2>Der positive Effekt der Steuerprogression bei Teilzeit</h2>
<p>Immer mehr Arbeitnehmer in Deutschland entscheiden sich für eine Reduzierung ihrer Arbeitszeit – sei es für mehr Familienzeit, Weiterbildung oder eine bessere Work-Life-Balance. Eine der größten Sorgen bei der Umstellung auf Teilzeit ist der finanzielle Verlust. Hier gibt es jedoch eine äußerst positive Nachricht, die im deutschen Steuerrecht begründet liegt: <strong>Wer sein Bruttogehalt um 20 % oder 30 % reduziert, verliert beim Nettogehalt prozentual deutlich weniger!</strong></p>
<p>Grund dafür ist der progressive Tarifverlauf des § 32a EStG. Da höhere Gehaltsbestandteile mit einem höheren Grenzsteuersatz besteuert werden, fällt beim Schritt von Vollzeit in Teilzeit zunächst genau die Gehaltsspitze weg, auf die Sie bislang die höchsten Steuern gezahlt haben. Ihr persönlicher Durchschnittssteuersatz sinkt, wodurch die Steuerbelastung auf jeden verbleibenden Euro spürbar abnimmt.</p>

<h3>Beispielrechnung: Vollzeit (40 Std.) vs. Teilzeit (30 Std. & 20 Std.) in Steuerklasse 1</h3>
<p>Nehmen wir einen Angestellten mit einem Vollzeit-Bruttogehalt von 4.000 € im Monat (Jahr 2026, keine Kinder, keine Kirchensteuer):</p>
<div className="overflow-x-auto my-6">
  <table className="w-full text-left border-collapse border border-white/20 text-sm">
    <thead>
      <tr className="bg-white/10 text-white font-bold">
        <th className="p-3 border border-white/20">Arbeitszeitmodell</th>
        <th className="p-3 border border-white/20">Bruttogehalt / Monat</th>
        <th className="p-3 border border-white/20">Brutto-Reduzierung</th>
        <th className="p-3 border border-white/20">Nettogehalt / Monat</th>
        <th className="p-3 border border-white/20 font-extrabold text-emerald-400">Tatsächliche Netto-Einbuße</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-white/10">
        <td className="p-3 border border-white/20 font-semibold text-white">Vollzeit (40 Std.)</td>
        <td className="p-3 border border-white/20 font-mono"><a href="/rechner/4000-euro-brutto-netto" className="hover:underline">4.000 €</a></td>
        <td className="p-3 border border-white/20 text-white/50">0 %</td>
        <td className="p-3 border border-white/20 font-bold text-white">ca. 2.580 €</td>
        <td className="p-3 border border-white/20 font-bold text-white/50">—</td>
      </tr>
      <tr className="border-b border-white/10 bg-white/[0.02]">
        <td className="p-3 border border-white/20 font-semibold text-white">Teilzeit 75 % (30 Std.)</td>
        <td className="p-3 border border-white/20 font-mono"><a href="/rechner/3000-euro-brutto-netto" className="hover:underline">3.000 €</a></td>
        <td className="p-3 border border-white/20 text-rose-400">-25,0 % Brutto</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">ca. 2.040 €</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">nur -20,9 % Netto (-540 €)</td>
      </tr>
      <tr>
        <td className="p-3 border border-white/20 font-semibold text-white">Teilzeit 50 % (20 Std.)</td>
        <td className="p-3 border border-white/20 font-mono"><a href="/rechner/2000-euro-brutto-netto" className="hover:underline">2.000 €</a></td>
        <td className="p-3 border border-white/20 text-rose-400">-50,0 % Brutto</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">ca. 1.450 €</td>
        <td className="p-3 border border-white/20 font-bold text-emerald-400">nur -43,8 % Netto (-1.130 €)</td>
      </tr>
    </tbody>
  </table>
</div>
<p>Das Beispiel zeigt eindrucksvoll: Wer seine Arbeitszeit um 25 % auf 30 Stunden verkürzt, verliert beim Nettogehalt lediglich rund 20,9 %! Testen Sie Ihre eigene Stundenzahl am besten sofort in unserem <a href="/rechner/brutto-zu-netto" className="text-[#E60A1C] font-semibold hover:underline">Brutto Netto Rechner 2026</a>.</p>

<h2>Der Übergangsbereich: Der Midijob (Gleitzone 538 € bis 2.000 €)</h2>
<p>Wenn Sie Ihre Arbeitszeit so weit reduzieren, dass Ihr monatliches Bruttogehalt zwischen <strong>538,01 € und 2.000,00 €</strong> liegt, greift eine besondere gesetzliche Regelung: der sogenannte <strong>Übergangsbereich (Midijob-Gleitzone)</strong> nach § 20 Abs. 2 SGB IV.</p>
<p>Während bei regulären Beschäftigungen Arbeitnehmer und Arbeitgeber die Sozialversicherungsbeiträge zu jeweils ca. 50 % tragen, zahlen Sie im Midijob einen deutlich reduzierten Arbeitnehmeranteil. Erst an der Obergrenze von exakt 2.000 Euro steigt der Arbeitnehmeranteil schrittweise auf den regulären Prozentsatz von rund 20 % an. Wichtig: Trotz der reduzierten eigenen Sozialabgaben erwerben Sie den <em>vollen Rentenanspruch</em>, als hätten Sie den vollen Beitrag gezahlt!</p>

<h2>Teilzeit und Steuerklasse bei verheirateten Paaren</h2>
<p>Für Ehepaare gewinnt das Thema Steuerklassen bei Teilzeit an enormer Bedeutung. Wenn ein Partner von Vollzeit in Teilzeit wechselt und sein Einkommen sinkt, entsteht oft das Bedürfnis, von IV/IV in die Kombination III/V zu wechseln. Beachten Sie hierbei:</p>
<ul>
  <li><strong>Vorteil von Klasse V bei Teilzeit:</strong> Durch das geringere Bruttogehalt fällt in Steuerklasse V trotz fehlendem Grundfreibetrag in absoluten Euro weniger Lohnsteuer an als bei einem Vollzeitgehalt.</li>
  <li><strong>Empfehlung Faktorverfahren:</strong> Noch transparenter und gerechter bleibt auch bei Teilzeit das <strong>Faktorverfahren (IV/IV mit Faktor)</strong>. So wird sichergestellt, dass der in Teilzeit arbeitende Partner nicht durch unverhältnismäßig hohe Abzüge demotiviert wird.</li>
</ul>

<h2>Auswirkungen von Teilzeit auf Renten- und Arbeitslosenversicherung</h2>
<p>Auch wenn der Netto-Verlust monatlich abgedämpft wird, sollten Sie langfristige Effekte einer Teilzeittätigkeit im Blick behalten:</p>
<ol>
  <li><strong>Rentenansprüche:</strong> Ihre Rentenpunkte (Entgeltpunkte) berechnen sich direkt aus Ihrem Bruttogehalt im Verhältnis zum Durchschnittsentgelt aller Versicherten. Ein um 30 % geringeres Brutto bedeutet auch 30 % weniger Rentenpunkte für diesen Zeitraum.</li>
  <li><strong>Arbeitslosengeld und Krankengeld:</strong> Lohnersatzleistungen orientieren sich am Nettogehalt der letzten 12 Monate vor Eintritt des Ereignisses. Eine Teilzeitphase reduziert entsprechend auch diese Absicherungen.</li>
</ol>

<h2>Fazit: Planen Sie Ihren Schritt in die Teilzeit fundiert</h2>
<p>Teilzeit ist dank der progressiven Einkommensteuer finanziell oft attraktiver als von vielen vermutet. Nutzen Sie unseren <a href="/rechner/2500-euro-brutto-netto" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</a>, um verschiedene Bruttogeholtsstufen exakt durchzurechnen. So finden Sie die ideale Balance zwischen gewonnener Lebenszeit und finanzieller Sicherheit im Steuerjahr 2026.</p>`,
    faqs: JSON.stringify([
      { question: "Warum verliere ich bei 25 % weniger Brutto nur 20 % Netto?", answer: "Das liegt an der Steuerprogression: Durch das geringere Bruttogehalt sinkt Ihr persönlicher Durchschnittssteuersatz. Sie sparen überproportional viel Steuern ein, weshalb der Nettoverlust prozentual milder ausfällt." },
      { question: "Was ist die Midijob-Gleitzone zwischen 538 € und 2.000 €?", answer: "Im Übergangsbereich (538,01 € bis 2.000,00 € Monatsbrutto) zahlen Arbeitnehmer reduzierte Sozialversicherungsbeiträge, behalten aber dennoch den vollen Anspruch auf Renten-, Kranken- und Arbeitslosenversicherung." },
      { question: "Wird meine Rente durch Teilzeit gekürzt?", answer: "Ja. Da Rentenpunkte direkt aus dem Bruttogehalt berechnet werden, führt eine Reduzierung der Arbeitszeit zu entsprechend geringeren Rentenansprüchen für den Zeitraum der Teilzeittätigkeit." }
    ]),
    status: "Published",
    read_time: "6 min read",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let isDbInitialized = false;

// Initialize tables
export async function initDb() {
  if (isDbInitialized) return;
  try {
    const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        headline VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100),
        tags VARCHAR(255),
        excerpt TEXT,
        meta_title VARCHAR(255),
        meta_description VARCHAR(500),
        focus_keyword VARCHAR(100),
        canonical_url VARCHAR(255),
        featured_image VARCHAR(500),
        featured_image_alt VARCHAR(255),
        featured_image_caption VARCHAR(255),
        enable_toc BOOLEAN DEFAULT TRUE,
        content LONGTEXT,
        faqs JSON,
        og_title VARCHAR(255),
        og_description VARCHAR(500),
        og_image VARCHAR(500),
        status VARCHAR(50) DEFAULT 'Published',
        read_time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    isDbInitialized = true;
    console.log("✅ MySQL articles table checked/initialized successfully.");

    // Seeding is disabled so user can delete articles without them coming back
    // console.log("✅ MySQL articles table checked/initialized successfully.");
  } catch (err: any) {
    console.warn("⚠️ MySQL offline or connection failed. Using resilient fallback store:", err.message);
  }
}

// Execute query with fallback support
export async function dbQuery<T = any>(sql: string, params: any[] = []): Promise<T> {
  await initDb();
  try {
    const pool = getPool();
    const [rows] = await pool.query(sql, params);
    return rows as T;
  } catch (err: any) {
    console.warn(`⚠️ MySQL Query failed (${err.message}). Intercepting with resilient fallback store.`);
    // Fallback CRUD handling
    const sqlUpper = sql.trim().toUpperCase();
    if (sqlUpper.startsWith("SELECT")) {
      if (sqlUpper.includes("WHERE SLUG =")) {
        const targetSlug = params[0];
        const found = fallbackArticles.find((a) => a.slug === targetSlug);
        return (found ? [found] : []) as any;
      }
      return fallbackArticles as any;
    } else if (sqlUpper.startsWith("INSERT")) {
      const newId = (fallbackArticles.length > 0 ? Math.max(...fallbackArticles.map(a => a.id || 0)) : 0) + 1;
      const newArt: Article = {
        id: newId,
        headline: params[0] || "",
        slug: params[1] || `article-${newId}`,
        category: params[2] || "",
        tags: params[3] || "",
        excerpt: params[4] || "",
        meta_title: params[5] || "",
        meta_description: params[6] || "",
        focus_keyword: params[7] || "",
        canonical_url: params[8] || "",
        featured_image: params[9] || "",
        featured_image_alt: params[10] || "",
        featured_image_caption: params[11] || "",
        enable_toc: params[12] !== undefined ? Boolean(params[12]) : true,
        content: params[13] || "",
        faqs: typeof params[14] === "string" ? params[14] : JSON.stringify(params[14] || []),
        og_title: params[15] || "",
        og_description: params[16] || "",
        og_image: params[17] || "",
        status: params[18] || "Published",
        read_time: params[19] || "3 min read",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      fallbackArticles.unshift(newArt);
      return { insertId: newId, affectedRows: 1 } as any;
    } else if (sqlUpper.startsWith("UPDATE")) {
      const targetSlug = params[params.length - 1];
      const idx = fallbackArticles.findIndex(a => a.slug === targetSlug || a.id === Number(targetSlug));
      if (idx !== -1) {
        fallbackArticles[idx] = {
          ...fallbackArticles[idx],
          headline: params[0] !== undefined ? params[0] : fallbackArticles[idx].headline,
          slug: params[1] !== undefined ? params[1] : fallbackArticles[idx].slug,
          category: params[2] !== undefined ? params[2] : fallbackArticles[idx].category,
          tags: params[3] !== undefined ? params[3] : fallbackArticles[idx].tags,
          excerpt: params[4] !== undefined ? params[4] : fallbackArticles[idx].excerpt,
          meta_title: params[5] !== undefined ? params[5] : fallbackArticles[idx].meta_title,
          meta_description: params[6] !== undefined ? params[6] : fallbackArticles[idx].meta_description,
          focus_keyword: params[7] !== undefined ? params[7] : fallbackArticles[idx].focus_keyword,
          canonical_url: params[8] !== undefined ? params[8] : fallbackArticles[idx].canonical_url,
          featured_image: params[9] !== undefined ? params[9] : fallbackArticles[idx].featured_image,
          featured_image_alt: params[10] !== undefined ? params[10] : fallbackArticles[idx].featured_image_alt,
          featured_image_caption: params[11] !== undefined ? params[11] : fallbackArticles[idx].featured_image_caption,
          enable_toc: params[12] !== undefined ? Boolean(params[12]) : fallbackArticles[idx].enable_toc,
          content: params[13] !== undefined ? params[13] : fallbackArticles[idx].content,
          faqs: params[14] !== undefined ? (typeof params[14] === "string" ? params[14] : JSON.stringify(params[14])) : fallbackArticles[idx].faqs,
          og_title: params[15] !== undefined ? params[15] : fallbackArticles[idx].og_title,
          og_description: params[16] !== undefined ? params[16] : fallbackArticles[idx].og_description,
          og_image: params[17] !== undefined ? params[17] : fallbackArticles[idx].og_image,
          status: params[18] !== undefined ? params[18] : fallbackArticles[idx].status,
          read_time: params[19] !== undefined ? params[19] : fallbackArticles[idx].read_time,
          updated_at: new Date().toISOString(),
        };
      }
      return { affectedRows: idx !== -1 ? 1 : 0 } as any;
    } else if (sqlUpper.startsWith("DELETE")) {
      const targetSlug = params[0];
      const beforeLen = fallbackArticles.length;
      fallbackArticles = fallbackArticles.filter(a => a.slug !== targetSlug && a.id !== Number(targetSlug));
      return { affectedRows: beforeLen - fallbackArticles.length } as any;
    }
    return [] as any;
  }
}
