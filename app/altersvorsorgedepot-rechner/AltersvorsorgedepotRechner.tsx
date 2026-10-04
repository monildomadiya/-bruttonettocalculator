"use client";

import { useMemo, useState } from "react";
import { PiggyBank, Calculator, Info, TrendingUp } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { AVD, ansparen, guenstigerpruefung, zulagen } from "@/lib/altersvorsorgedepot";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

/** Vereinfachtes zvE aus dem Bruttojahresgehalt — dieselbe Engine wie der Brutto-Netto-Rechner. */
const zvEAus = (bruttoJahr: number) =>
  bruttoJahr > 0
    ? calculateNetto({ bruttoMonat: bruttoJahr / 12, jahr: 2027, steuerklasse: 1, verheiratet: false, kinderlosUeber23: false, kirche: false }).steuer.zvE
    : 0;

export default function AltersvorsorgedepotRechner() {
  const [beitragMonat, setBeitragMonat] = useState(150);
  const [alter, setAlter] = useState(35);
  const [bruttoJahr, setBruttoJahr] = useState(45000);
  const [verheiratet, setVerheiratet] = useState(false);
  const [partnerBrutto, setPartnerBrutto] = useState(30000);
  const [kinder, setKinder] = useState(0);
  const [kinderJahre, setKinderJahre] = useState(10);
  const [kirche, setKirche] = useState(false);
  const [auszahlungAb, setAuszahlungAb] = useState(67);
  const [rendite, setRendite] = useState(5);
  const [kosten, setKosten] = useState(0.5);

  const beitragJahr = Math.min(Math.max(0, beitragMonat), AVD.einzahlungMax / 12) * 12;
  const unter25 = alter < AVD.berufseinsteigerUnterAlter;

  const ergebnis = useMemo(() => {
    const zRegel = zulagen(beitragJahr, kinder, false);
    const zvE = zvEAus(bruttoJahr) + (verheiratet ? zvEAus(partnerBrutto) : 0);
    const gp = guenstigerpruefung({ zvE, beitragJahr, zulage: zRegel.summe, splitting: verheiratet, kirche });
    const sp = ansparen({ beitragMonat, alter, auszahlungAb, kinder, kinderJahre, renditePct: rendite, kostenPct: kosten });
    return { zRegel, gp, sp };
  }, [beitragJahr, beitragMonat, kinder, kinderJahre, bruttoJahr, verheiratet, partnerBrutto, kirche, alter, auszahlungAb, rendite, kosten]);

  const { zRegel, gp, sp } = ergebnis;
  const gefoerdert = Math.min(beitragJahr, AVD.stufe2Grenze);
  const quote = gefoerdert > 0 ? (gp.foerderungGesamt / gefoerdert) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <PiggyBank size={14} /> Start 1.1.2027 · {AVD.bgbl}
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Altersvorsorgedepot-
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner 2027</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel <strong className="text-[#16181D]">Förderung</strong> bekommen Sie im neuen Altersvorsorgedepot —
            Zulagen <strong className="text-[#16181D]">und</strong> Steuervorteil — und was kommt bis zur Rente zusammen?
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="avd-beitrag" className="block text-sm font-semibold text-black/70 mb-2">
                  Eigenbeitrag pro Monat (gefördert bis 150 €, einzahlbar bis 570 €)
                </label>
                <input id="avd-beitrag" type="number" inputMode="decimal" min={0} max={570} value={beitragMonat}
                  onChange={(e) => setBeitragMonat(Number(e.target.value))} className={feld + " font-bold text-lg"} />
                <div className="flex flex-wrap gap-2 mt-3">
                  {[10, 30, 50, 100, 150].map((b) => (
                    <button key={b} type="button" onClick={() => setBeitragMonat(b)} aria-pressed={beitragMonat === b}
                      className="text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1 hover:bg-[#E60A1C]/15 transition-colors">
                      {b} €
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="avd-alter" className="block text-sm font-semibold text-black/70 mb-2">Alter heute</label>
                  <input id="avd-alter" type="number" min={16} max={69} value={alter} onChange={(e) => setAlter(Number(e.target.value))} className={feld} />
                </div>
                <div>
                  <label htmlFor="avd-ab" className="block text-sm font-semibold text-black/70 mb-2">Auszahlung ab</label>
                  <select id="avd-ab" value={auszahlungAb} onChange={(e) => setAuszahlungAb(Number(e.target.value))} className={feld}>
                    {[65, 66, 67, 68, 69, 70].map((a) => <option key={a} value={a}>{a} Jahren</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="avd-brutto" className="block text-sm font-semibold text-black/70 mb-2">Ihr Bruttojahresgehalt (für den Steuervorteil)</label>
                <input id="avd-brutto" type="number" inputMode="decimal" min={0} step={1000} value={bruttoJahr} onChange={(e) => setBruttoJahr(Number(e.target.value))} className={feld} />
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                  <input type="checkbox" checked={verheiratet} onChange={(e) => setVerheiratet(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                  Verheiratet, Zusammenveranlagung
                </label>
                {verheiratet && (
                  <input aria-label="Bruttojahresgehalt Partner/in" type="number" inputMode="decimal" min={0} step={1000} value={partnerBrutto}
                    onChange={(e) => setPartnerBrutto(Number(e.target.value))} className={feld} placeholder="Bruttojahresgehalt Partner/in" />
                )}
                <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                  <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                  Kirchensteuerpflichtig
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="avd-kinder" className="block text-sm font-semibold text-black/70 mb-2">Kinder mit Kindergeld</label>
                  <select id="avd-kinder" value={kinder} onChange={(e) => setKinder(Number(e.target.value))} className={feld}>
                    {[0, 1, 2, 3, 4].map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="avd-kj" className="block text-sm font-semibold text-black/70 mb-2">Noch Jahre Kindergeld</label>
                  <input id="avd-kj" type="number" min={0} max={25} value={kinderJahre} disabled={kinder === 0}
                    onChange={(e) => setKinderJahre(Number(e.target.value))} className={feld + " disabled:opacity-50"} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="avd-rendite" className="block text-sm font-semibold text-black/70 mb-2">Rendite p. a. (Annahme)</label>
                  <select id="avd-rendite" value={rendite} onChange={(e) => setRendite(Number(e.target.value))} className={feld}>
                    {[0, 2, 3, 4, 5, 6, 7].map((r) => <option key={r} value={r}>{r} %</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="avd-kosten" className="block text-sm font-semibold text-black/70 mb-2">Kosten p. a.</label>
                  <select id="avd-kosten" value={kosten} onChange={(e) => setKosten(Number(e.target.value))} className={feld}>
                    {[0.2, 0.5, 0.8, 1, 1.5].map((k) => <option key={k} value={k}>{k.toLocaleString("de-DE")} %</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
                <PiggyBank size={22} className="text-[#E60A1C]" /> Förderung pro Jahr
              </h2>
              <div className="space-y-2.5" aria-live="polite">
                <Zeile label={`Eigenbeitrag (${formatEUR(beitragJahr)} / Jahr)`} wert={formatEUR(beitragJahr)} />
                <Zeile label="Grundzulage (50 % bis 360 €, 25 % bis 1.800 €)" wert={`+${formatEUR(zRegel.grund)}`} />
                {kinder > 0 && <Zeile label={`Kinderzulage (${kinder} × bis 300 €)`} wert={`+${formatEUR(zRegel.kinder)}`} />}
                {unter25 && beitragJahr >= AVD.mindesteigenbeitrag && <Zeile label="Berufseinsteigerbonus (einmalig)" wert={`+${formatEUR(AVD.berufseinsteigerbonus)}`} />}
                <Zeile label="Zusätzlich per Steuererklärung (Günstigerprüfung)" wert={`+${formatEUR(gp.zusaetzlicheErstattung)}`} />
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                  <span className="text-black/80 text-sm font-semibold">Staatliche Förderung / Jahr</span>
                  <span className="text-2xl font-mono font-extrabold text-emerald-700">{formatEUR(gp.foerderungGesamt)}</span>
                </div>
                <p className="text-xs text-black/60 px-1 leading-relaxed">
                  {beitragJahr < AVD.mindesteigenbeitrag
                    ? `Unter ${AVD.mindesteigenbeitrag} € im Jahr (10 € im Monat) gibt es keine Zulage.`
                    : `Das sind ${quote.toLocaleString("de-DE", { maximumFractionDigits: 0 })} % auf Ihren geförderten Beitrag. ${
                        gp.zusaetzlicheErstattung > 0
                          ? `Ihr Steuervorteil (${formatEUR(gp.steuerersparnis)}) ist höher als die Zulage — die Differenz erstattet das Finanzamt.`
                          : "Bei Ihrem Einkommen ist die Zulage günstiger als der Steuerabzug."
                      }${beitragJahr > AVD.stufe2Grenze ? ` Beiträge über ${formatEUR(AVD.stufe2Grenze)} im Jahr werden nicht gefördert.` : ""}`}
                </p>
              </div>
            </div>

            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
                <TrendingUp size={22} className="text-[#E60A1C]" /> Mit {auszahlungAb} nach {sp.jahre} Jahren
              </h2>
              <div className="space-y-2.5">
                <Zeile label="Eigene Einzahlungen" wert={formatEUR(sp.eigenbeitraege)} />
                <Zeile label="Zulagen" wert={formatEUR(sp.zulagenSumme)} />
                <Zeile label={`Erträge (${rendite} % minus ${kosten.toLocaleString("de-DE")} % Kosten)`} wert={formatEUR(sp.ertraege)} />
                <div className="flex items-center justify-between bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-5 py-4">
                  <span className="text-black/80 text-sm font-semibold">Depotwert bei Rentenbeginn</span>
                  <span className="text-2xl font-mono font-extrabold text-[#16181D]">{formatEUR(sp.endkapital)}</span>
                </div>
                <Zeile label={`Auszahlungsplan bis ${AVD.auszahlplanBis} (vor Steuern)`} wert={`${formatEUR(sp.monatlicheAuszahlung)} / Monat`} />
                <p className="flex gap-2 text-xs text-black/60 px-1 leading-relaxed">
                  <Info size={13} className="flex-shrink-0 mt-0.5" />
                  Modellrechnung mit konstanter Rendite — keine Prognose und keine Anlageberatung. Die Steuererstattung
                  fließt nicht ins Depot. Auszahlungen werden im Alter voll mit dem persönlichen Steuersatz versteuert
                  (§ 22 Nr. 5 EStG).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-2.5">
      <span className="text-black/70 text-sm font-medium">{label}</span>
      <span className="text-sm sm:text-base font-mono font-bold text-[#16181D] whitespace-nowrap">{wert}</span>
    </div>
  );
}
