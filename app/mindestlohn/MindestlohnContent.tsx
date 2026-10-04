import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { calculateArbeitgeberkosten, calculateNetto, formatEUR, type Steuerjahr } from "@/lib/taxCalculator";
import { WAGE_STATS_2026 } from "@/data/wage-stats";

/**
 * Server-rendered SEO content for the Mindestlohn page: Minijob implications and
 * employer costs, computed from central constants (WAGE_STATS_2026) and the
 * calculation engine. Official BMAS source linked.
 */
const MINDESTLOHN_2026 = WAGE_STATS_2026.minWageHourly2026; // 13,90 €
const MINDESTLOHN_2027 = 14.6;
const MINIJOB_GRENZE_2026 = 603; // = Mindestlohn × 130 / 3, aufgerundet
const STUNDEN_PRO_MONAT_VZ = (40 * 52) / 12; // 173,33 h

const BMAS =
  "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/Informationen-zum-Mindestlohn/informationen-zum-mindestlohn-deutsch.html";

const nettoSk1 = (bruttoMonat: number, jahr: Steuerjahr) =>
  calculateNetto({ bruttoMonat, jahr, steuerklasse: 1, verheiratet: false, kinderlosUeber23: true, kirche: false }).nettoMonat;

/** Wochenstunden für die 2026-vs-2027-Tabelle (Vollzeit bis typische Teilzeit). */
const WOCHENSTUNDEN = [40, 38, 35, 30, 25, 20];

