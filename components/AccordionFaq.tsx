"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem { q: string; a: React.ReactNode; }

export default function AccordionFaq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`bg-[#101010] border rounded-3xl overflow-hidden transition-all duration-300 ${
              isOpen ? "border-[#E60A1C]/50 shadow-[0_0_25px_rgba(230,10,28,0.2)] bg-[#141414]" : "border-white/15 hover:border-white/30"
            }`}
          >
            <button
              id={`faq-btn-${i}`}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 sm:px-7 py-5 sm:py-6 text-left group"
            >
              <h3 className={`font-display font-bold text-lg sm:text-xl pr-4 transition-colors ${
                isOpen ? "text-[#E60A1C]" : "text-white group-hover:text-white/90"
              }`}>
                {f.q}
              </h3>
              <span
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: isOpen ? "#E60A1C" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isOpen ? "#E60A1C" : "rgba(255,255,255,0.15)"}`,
                  color: "#ffffff",
                }}
                aria-hidden
              >
                {isOpen
                  ? <Minus size={16} strokeWidth={2.5} />
                  : <Plus  size={16} strokeWidth={2.5} />
                }
              </span>
            </button>

            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className={`accordion-content ${isOpen ? "open" : ""}`}
            >
              <p className="px-7 pb-7 text-base sm:text-lg text-white/85 leading-relaxed font-normal border-t border-white/10 pt-5">
                {f.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
