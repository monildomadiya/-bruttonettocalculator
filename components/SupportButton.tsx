"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Coffee, Gift, RefreshCw, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/authors";

/**
 * Buy-Me-a-Coffee support link.
 *
 * Deliberately NOT the official BMC widget/button embed: that pulls a script
 * (and an <img>) from cdnjs.buymeacoffee.com, which (a) costs an extra
 * third-party request on every page — the site's CWV budget is tight — and
 * (b) would be a consent-requiring third party under GDPR for the German
 * audience. A plain outbound <a> needs no consent and ships zero extra bytes.
 *
 * Also kept out of any floating/overlay position so it can never sit on top of
 * an AdSense unit (accidental-click policy).
 *
 * ── The copy may not mention advertising ─────────────────────────────────────
 * Until 2026-09-11 the body text read "Dieser Rechner ist kostenlos und
 * **werbefinanziert**. Wenn er dir Zeit gespart hat, freue ich mich über einen
 * Kaffee" (and the same in EN/PL). That is a support solicitation sitting in the
 * same sentence as the fact that the site lives off ads — and the AdSense
 * invalid-traffic notice names precisely that pattern:
 *
 *   "Publishers may not ask users to support your site, offering rewards to
 *    users for viewing ads, and promising to raise money for third parties for
 *    such behavior."
 *
 * Google's classifier does not weigh the intent, it reads the adjacency. Asking
 * for a donation is fine; telling the reader in the same breath that ads pay for
 * the site is what reads as encouraging ad clicks. Keep the two apart — no
 * "werbefinanziert" / "ad-supported" / "z reklam" anywhere near a support ask,
 * and no support CTA rendered adjacent to an ad unit.
 */

const BMC_URL = "https://buymeacoffee.com/finnweber";

export type Lang = "de" | "en" | "pl";

/**
 * Locale from the route. Segment-safe on purpose: a plain
 * `startsWith("/en")` also matches /einkommensteuer-rechner,
 * /elterngeld-rechner and /erbschaftssteuer-rechner — three real German
 * pages that would have flipped to English copy.
 */
export function langFromPath(pathname?: string | null): Lang {
  if (!pathname) return "de";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  return "de";
}

/**
 * The embeddable widget renders inside third-party pages; our own donation CTA
 * has no business showing up in somebody else's layout. Defined here, next to
 * the button, so header and mobile menu cannot drift apart on the rule.
 */
export function isEmbedRoute(pathname?: string | null): boolean {
  return pathname?.startsWith("/embed") ?? false;
}

/**
 * ── Honest copy only ─────────────────────────────────────────────────────────
 * Every claim below is checkable on the site itself: it is free, needs no
 * account, computes in the browser, and the "updated" date is the real
 * editorial date from siteConfig. No invented person, no invented supporter
 * counts, no "student needs help" story — a donation ask built on a persona
 * that does not exist misleads the people who give, and the site already
 * removed one fabricated persona (see lib/authors.ts).
 */
type Copy = {
  heading: string;
  body: string;
  cta: string;
  short: string;
  tiny: string;
  eyebrow: string;
  storyHeading: string;
  storyBody: (date: string) => string;
  facts: (date: string) => [string, string, string];
  note: string;
};

