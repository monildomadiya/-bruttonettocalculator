import Link from "next/link";
import type { Metadata } from "next";
import { Calculator, BookOpen, HelpCircle } from "lucide-react";
import "./globals.css";
export const metadata: Metadata = {
  title: "Seite nicht gefunden (404) | BruttoNettoCalculator.com",
  description: "Die gesuchte Seite konnte nicht gefunden werden. Nutzen Sie unseren kostenlosen Gehaltsrechner für 2026.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-[80vh] bg-black text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="max-w-2xl w-full text-center space-y-8 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 sm:p-14 shadow-[0_0_60px_rgba(230,10,28,0.15)] relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-28 -left-28 w-56 h-56 rounded-full bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-28 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[#E60A1C] text-xs font-bold uppercase tracking-widest">
          <span>Fehler 404 • Seite nicht gefunden</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white/90">
            Diese Seite existiert leider nicht mehr.
          </h2>
        </div>

        <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Der aufgerufene Link ist veraltet, wurde verschoben oder ist falsch geschrieben. Kehren Sie ganz einfach zu unserem aktuellen Gehaltsrechner für 2026 zurück.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E60A1C] to-[#b8000f] hover:from-[#ff1428] hover:to-[#E60A1C] text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Calculator size={18} />
            <span>Zum Brutto-Netto-Rechner 2026</span>
          </Link>

          <Link
            href="/blog"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen size={18} />
            <span>Zum Ratgeber & Blog</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-white/40">
          <Link href="/faq" className="hover:text-white transition-colors flex items-center gap-1.5">
            <HelpCircle size={14} /> FAQ & Hilfe
          </Link>
          <span>•</span>
          <Link href="/kontakt" className="hover:text-white transition-colors">
            Kontakt
          </Link>
          <span>•</span>
          <Link href="/lexikon" className="hover:text-white transition-colors">
            Steuer-Lexikon
          </Link>
        </div>

      </div>
    </main>
  );
}
