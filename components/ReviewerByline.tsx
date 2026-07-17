import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { primaryReviewer, siteConfig } from "@/lib/authors";

interface ReviewerBylineProps {
  className?: string;
  variant?: "compact" | "banner";
}

export default function ReviewerByline({ className = "", variant = "compact" }: ReviewerBylineProps) {
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
              <span>Geprüft von der <Link href="/ueber-uns" className="hover:underline text-gradient-accent">{primaryReviewer.name}</Link></span>
              <span className="text-black/40">•</span>
              <span className="text-black/70 font-normal">{primaryReviewer.credentials}</span>
            </div>
            <p className="text-xs text-black/50 mt-0.5">
              Berechnungsgrundlage: § 32a EStG — Zuletzt aktualisiert am {siteConfig.lastUpdatedDisplay}
            </p>
          </div>
        </div>
        <Link
          href="/ueber-uns"
          className="text-xs font-mono uppercase tracking-wider bg-black/[0.05] hover:bg-black/[0.06] text-[#16181D] px-3.5 py-2 rounded-xl border border-black/[0.08] transition-colors shrink-0 self-start sm:self-center"
        >
          Redaktionsstandards &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center flex-wrap gap-2 text-xs text-black/70 bg-[#FFFFFF] border border-black/[0.08] px-3.5 py-2 rounded-full shadow-sm ${className}`}>
      <div className="flex items-center gap-1.5 font-medium text-[#16181D]">
        <ShieldCheck size={14} className="text-[#E60A1C] shrink-0" />
        <span>Geprüft von:</span>
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
      <span className="text-black/40">({primaryReviewer.credentials})</span>
      <span className="text-black/30">•</span>
      <span>Zuletzt aktualisiert am <strong className="text-black/90 font-normal">{siteConfig.lastUpdatedDisplay}</strong></span>
    </div>
  );
}