export default function MindestlohnContent() {
  const bruttoVollzeit = MINDESTLOHN_2026 * STUNDEN_PRO_MONAT_VZ;
  const ag = calculateArbeitgeberkosten(bruttoVollzeit, true);
  const minijobMaxStundenMonat = MINIJOB_GRENZE_2026 / MINDESTLOHN_2026;
  const minijobMaxStundenWoche = (minijobMaxStundenMonat * 12) / 52;

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="ml-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="ml-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Kurzantwort</h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Der gesetzliche Mindestlohn beträgt seit dem 1. Januar 2026{" "}
            <strong className="text-[#16181D]">{MINDESTLOHN_2026.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € brutto pro Stunde</strong>{" "}
            und steigt zum 1. Januar 2027 auf{" "}
            <strong className="text-[#16181D]">{MINDESTLOHN_2027.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</strong>.
            Beide Stufen sind bereits verbindlich beschlossen. Bei einer 40-Stunden-Woche entspricht der
            Mindestlohn 2026 einem Bruttogehalt von rund{" "}
            <strong className="text-[#16181D]">{formatEUR(bruttoVollzeit)} / Monat</strong>. Wie viel davon netto
            bleibt, zeigt der Rechner oben – auf Basis der gesetzlichen Werte, unverbindlich.
          </p>
        </div>
      </section>

      {/* Mindestlohn 2027 netto — the table "mindestlohn 2027 netto / vollzeit / 40 stunden" asks for */}
      <section className="py-6" aria-labelledby="ml-2027-netto">
        <h2 id="ml-2027-netto" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Mindestlohn 2027 netto: Tabelle nach Wochenstunden
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 leading-relaxed">
          Monatsbrutto und -netto beim Mindestlohn von {MINDESTLOHN_2026.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € (2026) und{" "}
          {MINDESTLOHN_2027.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € (2027) — Steuerklasse I, ohne Kirchensteuer,
          kinderlos ab 23. Bei 40 Stunden bleiben 2027 rund{" "}
          <strong className="text-[#16181D]">{formatEUR(nettoSk1(MINDESTLOHN_2027 * STUNDEN_PRO_MONAT_VZ, 2027))} netto</strong> im Monat.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Stunden / Woche</th>
                <th className="py-3.5 px-5 text-right">Brutto 2026</th>
                <th className="py-3.5 px-5 text-right">Netto 2026</th>
                <th className="py-3.5 px-5 text-right">Brutto 2027</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Netto 2027</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {WOCHENSTUNDEN.map((h) => {
                const m = (h * 52) / 12;
                const b26 = MINDESTLOHN_2026 * m;
                const b27 = MINDESTLOHN_2027 * m;
                return (
                  <tr key={h} className={h === 40 ? "bg-[#E60A1C]/5 font-semibold" : ""}>
                    <td className="py-3 px-5">{h} Stunden{h === 40 ? " (Vollzeit)" : ""}</td>
                    <td className="py-3 px-5 text-right font-mono">{formatEUR(b26)}</td>
                    <td className="py-3 px-5 text-right font-mono">{formatEUR(nettoSk1(b26, 2026))}</td>
                    <td className="py-3 px-5 text-right font-mono">{formatEUR(b27)}</td>
                    <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(nettoSk1(b27, 2027))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Netto 2027 mit dem Steuertarif laut Gesetzentwurf zur Einkommensteuerreform 2027 und den Sozialversicherungswerten 2026
          (die Rechengrößen 2027 sind noch nicht beschlossen). Unter 2.000 € gelten die reduzierten Midijob-Beiträge.
          Andere Steuerklassen:{" "}
          <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">Steuerreform-Rechner 2027</Link>.
        </p>
      </section>

      {/* Minijob */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="ml-minijob">
        <h2 id="ml-minijob" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Mindestlohn und Minijob
        </h2>
        <p>
          Die <strong className="text-[#16181D]">Minijob-Grenze</strong> ist seit 2022 dynamisch an den
          Mindestlohn gekoppelt. Sie liegt 2026 bei{" "}
          <strong className="text-[#16181D]">{formatEUR(MINIJOB_GRENZE_2026)} im Monat</strong>. Beim Mindestlohn
          von {MINDESTLOHN_2026.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € entspricht das maximal rund{" "}
          <strong className="text-[#16181D]">{minijobMaxStundenMonat.toFixed(1).replace(".", ",")} Stunden pro Monat</strong>{" "}
          bzw. etwa <strong className="text-[#16181D]">{minijobMaxStundenWoche.toFixed(1).replace(".", ",")} Stunden pro Woche</strong>.
          Wer mehr arbeitet, überschreitet die Grenze und rutscht in eine sozialversicherungspflichtige
          Beschäftigung. Details berechnen Sie mit dem{" "}
          <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijob-Rechner</Link>.
        </p>
      </section>

      {/* Arbeitgeberkosten */}
      <section className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="ml-ag">
        <h2 id="ml-ag" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Mindestlohn aus Arbeitgebersicht
        </h2>
        <p>
          Für den Arbeitgeber kostet eine Vollzeitstelle zum Mindestlohn mehr als das Bruttogehalt: Zusätzlich
          fällt der Arbeitgeberanteil zur Sozialversicherung an. Bei rund{" "}
          <strong className="text-[#16181D]">{formatEUR(bruttoVollzeit)}</strong> Brutto liegen die
          Gesamtkosten inklusive geschätzter Umlagen bei etwa{" "}
          <strong className="text-[#16181D]">{formatEUR(ag.gesamtkostenMonat)} pro Monat</strong>. Die vollständige
          Aufstellung liefert der{" "}
          <Link href="/arbeitgeber-brutto-netto-rechner" className="text-[#E60A1C] font-semibold hover:underline">Arbeitgeberrechner</Link>.
        </p>
        <p>
          Den Stundenlohn hinter einem beliebigen Monatsgehalt ermitteln Sie mit dem{" "}
          <Link href="/stundenlohn-rechner" className="text-[#E60A1C] font-semibold hover:underline">Stundenlohnrechner</Link>,
          Ihr vollständiges Netto mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>.
        </p>
        <p className="text-sm">
          <a href={BMAS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#E60A1C] font-semibold hover:underline">
            <ExternalLink size={14} /> Offizielle Informationen zum Mindestlohn (BMAS)
          </a>
        </p>
      </section>
    </div>
  );
}
