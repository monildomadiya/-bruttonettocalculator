"use client";

import { useState } from "react";
import { BarChart3, ExternalLink, FileCode2, Globe, Images, LogOut, RefreshCw, Search } from "lucide-react";
import { useAdmin } from "./context";
import { Button, useToast } from "./ui";

const LINKS = [
  { href: "/", label: "Website", icon: Globe },
  { href: "/infografiken", label: "Infografiken-Galerie", icon: Images },
  { href: "/sitemap.xml", label: "Sitemap", icon: FileCode2 },
  { href: "https://search.google.com/search-console", label: "Google Search Console", icon: Search },
  { href: "https://www.bing.com/webmasters", label: "Bing Webmaster Tools", icon: Search },
  { href: "https://analytics.google.com/", label: "Google Analytics", icon: BarChart3 },
];

export default function ToolsPanel() {
  const { api, reload, logout } = useAdmin();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setBusy(true);
    try {
      await api("/api/admin/refresh", { method: "POST" });
      await reload();
      toast("ok", "Cache geleert — alle Seiten zeigen beim nächsten Aufruf den aktuellen Stand.");
    } catch (err) {
      toast("error", (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5 sm:p-5">
        <h2 className="font-display text-base font-bold text-[#16181D]">Cache</h2>
        <p className="mt-1 text-sm text-black/60">
          Speichern im Admin aktualisiert die Website automatisch. Nur nötig, wenn Sie direkt in der Cloudinary-Konsole
          etwas geändert haben.
        </p>
        <Button variant="soft" busy={busy} onClick={refresh} className="mt-4">
          <RefreshCw size={16} /> Cache aktualisieren
        </Button>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5 sm:p-5">
        <h2 className="font-display text-base font-bold text-[#16181D]">Automatisch im Hintergrund</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-black/65">
          <li>✓ Neue Infografiken landen sofort in der Sitemap.</li>
          <li>✓ Bing &amp; Copilot werden per IndexNow direkt benachrichtigt.</li>
          <li>✓ Große Handy-Fotos werden vor dem Upload verkleinert.</li>
          <li>✓ Entwürfe neuer Infografiken bleiben auf diesem Gerät gespeichert.</li>
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5 sm:p-5 lg:col-span-2">
        <h2 className="font-display text-base font-bold text-[#16181D]">Schnellzugriff</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[48px] items-center gap-3 rounded-xl border border-black/[0.08] px-3.5 text-sm font-semibold text-[#16181D] transition hover:border-black/25"
              >
                <Icon size={17} className="text-[#E60A1C]" />
                <span className="flex-1">{label}</span>
                <ExternalLink size={14} className="text-black/35" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Button variant="danger" onClick={logout} className="justify-self-start">
        <LogOut size={16} /> Abmelden
      </Button>
    </div>
  );
}
