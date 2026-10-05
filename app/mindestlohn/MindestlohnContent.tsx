import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { calculateArbeitgeberkosten, calculateNetto, formatEUR, type Steuerjahr } from "@/lib/taxCalculator";
import { MINDESTLOHN, MINIJOB_GRENZE } from "@/lib/config2027";
import { mindestlohnTabelle2027, monatsBrutto } from "./mindestlohnWerte";

/**
 * Server-rendered SEO content for the Mindestlohn page: Minijob implications and
 * employer costs, computed from central constants (lib/config2027.ts) and the
 * calculation engine. Official BMAS source linked.
 */
const MINDESTLOHN_2026 = MINDESTLOHN[2026]; // 13,90 €
const MINDESTLOHN_2027 = MINDESTLOHN[2027]; // 14,60 €
const MINIJOB_GRENZE_2026 = MINIJOB_GRENZE[2026]; // = Mindestlohn × 130 / 3, aufgerundet
const STUNDEN_PRO_MONAT_VZ = (40 * 13) / 3; // 173,33 h

const BMAS =
  "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/Informationen-zum-Mindestlohn/informationen-zum-mindestlohn-deutsch.html";

const nettoSk1 = (bruttoMonat: number, jahr: Steuerjahr) =>
  calculateNetto({ bruttoMonat, jahr, steuerklasse: 1, verheiratet: false, kinderlosUeber23: true, kirche: false }).nettoMonat;

const ROEMISCH = ["I", "II", "III", "IV", "V", "VI"];

export default function MindestlohnContent() {
  const bruttoVollzeit = monatsBrutto(MINDESTLOHN_2026, 40);
  const tabelle = mindestlohnTabelle2027();
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
            <strong className="text-[#16181D]">Ist der Mindestlohn brutto oder netto? Brutto.</strong>{" "}
            Der gesetzliche Mindestlohn beträgt seit dem 1. Januar 2026{" "}
            <strong className="text-[#16181D]">{MINDESTLOHN_2026.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € brutto pro Stunde</strong>{" "}
            und steigt zum 1. Januar 2027 auf{" "}
            <strong className="text-[#16181D]">{MINDESTLOHN_2027.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</strong>.
            Beide Stufen sind bereits verbindlich beschlossen. Bei einer 40-Stunden-Woche entspricht der
            Mindestlohn 2026 einem Bruttogehalt von rund{" "}
            <strong className="text-[#16181D]">{formatEUR(bruttoVollzeit)} / Monat</strong>. Netto bleiben davon in
            Steuerklasse I rund <strong className="text-[#16181D]">{formatEUR(nettoSk1(bruttoVollzeit, 2026))}</strong>, also etwa{" "}
            {formatEUR(nettoSk1(bruttoVollzeit, 2026) / STUNDEN_PRO_MONAT_VZ)} pro Stunde. Ihren Wert zeigt der Rechner oben –
            auf Basis der gesetzlichen Werte, unverbindlich.
          </p>
        </div>
      </section>

      {/* Mindestlohn 2027 netto — the table "mindestlohn 2027 netto / vollzeit / 40 stunden" asks for */}
      <section className="py-6" aria-labelledby="ml-2027-netto">
        <h2 id="ml-2027-netto" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Mindestlohn 2027 netto: Tabelle nach Wochenstunden
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 leading-relaxed">
          Monatsbrutto und -netto beim Mindestlohn 2027 von {MINDESTLOHN_2027.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € je
          Stunde, für alle sechs Steuerklassen — ohne Kirchensteuer, kinderlos ab 23. Bei 40 Stunden bleiben 2027 in
          Steuerklasse I rund{" "}
          <strong className="text-[#16181D]">{formatEUR(tabelle[tabelle.length - 1].netto[0].netto)} netto</strong> im Monat.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px] text-sm">
            <caption className="sr-only">Mindestlohn 2027: Monatsbrutto und Netto nach Wochenstunden für Steuerklasse I bis VI</caption>
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th scope="col" className="py-3.5 px-3">Std. / Woche</th>
                <th scope="col" className="py-3.5 px-3 text-right">Brutto / Monat</th>
                {ROEMISCH.map((r) => (
                  <th key={r} scope="col" className="py-3.5 px-3 text-right">Netto SK {r}</th>
                ))}
                <th scope="col" className="py-3.5 px-3 text-right">SK I: + € vs. 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 tabular-nums">
              {tabelle.map((z) => (
                <tr key={z.stunden} className={z.stunden === 40 ? "bg-[#E60A1C]/5 font-semibold" : ""}>
                  <th scope="row" className="py-3 px-3 text-left whitespace-nowrap">
                    {z.stunden} Std.{z.stunden === 40 ? " (Vollzeit)" : ""}
                    {z.minijob && <span className="block text-[11px] font-normal text-black/50">Minijob</span>}
                  </th>
                  <td className="py-3 px-3 text-right font-mono whitespace-nowrap">{formatEUR(z.brutto27)}</td>
                  {z.netto.map((n, i) => (
                    <td key={i} className={`py-3 px-3 text-right font-mono whitespace-nowrap ${i === 0 ? "font-bold text-[#16181D]" : ""}`}>
                      {formatEUR(n.netto)}
                    </td>
                  ))}
                  <td className="py-3 px-3 text-right font-mono whitespace-nowrap text-emerald-700">
                    {z.plusSk1 >= 0 ? "+" : "−"}{formatEUR(Math.abs(z.plusSk1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Monatsbrutto = Stundenlohn × Wochenstunden × 13 ÷ 3. Netto 2027 vorläufig: Steuertarif laut Gesetzentwurf zur
          Einkommensteuerreform 2027, Sozialversicherungswerte 2026 (die Rechengrößen 2027 sind noch nicht beschlossen).
          Bis 2.000 € gelten die reduzierten Midijob-Beiträge. Minijob (bis {MINIJOB_GRENZE[2027]} €): keine Lohnsteuer
          für Sie, nur 3,6 % Rentenbeitrag, sofern Sie sich nicht befreien lassen. „+ € vs. 2026“ vergleicht mit dem
          Mindestlohn 2026 von {MINDESTLOHN_2026.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € bei gleichen Stunden.
        </p>
        <p className="mt-3 text-sm sm:text-base text-black/75">
          Minijob-Grenze 2027: {MINIJOB_GRENZE[2027]} € (2026: {MINIJOB_GRENZE[2026]} €) —{" "}
          <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijob-Rechner</Link>
          {" · "}
          <Link href="/midijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Midijob-Rechner</Link>
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
