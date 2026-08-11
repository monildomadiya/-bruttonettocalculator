"use client";

import { Coffee } from "lucide-react";

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
 */

const BMC_URL = "https://buymeacoffee.com/finnweber";

type Lang = "de" | "en" | "pl";

const COPY: Record<Lang, { heading: string; body: string; cta: string; short: string }> = {
  de: {
    heading: "Hat dir der Rechner geholfen?",
    body: "Dieser Rechner ist kostenlos und werbefinanziert. Wenn er dir Zeit gespart hat, freue ich mich über einen Kaffee.",
    cta: "Kaffee spendieren",
    short: "Kaffee spendieren",
  },
  en: {
    heading: "Did this calculator help you?",
    body: "This calculator is free and ad-supported. If it saved you time, a coffee is always appreciated.",
    cta: "Buy me a coffee",
    short: "Buy me a coffee",
  },
  pl: {
    heading: "Kalkulator okazał się pomocny?",
    body: "Ten kalkulator jest darmowy i utrzymywany z reklam. Jeśli oszczędził Ci czasu, postaw kawę.",
    cta: "Postaw kawę",
    short: "Postaw kawę",
  },
};

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
  /** "card" = full block under a calculation result. "inline" = compact footer link. */
  variant?: "card" | "inline";
  lang?: Lang;
  /** GA4 label, e.g. "calculator_result" or "footer". */
  placement: string;
}) {
  const t = COPY[lang] ?? COPY.de;

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
    <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-7 mb-6 sm:mb-8 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <span className="w-11 h-11 rounded-2xl bg-[#FFDD00] border border-black/[0.10] flex items-center justify-center flex-shrink-0 shadow-sm">
          <Coffee size={20} className="text-[#16181D]" />
        </span>
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
