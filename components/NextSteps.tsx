"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, CalendarClock, Gauge, ShieldPlus, Users, HeartPulse, Receipt, TrendingUp, type LucideIcon } from "lucide-react";
import { formatEUR, UEBERGANGSBEREICH_2026, SV_RECHENGROESSEN_2027_ENTWURF, type Steuerjahr, type Steuerklasse } from "@/lib/taxCalculator";

/** Versicherungspflichtgrenze (JAEG) 2026, 77.400 €/Jahr — wie auf /beitragsbemessungsgrenze-2026. */
const JAEG_2026_MONAT = 77400 / 12;

type Step = { href: string; title: string; sub: string; icon: LucideIcon };

/**
 * "Passend zu Ihrem Ergebnis" — bis zu drei nächste Schritte, abgeleitet aus den
 * Eingaben im Rechner.
 *
 * Das Ergebnis ist der Moment, in dem die Aufgabe des Besuchers erledigt ist; ohne
 * Anschluss verlässt er die Seite. Die generische Linkliste "Ähnliche Rechner" am
 * Seitenende erreicht kaum jemand (auf der Startseite ~14 Bildschirme tief). Diese
 * Box steht direkt unter dem Ergebnis und nennt nur, was zum eingegebenen Fall
 * passt: Midijob-Spanne → Midijob-Rechner, über der JAEG → PKV/GKV, verheiratet →
 * Steuerklassenwechsel, 2026 → was 2027 bleibt (mit dem echten Betrag aus der Engine).
 *
 * Nur Deutsch: alle Zielseiten sind deutschsprachig. Klicks gehen als GA4-Event
 * `next_step_click` raus, damit sich messen lässt, welcher Schritt trägt.
 */
export default function NextSteps({
  brutto,
  jahr,
  steuerklasse,
  netto2027Gain,
}: {
  brutto: number;
  jahr: Steuerjahr;
  steuerklasse: Steuerklasse;
  /** Netto-Plus pro Monat 2027 gegenüber 2026 (nur relevant, wenn jahr === 2026). */
  netto2027Gain: number;
}) {
  const pathname = usePathname() || "/";
  if (!(brutto > 0)) return null;

  const candidates: Step[] = [];

  if (jahr === 2026) {
    candidates.push({
      href: "/brutto-netto-rechner-2027",
      title: netto2027Gain >= 1
        ? `2027: ${formatEUR(netto2027Gain)} mehr netto im Monat`
        : "Was bleibt 2027 netto?",
      sub: "Steuerreform 2027 laut Gesetzentwurf durchrechnen",
      icon: CalendarClock,
    });
  } else {
    candidates.push({
      href: "/sozialabgaben-rechner-2027",
      title: "Sozialabgaben 2027 im Detail",
      sub: "Neue Beitragsbemessungsgrenzen und Sätze nachrechnen",
      icon: CalendarClock,
    });
  }

  if (brutto <= UEBERGANGSBEREICH_2026.untergrenze) {
    candidates.push({ href: "/minijob-rechner", title: "Minijob: was Sie wirklich behalten", sub: "Bis 603 € — Steuer, Rente und Befreiung prüfen", icon: Gauge });
  } else if (brutto <= UEBERGANGSBEREICH_2026.obergrenze) {
    candidates.push({ href: "/midijob-rechner", title: "Midijob: reduzierte Sozialabgaben", sub: `${formatEUR(brutto)} liegt im Übergangsbereich bis 2.000 €`, icon: Gauge });
  } else if (brutto > (jahr === 2027 ? SV_RECHENGROESSEN_2027_ENTWURF.versicherungspflichtgrenzeMonat : JAEG_2026_MONAT)) {
    candidates.push({
      href: "/private-krankenversicherung-vs-gesetzlich",
      title: "PKV oder gesetzlich?",
      sub: jahr === 2027 ? "Sie liegen über der Versicherungspflichtgrenze 2027 (Entwurf)" : "Sie liegen über der Versicherungspflichtgrenze 2026",
      icon: ShieldPlus,
    });
  }

  // Typical Ausbildungsvergütung range: the result above applies the Midijob rule,
  // which by law does not apply to Azubis (§ 20 Abs. 2a SGB IV).
  if (brutto > UEBERGANGSBEREICH_2026.untergrenze && brutto <= 1400) {
    candidates.push({ href: "/ausbildung-brutto-netto-rechner", title: "In Ausbildung? Azubi-Netto berechnen", sub: "Für Azubis gilt der Midijob-Rabatt nicht", icon: Gauge });
  }

  if (steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5) {
    candidates.push({ href: "/steuerklassenwechsel-rechner", title: "Steuerklasse 3/5 oder 4/4?", sub: "Welche Kombination mehr Netto bringt", icon: Users });
  }

  candidates.push(
    { href: "/brutto-netto-rechner-krankenkasse", title: "Netto je Krankenkasse vergleichen", sub: "Der Zusatzbeitrag entscheidet mit über Ihr Netto", icon: HeartPulse },
    { href: "/steuerrueckerstattung-rechner", title: "Wie viel Steuer bekomme ich zurück?", sub: "Erstattung aus der Steuererklärung schätzen", icon: Receipt },
    { href: "/gehaltserhoehung-rechner", title: "Gehaltserhöhung: was kommt netto an?", sub: "Brutto-Plus in Netto-Plus umrechnen", icon: TrendingUp },
  );

  const steps = candidates.filter((s) => s.href !== pathname).slice(0, 3);

  const track = (href: string) => {
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof gtag === "function") gtag("event", "next_step_click", { destination: href, source: pathname });
  };

  return (
    <nav aria-labelledby="next-steps-heading" className="mt-4 rounded-2xl border border-black/[0.10] bg-white p-4 sm:p-5 shadow-lg">
      <p id="next-steps-heading" className="mb-3 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-black/60">
        Passend zu Ihrem Ergebnis
      </p>
      <ul className="divide-y divide-black/[0.06]">
        {steps.map(({ href, title, sub, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => track(href)}
              className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#E60A1C]/25 bg-[#E60A1C]/10 text-[#E60A1C]">
                <Icon size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm sm:text-base font-bold text-[#16181D] group-hover:text-[#E60A1C] transition-colors">{title}</span>
                <span className="block text-xs sm:text-sm text-black/60">{sub}</span>
              </span>
              <ChevronRight size={18} aria-hidden="true" className="flex-shrink-0 text-black/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#E60A1C]" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
