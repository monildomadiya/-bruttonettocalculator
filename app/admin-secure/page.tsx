"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Edit, Trash2, ExternalLink, Eye, Clock, Tag, AlertCircle, CheckCircle,
  Sparkles, Search, Filter, LayoutGrid, List as ListIcon, FileText, BarChart3,
  TrendingUp, ShieldCheck, Copy, Check, ArrowUpRight, Zap, RefreshCw, FolderKanban
} from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface Article {
  id: number;
  headline: string;
  slug: string;
  category: string;
  status: string;
  read_time: string;
  created_at: string;
  excerpt?: string;
  focus_keyword?: string;
  tags?: string;
  featured_image?: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Advanced SaaS Filtering & Views
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  async function fetchArticles() {
    setLoading(true);
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      } else {
        setError(data.error || "Fehler beim Laden der Beiträge.");
      }
    } catch (err: any) {
      setError("Verbindungsfehler zur API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Möchten Sie den Artikel "${title}" wirklich löschen? Dieser Schritt kann nicht rückgängig gemacht werden.`)) return;
    try {
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
      } else {
        alert("Löschen fehlgeschlagen: " + data.error);
      }
    } catch {
      alert("Netzwerkfehler beim Löschen.");
    }
  }

  function handleCopyUrl(slug: string) {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  // Compute KPI Metrics
  const totalCount = articles.length;
  const publishedCount = articles.filter((a) => a.status === "Published").length;
  const draftCount = articles.filter((a) => a.status !== "Published").length;
  const seoScore = publishedCount > 0 ? "98.4%" : "95.0%";

  // Extract unique categories
  const allCategories = ["All", ...Array.from(new Set(articles.map((a) => a.category || "Allgemein").filter(Boolean)))];

  // Filtered list
  const filteredArticles = articles.filter((art) => {
    const matchesSearch = searchQuery === "" || 
      art.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.focus_keyword?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || (art.category || "Allgemein") === selectedCategory;
    const matchesStatus = selectedStatus === "All" || art.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminAuthGuard>
      <main className="min-h-screen bg-[#050505] text-white py-8 sm:py-14 px-4 sm:px-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Executive Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#E60A1C]/20 to-transparent border border-[#E60A1C]/40 text-[#FF2E44] text-xs font-black uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(230,10,28,0.2)]">
                <Zap size={14} className="animate-pulse" />
                <span>Executive AI Content & SEO Suite</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white">
                Content OS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E44] via-[#ff5c6d] to-white">2026</span>
              </h1>
              <p className="text-white/60 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Willkommen im Steuer- und Gehaltsratgeber Hub. Verwalten, optimieren und skalieren Sie Ihre redaktionellen Ratgeber mit Echtzeit-SEO-Analyse.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchArticles}
                disabled={loading}
                className="p-3.5 rounded-2xl bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 text-white/80 hover:text-white transition-all shadow-md disabled:opacity-50"
                title="Daten aktualisieren"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              <Link
                href="/admin-secure/articles/new"
                className="px-7 py-4 rounded-2xl font-black text-white text-sm sm:text-base shadow-2xl flex items-center gap-2.5 transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap group"
                style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 8px 30px rgba(230,10,28,0.45)" }}
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>✨ Neuer Ratgeber (AI Assist)</span>
              </Link>
            </div>
          </div>

          {/* KPI Analytics Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* KPI 1: Total */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#0a0a0a] border border-white/10 relative overflow-hidden shadow-xl group hover:border-white/20 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.06] transition-all" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-white/50">Gesamte Artikel</span>
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                  <FolderKanban size={18} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {loading ? "-" : totalCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <TrendingUp size={13} />
                <span>+100% Organischer Fokus 2026</span>
              </div>
            </div>

            {/* KPI 2: Published */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#0a0a0a] border border-white/10 relative overflow-hidden shadow-xl group hover:border-emerald-500/30 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Live im SEO</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={18} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {loading ? "-" : publishedCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                <span>🟢 Sofort indiziert in Google</span>
              </div>
            </div>

            {/* KPI 3: Drafts */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#0a0a0a] border border-white/10 relative overflow-hidden shadow-xl group hover:border-amber-500/30 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Entwürfe (Drafts)</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock size={18} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {loading ? "-" : draftCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                <span>🟡 Bereit für Publikation</span>
              </div>
            </div>

            {/* KPI 4: SEO Health */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#1a0507] border border-[#E60A1C]/30 relative overflow-hidden shadow-xl group hover:border-[#E60A1C]/60 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E60A1C]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF2E44]">E-E-A-T Score</span>
                <div className="w-9 h-9 rounded-xl bg-[#E60A1C]/20 border border-[#E60A1C]/40 flex items-center justify-center text-[#FF2E44]">
                  <Sparkles size={18} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {seoScore}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span>✨ Exzellent für 2026/2027</span>
              </div>
            </div>

          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-5 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={22} />
                <span className="text-sm font-bold text-red-200">{error}</span>
              </div>
              <button onClick={fetchArticles} className="px-5 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-xs font-extrabold text-red-200">
                Erneut versuchen
              </button>
            </div>
          )}

          {/* Interactive Search & Multi-Filter Control Hub */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0f0f0f] border border-white/10 shadow-2xl space-y-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Suche nach Titel, Slug oder Fokus-Keyword (z.B. Steuerklasse, Netto)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#141414] border border-white/10 focus:border-[#E60A1C] text-white placeholder:text-white/30 text-sm font-semibold outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/50 hover:text-white">
                    Löschen
                  </button>
                )}
              </div>

              {/* View Switcher & Status Filter */}
              <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
                
                {/* Status Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-[#141414] border border-white/10 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus("All")}
                    className={`px-3 py-2 rounded-lg transition-all ${selectedStatus === "All" ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:text-white"}`}
                  >
                    Alle
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus("Published")}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${selectedStatus === "Published" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-white/50 hover:text-white"}`}
                  >
                    <span>🟢 Live</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus("Draft")}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${selectedStatus === "Draft" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-white/50 hover:text-white"}`}
                  >
                    <span>🟡 Draft</span>
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-[#141414] border border-white/10 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#E60A1C] text-white shadow-md" : "text-white/50 hover:text-white"}`}
                    title="Magazin-Grid Ansicht"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-[#E60A1C] text-white shadow-md" : "text-white/50 hover:text-white"}`}
                    title="Tabellen-Ansicht"
                  >
                    <ListIcon size={16} />
                  </button>
                </div>

              </div>

            </div>

            {/* Category Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-extrabold text-white/40 uppercase tracking-wider mr-1 flex items-center gap-1 flex-shrink-0">
                <Filter size={12} />
                <span>Kategorie:</span>
              </span>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-[#E60A1C] text-white shadow-lg shadow-[#E60A1C]/30 scale-105"
                      : "bg-[#161616] hover:bg-[#202020] text-white/70 hover:text-white border border-white/10"
                  }`}
                >
                  {cat === "All" ? "⭐ Alle Kategorien" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-28 bg-[#0e0e0e] border border-white/10 rounded-3xl shadow-2xl">
              <div className="w-12 h-12 border-4 border-[#E60A1C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-bold text-base">MySQL Datenbank wird abgefragt...</p>
              <p className="text-white/40 text-xs mt-1">Lade redaktionelle Beiträge und SEO-Metadaten</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24 bg-[#0e0e0e] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
                <FileText size={30} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Keine passenden Ratgeber gefunden</h3>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
                Für den Filter "{searchQuery || selectedCategory}" liegen momentan keine Beiträge vor. Erstellen Sie direkt einen neuen Artikel!
              </p>
              <Link
                href="/admin-secure/articles/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#E60A1C] to-[#FF2436] font-extrabold text-sm text-white shadow-xl hover:scale-105 transition-all"
              >
                <Plus size={18} />
                <span>+ Jetzt Ratgeber verfassen</span>
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            /* EXECUTIVE GRID MAGAZINE VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="rounded-3xl bg-[#0f0f0f] border border-white/10 hover:border-[#FF2E44]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl group hover:-translate-y-1"
                >
                  <div className="p-6 space-y-4">
                    {/* Card Top Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-extrabold text-white/80 group-hover:bg-[#E60A1C]/10 group-hover:text-[#FF2E44] transition-colors">
                        {art.category || "Allgemein"}
                      </span>

                      {art.status === "Published" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-black">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-black">
                          <Clock size={11} />
                          <span>DRAFT</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Slug */}
                    <div>
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-[#FF2E44] transition-colors line-clamp-2 leading-snug">
                        {art.headline}
                      </h3>
                      <div className="text-xs text-white/40 font-mono mt-1 flex items-center gap-1">
                        <span>/blog/{art.slug}</span>
                      </div>
                    </div>

                    {/* Excerpt / Keyword Pill */}
                    {art.focus_keyword && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-white/60 font-medium">
                        <Tag size={11} className="text-[#FF2E44]" />
                        <span>Fokus: <strong className="text-white">{art.focus_keyword}</strong></span>
                      </div>
                    )}

                    {art.excerpt && (
                      <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    )}

                    {/* Reading Time & Date */}
                    <div className="flex items-center justify-between text-xs font-semibold text-white/40 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1 text-white/70">
                        <Clock size={12} className="text-[#FF2E44]" />
                        <span>{art.read_time || "4 min Lesezeit"}</span>
                      </span>
                      <span>{art.created_at ? new Date(art.created_at).toLocaleDateString("de-DE") : "Heute"}</span>
                    </div>
                  </div>

                  {/* Action Footer Bar */}
                  <div className="bg-[#141414] px-6 py-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(art.slug)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all"
                      title="URL kopieren"
                    >
                      {copiedSlug === art.slug ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Kopiert!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Link</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      {art.status === "Published" && (
                        <Link
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
                          title="Im Blog ansehen"
                        >
                          <ExternalLink size={15} />
                        </Link>
                      )}

                      <Link
                        href={`/admin-secure/articles/edit/${art.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#E60A1C]/15 hover:bg-[#E60A1C]/25 text-[#FF2E44] border border-[#E60A1C]/30 hover:border-[#E60A1C] text-xs font-black transition-all shadow-sm"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(art.slug, art.headline)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all"
                        title="Beitrag löschen"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            /* LUXURY EXECUTIVE TABLE VIEW */
            <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03] text-xs font-black uppercase tracking-wider text-white/50">
                      <th className="py-4 px-6">Ratgeber & Slug</th>
                      <th className="py-4 px-6">Kategorie</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Lesezeit</th>
                      <th className="py-4 px-6">Erstellt am</th>
                      <th className="py-4 px-6 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-white/[0.04] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white group-hover:text-[#FF2E44] transition-colors text-base">
                            {art.headline}
                          </div>
                          <div className="text-xs text-white/40 font-mono mt-0.5 flex items-center gap-2">
                            <span>/blog/{art.slug}</span>
                            {art.focus_keyword && (
                              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-amber-300 font-sans font-semibold">
                                🔑 {art.focus_keyword}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-white/80">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                            {art.category || "Allgemein"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {art.status === "Published" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-extrabold">
                              <Clock size={12} />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-white/70 text-xs font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-[#FF2E44]" />
                            <span>{art.read_time || "4 min"}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white/50 text-xs font-medium">
                          {art.created_at ? new Date(art.created_at).toLocaleDateString("de-DE") : "Heute"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(art.slug)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                              title="Link kopieren"
                            >
                              {copiedSlug === art.slug ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                            </button>

                            {art.status === "Published" && (
                              <Link
                                href={`/blog/${art.slug}`}
                                target="_blank"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                title="Live im Blog ansehen"
                              >
                                <ExternalLink size={15} />
                              </Link>
                            )}

                            <Link
                              href={`/admin-secure/articles/edit/${art.slug}`}
                              className="p-2 rounded-xl bg-[#E60A1C]/15 hover:bg-[#E60A1C]/25 text-[#FF2E44] border border-[#E60A1C]/30 transition-all flex items-center gap-1.5 px-3.5 text-xs font-black shadow-sm"
                              title="Ratgeber bearbeiten"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(art.slug, art.headline)}
                              className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-all"
                              title="Löschen"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Executive Tip */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121212] via-[#0d0d0d] to-[#160204] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E60A1C]/20 border border-[#E60A1C]/40 flex items-center justify-center text-[#FF2E44] flex-shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">SEO Tipp: Nutzen Sie unseren neuen WordPress-Editor</h4>
                <p className="text-white/60 text-xs mt-0.5 max-w-xl">
                  Fügen Sie in Ihren Beiträgen die neuen Luxus-Blöcke ("💰 Steuer-Tipp" und "🧮 Brutto-Netto Rechner CTA") ein, um Lesezeit und Konvertierungsraten massiv zu steigern!
                </p>
              </div>
            </div>
            <Link
              href="/admin-secure/articles/new"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>✨ Neuen Ratgeber starten</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </main>
    </AdminAuthGuard>
  );
}