const COPY: Record<Lang, Copy> = {
  de: {
    heading: "Hat dir der Rechner geholfen?",
    body: "Kostenlos, ohne Anmeldung, ohne Paywall — und bei jeder Gesetzesänderung von Hand aktualisiert. Ein Kaffee hilft, dass das so bleibt.",
    cta: "Kaffee spendieren",
    short: "Kaffee spendieren",
    tiny: "Kaffee",
    eyebrow: "Unabhängig · kostenlos · aktuell",
    storyHeading: "Hinter jeder Zahl hier steckt Handarbeit.",
    storyBody: (d) =>
      `Neue Steuerstufen, Beitragssätze, Freibeträge: Jede Änderung wird von Hand eingearbeitet und nachgerechnet — zuletzt am ${d}. Kein Konzern, keine Anmeldung, keine Paywall. Wenn dir diese Seite Zeit oder Nerven gespart hat, lade auf einen Kaffee ein.`,
    facts: (d) => ["Kostenlos & ohne Anmeldung", `Aktualisiert am ${d}`, "Rechnet direkt in deinem Browser"],
    note: "Einmalig ab 5 € · kein Konto nötig",
  },
  en: {
    heading: "Did this calculator help you?",
    body: "Free, no sign-up, no paywall — and updated by hand whenever the law changes. A coffee helps keep it that way.",
    cta: "Buy me a coffee",
    short: "Buy me a coffee",
    tiny: "Coffee",
    eyebrow: "Independent · free · up to date",
    storyHeading: "Every number here is maintained by hand.",
    storyBody: (d) =>
      `New tax brackets, contribution rates, allowances: every change is worked in by hand and re-checked — most recently on ${d}. No corporation, no sign-up, no paywall. If this page saved you time or stress, consider buying a coffee.`,
    facts: (d) => ["Free, no sign-up", `Updated ${d}`, "Calculates right in your browser"],
    note: "One-off from €5 · no account needed",
  },
  pl: {
    heading: "Kalkulator okazał się pomocny?",
    body: "Darmowy, bez rejestracji i bez paywalla — aktualizowany ręcznie przy każdej zmianie przepisów. Kawa pomaga, żeby tak zostało.",
    cta: "Postaw kawę",
    short: "Postaw kawę",
    tiny: "Kawa",
    eyebrow: "Niezależny · darmowy · aktualny",
    storyHeading: "Każda liczba tutaj to ręczna praca.",
    storyBody: (d) =>
      `Nowe progi podatkowe, stawki składek, kwoty wolne: każdą zmianę wprowadzamy ręcznie i sprawdzamy — ostatnio ${d}. Bez korporacji, bez rejestracji, bez paywalla. Jeśli ta strona oszczędziła Ci czasu lub nerwów, postaw kawę.`,
    facts: (d) => ["Darmowy, bez rejestracji", `Aktualizacja: ${d}`, "Liczy bezpośrednio w przeglądarce"],
    note: "Jednorazowo od 5 € · bez zakładania konta",
  },
};

/**
 * Editorial date per language, taken apart by hand from the ISO string —
 * deliberately without Date/Intl, which can differ between server and browser
 * and would cause a hydration mismatch (same approach as the result chip).
 */
const MONTHS: Record<Lang, string[]> = {
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  pl: ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"],
};
function stand(lang: Lang): string {
  const [y, m, d] = siteConfig.lastUpdatedISO.split("-").map(Number);
  const month = MONTHS[lang][m - 1];
  return lang === "de" ? `${d}. ${month} ${y}` : `${d} ${month} ${y}`;
}

