import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { primaryReviewer, siteConfig } from "@/lib/authors";

interface ReviewerBylineProps {
  className?: string;
  variant?: "compact" | "banner";
  lang?: "de" | "en" | "pl" | "ro" | "tr" | "uk";
  /**
   * Eigener Stand der Seite (lib/pageDates.ts). `null` blendet das Datum aus —
   * für Seiten, die ihr „Aktualisiert am“ bereits an anderer Stelle zeigen
   * (ein Datum pro Seite).
   */
  updatedDisplay?: string | null;
}

/**
 * Redaktionsdatum in der Seitensprache, aus dem ISO-String zerlegt (ohne
 * Date/Intl → kein Hydration-Mismatch). Vorher stand auf den fremdsprachigen
 * Seiten "1. Oktober 2026".
 */
const MONATE: Record<"en" | "pl" | "ro" | "tr" | "uk", string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  pl: ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"],
  ro: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  uk: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"],
};
function standLokal(lang: "en" | "pl" | "ro" | "tr" | "uk"): string {
  const [y, m, d] = siteConfig.lastUpdatedISO.split("-").map(Number);
  return `${d} ${MONATE[lang][m - 1]} ${y}`;
}

const BYLINE_T = {
  de: {
    reviewedByTeam: "Geprüft von der",
    reviewedBy: "Geprüft von:",
    basis: "Berechnungsgrundlage: § 32a EStG — Zuletzt aktualisiert am",
    updated: "Zuletzt aktualisiert am",
    standards: "Redaktionsstandards",
    credentials: "Fachredaktion für Lohn- & Steuerthemen",
  },
  en: {
    reviewedByTeam: "Reviewed by the",
    reviewedBy: "Reviewed by:",
    basis: "Calculation basis: § 32a EStG — Last updated on",
    updated: "Last updated on",
    standards: "Editorial standards",
    credentials: "Editorial team for payroll & tax topics",
  },
  pl: {
    reviewedByTeam: "Zweryfikowane przez",
    reviewedBy: "Zweryfikowane przez:",
    basis: "Podstawa obliczeń: § 32a EStG — Ostatnia aktualizacja:",
    updated: "Ostatnia aktualizacja:",
    standards: "Standardy redakcyjne",
    credentials: "Redakcja ds. wynagrodzeń i podatków",
  },
  ro: {
    reviewedByTeam: "Verificat de",
    reviewedBy: "Verificat de:",
    basis: "Baza de calcul: § 32a EStG — Ultima actualizare:",
    updated: "Ultima actualizare:",
    standards: "Standarde editoriale",
    credentials: "Redacția pentru salarii și impozite",
  },
  tr: {
    reviewedByTeam: "Kontrol eden:",
    reviewedBy: "Kontrol eden:",
    basis: "Hesaplama esası: § 32a EStG — Son güncelleme:",
    updated: "Son güncelleme:",
    standards: "Editoryal ilkeler",
    credentials: "Maaş ve vergi editör ekibi",
  },
  uk: {
    reviewedByTeam: "Перевірено:",
    reviewedBy: "Перевірено:",
    basis: "Основа розрахунку: § 32a EStG — Останнє оновлення:",
    updated: "Останнє оновлення:",
    standards: "Редакційні стандарти",
    credentials: "Редакція з питань зарплат і податків",
  },
} as const;

export default function ReviewerByline({ className = "", variant = "compact", lang = "de", updatedDisplay }: ReviewerBylineProps) {
  const ohneDatum = updatedDisplay === null;
  const stand = updatedDisplay ?? (lang === "de" ? siteConfig.lastUpdatedDisplay : standLokal(lang));
  const bt = BYLINE_T[lang];
  const credentials = lang === "de" ? primaryReviewer.credentials : bt.credentials;
  if (variant === "banner") {
    return (
      <div className={`bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${className}`}>
        <div className="flex items-center gap-3.5">
          {primaryReviewer.photo ? (
            <img
              src={primaryReviewer.photo}
              alt={primaryReviewer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#E60A1C]/50 shrink-0"
            />
          ) : (
            <span
              className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)" }}
              aria-hidden="true"
            >
              <ShieldCheck size={22} />
            </span>
          )}
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#16181D]">
              <ShieldCheck size={16} className="text-[#E60A1C] shrink-0" />
              <span>{bt.reviewedByTeam} <Link href="/ueber-uns" className="hover:underline text-gradient-accent">{primaryReviewer.name}</Link></span>
              <span className="text-black/40">•</span>
              <span className="text-black/70 font-normal">{credentials}</span>
            </div>
            {!ohneDatum && (
              <p className="text-xs text-black/50 mt-0.5">
                {bt.basis} {stand}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/ueber-uns"
          className="text-xs font-mono uppercase tracking-wider bg-black/[0.05] hover:bg-black/[0.06] text-[#16181D] px-3.5 py-2 rounded-xl border border-black/[0.08] transition-colors shrink-0 self-start sm:self-center"
        >
          {bt.standards} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center flex-wrap gap-2 text-xs text-black/70 bg-[#FFFFFF] border border-black/[0.08] px-3.5 py-2 rounded-full shadow-sm ${className}`}>
      <div className="flex items-center gap-1.5 font-medium text-[#16181D]">
        <ShieldCheck size={14} className="text-[#E60A1C] shrink-0" />
        <span>{bt.reviewedBy}</span>
      </div>
      <Link href="/ueber-uns" className="font-semibold text-[#16181D] hover:underline flex items-center gap-1.5">
        {primaryReviewer.photo && (
          <img
            src={primaryReviewer.photo}
            alt={primaryReviewer.name}
            className="w-4 h-4 rounded-full object-cover inline-block"
          />
        )}
        {primaryReviewer.name}
      </Link>
      <span className="text-black/40">({credentials})</span>
      {!ohneDatum && (
        <>
          <span className="text-black/30">•</span>
          <span>{bt.updated} <strong className="text-black/90 font-normal">{stand}</strong></span>
        </>
      )}
    </div>
  );
}
