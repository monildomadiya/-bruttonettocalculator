"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle,
  Megaphone, Info, ExternalLink, ShieldCheck,
} from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface AdsSettings {
  enabled: boolean;
  publisherId: string;
  autoAds: boolean;
  slotHomepage: string;
  slotInArticle: string;
}

const EMPTY: AdsSettings = {
  enabled: false,
  publisherId: "",
  autoAds: true,
  slotHomepage: "",
  slotInArticle: "",
};

export default function AdsSettingsPage() {
  const [settings, setSettings] = useState<AdsSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings/ads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/settings/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setFeedback({ type: "success", text: "Einstellungen gespeichert." });
      } else {
        setFeedback({ type: "error", text: data.error || "Speichern fehlgeschlagen." });
      }
    } catch {
      setFeedback({ type: "error", text: "Verbindungsfehler zum Server." });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  }

  const publisherIdValid = /^pub-\d{10,20}$/.test(settings.publisherId) || settings.publisherId === "";

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#040404] text-[#e5e5e5] font-sans antialiased">
        <header className="sticky top-0 z-20 bg-[#040404]/90 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link
            href="/admin-secure"
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
              Google AdSense
            </h1>
            <p className="text-xs text-white/40 mt-0.5">Anzeigen-Konfiguration & Monetarisierung</p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-white/40">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : (
            <>
              {/* Status banner */}
              <div className="bg-[#090909] border border-white/[0.07] rounded-2xl p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${settings.enabled && settings.publisherId ? "bg-emerald-500/15 border border-emerald-500/25" : "bg-amber-500/15 border border-amber-500/25"}`}>
                  <Megaphone size={18} className={settings.enabled && settings.publisherId ? "text-emerald-400" : "text-amber-400"} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {settings.enabled && settings.publisherId ? "Anzeigen sind aktiv" : "Anzeigen sind noch nicht aktiv"}
                  </div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    {settings.publisherId
                      ? "Sobald Ihr AdSense-Konto von Google freigegeben ist, aktivieren Sie den Schalter unten."
                      : "Tragen Sie Ihre Publisher-ID ein, sobald Ihr AdSense-Antrag von Google genehmigt wurde. Bis dahin bleibt diese Seite ohne Auswirkung auf die Live-Website."}
                  </p>
                </div>
              </div>

              {/* Main form */}
              <div className="bg-[#090909] border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Enable toggle */}
                <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
                  <div>
                    <div className="font-bold text-white text-sm">Anzeigen aktivieren</div>
                    <p className="text-xs text-white/45 mt-1">Schaltet AdSense-Script & Anzeigen live auf der gesamten Website.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
                    className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${settings.enabled ? "bg-[#E60A1C]" : "bg-white/10"}`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${settings.enabled ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                {/* Publisher ID */}
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    AdSense Publisher-ID
                  </label>
                  <input
                    type="text"
                    value={settings.publisherId}
                    onChange={(e) => setSettings((s) => ({ ...s, publisherId: e.target.value }))}
                    placeholder="pub-1234567890123456"
                    className={`w-full bg-black border rounded-xl px-4 py-3 text-white font-mono text-sm outline-none transition-colors ${
                      publisherIdValid ? "border-white/15 focus:border-[#E60A1C]" : "border-red-500/50"
                    }`}
                  />
                  {!publisherIdValid && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                      <AlertCircle size={12} /> Format muss "pub-" gefolgt von 10–20 Ziffern sein.
                    </p>
                  )}
                  <p className="text-xs text-white/40 mt-2">
                    Finden Sie unter{" "}
                    <a
                      href="https://www.google.com/adsense/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E60A1C] hover:underline inline-flex items-center gap-1"
                    >
                      AdSense-Konto <ExternalLink size={11} />
                    </a>{" "}
                    unter "Konto" → "Kontoinformationen".
                  </p>
                </div>

                {/* Auto ads toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-white text-sm">Auto Ads verwenden</div>
                    <p className="text-xs text-white/45 mt-1">Google platziert Anzeigen automatisch — empfohlen, kein manuelles Platzieren nötig.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, autoAds: !s.autoAds }))}
                    className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${settings.autoAds ? "bg-[#E60A1C]" : "bg-white/10"}`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${settings.autoAds ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                {/* Manual ad slots (optional, advanced) */}
                <div className="pt-6 border-t border-white/[0.07] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/35">
                    <Info size={12} /> Optional: Manuelle Anzeigenblöcke
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">Slot-ID — Startseite (nach Rechner)</label>
                    <input
                      type="text"
                      value={settings.slotHomepage}
                      onChange={(e) => setSettings((s) => ({ ...s, slotHomepage: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-[#E60A1C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">Slot-ID — Im Blogartikel</label>
                    <input
                      type="text"
                      value={settings.slotInArticle}
                      onChange={(e) => setSettings((s) => ({ ...s, slotInArticle: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-[#E60A1C] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Compliance note */}
              <div className="bg-[#090909] border border-white/[0.07] rounded-2xl p-5 flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/50 leading-relaxed">
                  Die Datenschutzerklärung enthält bereits die erforderlichen AdSense-Hinweise (Cookies, Google-Partner,
                  Opt-out-Links). Besuchern wird vor dem Laden von personalisierten Anzeigen ein Consent-Banner angezeigt.
                  Richten Sie zusätzlich unter AdSense → "Datenschutz &amp; Nachrichten" die Google-eigene Einwilligungsnachricht
                  (Funding Choices) ein, sobald Ihr Konto freigeschaltet ist.
                </p>
              </div>

              {/* Save */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !publisherIdValid}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#E60A1C,#b8000f)", boxShadow: "0 3px 14px rgba(230,10,28,0.35)" }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Speichern..." : "Einstellungen speichern"}
                </button>

                {feedback && (
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${feedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                    {feedback.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    {feedback.text}
                  </span>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