/** Steaming cup — the "face" of the ask, instead of a stock photo of a person. */
function CoffeeCup({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="flex-shrink-0">
      <g className="coffee-steam" stroke="#16181D" strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M24 8c-3 3 3 5 0 9" />
        <path d="M32 5c-3 3 3 5 0 9" />
        <path d="M40 8c-3 3 3 5 0 9" />
      </g>
      <path d="M12 24h36v14a16 16 0 0 1-16 16h-4A16 16 0 0 1 12 38V24z" fill="#FFDD00" stroke="#16181D" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M48 28h3a7 7 0 0 1 0 14h-4" fill="none" stroke="#16181D" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 36.5c0-2.2 1.9-3.8 3.9-3 .8.3 1.5.9 2.1 1.6.6-.7 1.3-1.3 2.1-1.6 2-.8 3.9.8 3.9 3 0 3.7-6 7.2-6 7.2s-6-3.5-6-7.2z" fill="#E60A1C" />
      <path d="M8 58h48" stroke="#16181D" strokeOpacity="0.25" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * One gentle pulse on the header button, once per browser session, and only
 * after the visitor has actually used the site (second page view or 40 s on a
 * page). It never moves or covers content — a floating overlay could end up on
 * top of an ad unit, which the AdSense notes above rule out.
 */
const NUDGE_KEY = "bnc_coffee_nudge";
// The header renders several coffee buttons (desktop pill, mobile icon); each
// runs this hook. A page view must be counted once, not once per instance.
let lastCountedPath: string | null = null;
let nudgedPath: string | null = null;

function readNudge(): { views: number; shown: boolean } {
  try {
    return JSON.parse(sessionStorage.getItem(NUDGE_KEY) || "") || { views: 0, shown: false };
  } catch {
    return { views: 0, shown: false };
  }
}
function writeNudge(v: { views: number; shown: boolean }) {
  try {
    sessionStorage.setItem(NUDGE_KEY, JSON.stringify(v));
  } catch {
    /* storage blocked — worst case the nudge shows again next session */
  }
}

function useCoffeeNudge(enabled: boolean): boolean {
  const pathname = usePathname();
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    if (!enabled || !pathname) return;
    if (lastCountedPath !== pathname) {
      lastCountedPath = pathname;
      const v = readNudge();
      writeNudge({ ...v, views: v.views + 1 });
    }
    const state = readNudge();
    if (state.shown) return;
    const t = setTimeout(
      () => {
        // Every instance on this page pulses together; later pages never do.
        const s = readNudge();
        if (s.shown && nudgedPath !== pathname) return;
        if (!s.shown) {
          writeNudge({ ...s, shown: true });
          nudgedPath = pathname;
        }
        setNudge(true);
      },
      state.views >= 2 ? 4000 : 40000
    );
    return () => clearTimeout(t);
  }, [enabled, pathname]);
  return nudge;
}

/** Fire-and-forget GA4 event so we can see which placement actually converts. */
function trackDonateClick(placement: string) {
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", "donate_click", { method: "buymeacoffee", placement });
  }
}

