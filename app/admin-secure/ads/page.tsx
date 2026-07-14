"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle,
  Megaphone, Info, ExternalLink, ShieldCheck, X,
} from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface AdsSettings {
  enabled: boolean;
  publisherId: string;
  autoAds: boolean;
  slotDefault: string;
  slotNative: string;
  slotHomepage: string;
  slotInArticle: string;
  slotContent: string;
}

const EMPTY: AdsSettings = {
  enabled: false,
  publisherId: "",
  autoAds: true,
  slotDefault: "",
  slotNative: "",
  slotHomepage: "",
  slotInArticle: "",
  slotContent: "",
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
  const adsActive = settings.enabled && !!settings.publisherId;
  const adsConfiguredButOff = !settings.enabled && !!settings.publisherId;

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F4F5F7] text-[#3A3F47] font-sans antialiased">
        <header className="sticky top-0 z-20 bg-[#F4F5F7]/90 backdrop-blur-xl border-b border-black/[0.08] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin-secure"
              className="p-2 rounded-lg bg-black/[0.05] hover:bg-black/[0.05] text-black/70 hover:text-[#16181D] transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-display font-black text-lg sm:text-xl text-[#16181D] tracking-tight">
                Google AdSense
              </h1>
              <p className="text-xs text-black/40 mt-0.5">Anzeigen-Konfiguration & Monetarisierung</p>
            </div>
          </div>
          <Link
            href="/admin-secure"
            className="p-2 rounded-lg bg-black/[0.05] hover:bg-red-500/20 text-black/50 hover:text-red-600 transition-all"
            title="Schließen"
          >
            <X size={18} />
          </Link>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-black/40">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : (
            <>
              {/* Status banner */}
              <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${adsActive ? "bg-emerald-500/15 border border-emerald-500/25" : "bg-amber-500/15 border border-amber-500/25"}`}>
                  <Megaphone size={18} className={adsActive ? "text-emerald-600" : "text-amber-600"} />
                </div>
                <div>
                  <div className="font-bold text-[#16181D] text-sm">
                    {adsActive
                      ? "Anzeigen sind aktiv"
                      : adsConfiguredButOff
                      ? "Anzeigen sind deaktiviert"
                      : "Anzeigen sind noch nicht aktiv"}
                  </div>
                  <p className="text-xs text-black/50 mt-1 leading-relaxed">
                    {adsActive
                      ? "Ihre Anzeigen werden live auf der gesamten Website ausgeliefert. Zum Pausieren den Schalter unten deaktivieren."
                      : adsConfiguredButOff
                      ? "Publisher-ID ist hinterlegt. Aktivieren Sie den Schalter unten, um Anzeigen live zu schalten."
                      : "Tragen Sie Ihre Publisher-ID ein, sobald Ihr AdSense-Antrag von Google genehmigt wurde. Bis dahin bleibt diese Seite ohne Auswirkung auf die Live-Website."}
                  </p>
                </div>
              </div>

              {/* Main form */}
              <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Enable toggle */}
                <div className="flex items-center justify-between gap-4 pb-6 border-b border-black/[0.08]">
                  <div>
                    <div className="font-bold text-[#16181D] text-sm">Anzeigen aktivieren</div>
                    <p className="text-xs text-black/45 mt-1">Schaltet AdSense-Script & Anzeigen live auf der gesamten Website.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.enabled}
                    onClick={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
                    className={`relative inline-flex h-7 w-[52px] flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60A1C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF] ${settings.enabled ? "bg-[#E60A1C]" : "bg-black/[0.06]"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${settings.enabled ? "translate-x-[26px]" : "translate-x-[3px]"}`}
                    />
                  </button>
                </div>

                {/* Publisher ID */}
                <div>
                  <label className="block text-sm font-semibold text-black/80 mb-2">
                    AdSense Publisher-ID
                  </label>
                  <input
                    type="text"
                    value={settings.publisherId}
                    onChange={(e) => setSettings((s) => ({ ...s, publisherId: e.target.value }))}
                    placeholder="pub-1234567890123456"
                    className={`w-full bg-[#F4F5F7] border rounded-xl px-4 py-3 text-[#16181D] font-mono text-sm outline-none transition-colors ${
                      publisherIdValid ? "border-black/[0.08] focus:border-[#E60A1C]" : "border-red-500/50"
                    }`}
                  />
                  {!publisherIdValid && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5">
                      <AlertCircle size={12} /> Format muss "pub-" gefolgt von 10–20 Ziffern sein.
                    </p>
                  )}
                  <p className="text-xs text-black/40 mt-2">
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
                    <div className="font-bold text-[#16181D] text-sm">Auto Ads verwenden</div>
                    <p className="text-xs text-black/45 mt-1">Google platziert Anzeigen automatisch — empfohlen, kein manuelles Platzieren nötig.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.autoAds}
                    onClick={() => setSettings((s) => ({ ...s, autoAds: !s.autoAds }))}
                    className={`relative inline-flex h-7 w-[52px] flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60A1C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF] ${settings.autoAds ? "bg-[#E60A1C]" : "bg-black/[0.06]"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${settings.autoAds ? "translate-x-[26px]" : "translate-x-[3px]"}`}
                    />
                  </button>
                </div>

                {/* Manual ad slots */}
                <div className="pt-6 border-t border-black/[0.08] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black/35">
                    <Info size={12} /> Manuelle Anzeigenblöcke
                  </div>

                  {/* Default slot — the ONE field that switches on every placement */}
                  <div className="bg-emerald-500/[0.06] border border-emerald-500/25 rounded-xl p-4">
                    <label className="block text-sm font-bold text-[#16181D] mb-1.5">
                      Standard Slot-ID <span className="text-emerald-600">(empfohlen — schaltet alle Anzeigen frei)</span>
                    </label>
                    <input
                      type="text"
                      value={settings.slotDefault}
                      onChange={(e) => setSettings((s) => ({ ...s, slotDefault: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-[#16181D] font-mono text-sm focus:border-[#E60A1C] outline-none"
                    />
                    <p className="text-xs text-black/50 mt-2 leading-relaxed">
                      Erstellen Sie in AdSense <b>eine einzige</b> Anzeige vom Typ „Display&quot; (responsiv) und fügen Sie
                      die Slot-ID hier ein. Damit werden <b>sofort alle Anzeigenplätze</b> der gesamten Website aktiv
                      (Startseite, Rechner-Seiten, Blog). Für einzelne Plätze mit eigener Slot-ID nutzen Sie optional die
                      Felder darunter — diese haben Vorrang vor der Standard-ID.
                    </p>
                  </div>

                  {/* Native in-article slot — higher CPM for in-content ads */}
                  <div className="bg-[#E60A1C]/[0.05] border border-[#E60A1C]/20 rounded-xl p-4">
                    <label className="block text-sm font-bold text-[#16181D] mb-1.5">
                      Native In-Article Slot-ID <span className="text-[#E60A1C]">(optional — höheres CPM)</span>
                    </label>
                    <input
                      type="text"
                      value={settings.slotNative}
                      onChange={(e) => setSettings((s) => ({ ...s, slotNative: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-[#16181D] font-mono text-sm focus:border-[#E60A1C] outline-none"
                    />
                    <p className="text-xs text-black/50 mt-2 leading-relaxed">
                      Erstellen Sie in AdSense zusätzlich eine Anzeige vom Typ <b>„In-Article&quot; (nativ)</b> und fügen Sie
                      deren Slot-ID hier ein. Alle Anzeigen <b>im Textinhalt</b> (Rechner-Seiten, Blog) werden dann als
                      native Anzeige ausgeliefert — das erzielt in der Regel einen <b>höheren TKP/CPM</b> und fügt sich
                      besser in den Inhalt ein. Leer lassen = Standard-Display-Anzeigen.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black/30 pt-1">
                    Optional: einzelne Plätze überschreiben
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/60 mb-1.5">Slot-ID — Startseite (nach Rechner)</label>
                    <input
                      type="text"
                      value={settings.slotHomepage}
                      onChange={(e) => setSettings((s) => ({ ...s, slotHomepage: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-4 py-2.5 text-[#16181D] font-mono text-sm focus:border-[#E60A1C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/60 mb-1.5">Slot-ID — Im Blogartikel</label>
                    <input
                      type="text"
                      value={settings.slotInArticle}
                      onChange={(e) => setSettings((s) => ({ ...s, slotInArticle: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-4 py-2.5 text-[#16181D] font-mono text-sm focus:border-[#E60A1C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/60 mb-1.5">Slot-ID — Content-Seiten (Gehaltsrechner-Seiten)</label>
                    <input
                      type="text"
                      value={settings.slotContent}
                      onChange={(e) => setSettings((s) => ({ ...s, slotContent: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-4 py-2.5 text-[#16181D] font-mono text-sm focus:border-[#E60A1C] outline-none"
                    />
                    <p className="text-xs text-black/40 mt-1.5">
                      Wird auf den Betrags-Seiten (z. B. /rechner/3000-euro-brutto-netto) und allen Spezial-Rechnern angezeigt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance note */}
              <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5 flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-black/50 leading-relaxed">
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
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm bg-[#E60A1C] hover:bg-[#ff1a2e] transition-colors active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Speichern..." : "Einstellungen speichern"}
                </button>

                {feedback && (
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${feedback.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
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