export default function SupportButton({
  variant = "card",
  lang = "de",
  placement,
}: {
  /**
   * "card"        = full block under a calculation result.
   * "inline"      = compact footer link.
   * "header"      = pill in the desktop nav bar (label appears from lg up).
   * "header-icon" = icon-only circle, sized to match the mobile hamburger.
   * "story"       = full-width closing section at the end of a page.
   */
  variant?: "card" | "inline" | "header" | "header-icon" | "story";
  lang?: Lang;
  /** GA4 label, e.g. "calculator_result" or "footer". */
  placement: string;
}) {
  const t = COPY[lang] ?? COPY.de;
  const nudge = useCoffeeNudge(variant === "header" || variant === "header-icon");
  const nudgeCls = nudge ? " coffee-nudge" : "";

  /**
   * Desktop nav pill — deliberately lg and up only.
   *
   * At the md breakpoint the header bar is already full: logo (196 px) plus the
   * four nav items (423 px) leave 33 px inside a 655 px content box, and even
   * an icon-only 50 px pill overflows it by 17 px, pushing the nav into the
   * header's right padding at exactly 768 px (iPad portrait). From lg up there
   * is ~140 px of slack, so the labelled pill fits comfortably. The md-to-lg
   * band keeps the footer and result-card placements.
   */
  if (variant === "header") {
    return (
      <a
        href={BMC_URL}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackDonateClick(placement)}
        title={t.cta}
        aria-label={t.cta}
        className={"group hidden lg:flex items-center gap-2 rounded-2xl bg-[#FFDD00] hover:bg-[#FFE94D] text-[#16181D] text-base font-semibold px-4 py-2 border border-black/[0.10] shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap" + nudgeCls}
      >
        <Coffee size={16} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
        <span>{t.tiny}</span>
      </a>
    );
  }

  if (variant === "header-icon") {
    return (
      <a
        href={BMC_URL}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackDonateClick(placement)}
        title={t.cta}
        aria-label={t.cta}
        className={"w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#FFDD00] hover:bg-[#FFE94D] border border-black/[0.10] text-[#16181D] shadow-sm active:scale-95 transition-all flex-shrink-0" + nudgeCls}
      >
        <Coffee size={17} />
      </a>
    );
  }

  if (variant === "story") {
    const d = stand(lang);
    const icons = [Gift, RefreshCw, ShieldCheck];
    return (
      <section
        data-no-auto-ads="true"
        aria-labelledby="support-story-heading"
        className="max-w-6xl mx-auto px-4 sm:px-5 my-12 sm:my-16"
      >
        <div className="relative overflow-hidden rounded-3xl border border-black/[0.08] bg-gradient-to-br from-[#FFF8D6] via-white to-white p-6 sm:p-10 shadow-card">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#FFDD00]/25 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)_auto] gap-6 md:gap-10 items-center">
            <CoffeeCup size={88} />
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest font-bold text-black/50 mb-2">{t.eyebrow}</p>
              <h2 id="support-story-heading" className="font-display font-extrabold text-2xl sm:text-3xl text-[#16181D] leading-tight mb-3">
                {t.storyHeading}
              </h2>
              <p className="text-sm sm:text-base text-black/70 leading-relaxed max-w-2xl">{t.storyBody(d)}</p>
              <ul className="flex flex-wrap gap-2 mt-4">
                {t.facts(d).map((f, i) => {
                  const Icon = icons[i];
                  return (
                    <li key={f} className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/70 bg-white border border-black/[0.08] rounded-full px-3 py-1.5">
                      <Icon size={13} className="text-[#E60A1C] flex-shrink-0" />
                      {f}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col items-stretch md:items-center gap-2">
              <a
                href={BMC_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={() => trackDonateClick(placement)}
                className="group flex items-center justify-center gap-2.5 rounded-full bg-[#FFDD00] hover:bg-[#FFE94D] text-[#16181D] text-base font-extrabold px-7 py-3.5 border border-black/[0.12] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                <Coffee size={19} className="flex-shrink-0 transition-transform group-hover:rotate-[-8deg]" />
                <span>{t.cta}</span>
              </a>
              <span className="text-[11px] text-black/45 font-medium text-center">{t.note}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={BMC_URL}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackDonateClick(placement)}
        className="inline-flex items-center gap-2 rounded-full bg-[#FFDD00] hover:bg-[#FFE94D] text-[#16181D] text-xs sm:text-sm font-bold px-4 py-2 border border-black/[0.10] shadow-sm transition-all"
      >
        <Coffee size={15} className="flex-shrink-0" />
        <span>{t.short}</span>
      </a>
    );
  }

  return (
    /* `data-no-auto-ads` is an attempt to keep Auto Ads from injecting a unit
       inside this block: a bright yellow "Kaffee spendieren" button with an ad
       wedged in beside it is indistinguishable, at a glance, from an ad that
       *is* the donation, and an accidental click on it is what the
       invalid-traffic notice is about.

       BUT: this attribute is not in Google's documentation (checked 2026-09-11 —
       it circulates in forum answers, nothing more). It is left in place because
       it costs nothing, NOT because it is known to work. The documented control
       is AdSense → Ads → **Excluded areas**, which stops Auto Ads requesting an
       ad for a region at all. Do not reach for the other common workaround,
       `.google-auto-placed { display: none }`: the ad is still requested and
       still counts an impression nobody can see, which is the same class of
       signal that got the account limited. */
    <div
      data-no-auto-ads="true"
      className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-7 mb-6 sm:mb-8 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <CoffeeCup size={48} />
        <div className="min-w-0">
          <p className="font-display font-extrabold text-base sm:text-lg text-[#16181D] leading-snug">
            {t.heading}
          </p>
          <p className="text-xs sm:text-sm text-black/60 font-medium mt-1">
            {t.body}
          </p>
        </div>
      </div>

      <a
        href={BMC_URL}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackDonateClick(placement)}
        className="flex items-center justify-center gap-2 rounded-full bg-[#FFDD00] hover:bg-[#FFE94D] text-[#16181D] text-sm sm:text-base font-bold px-6 py-3 border border-black/[0.10] shadow-md hover:shadow-lg transition-all flex-shrink-0 whitespace-nowrap"
      >
        <Coffee size={17} className="flex-shrink-0" />
        <span>{t.cta}</span>
      </a>
    </div>
  );
}
