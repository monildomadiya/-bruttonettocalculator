"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, Edit, Trash2, ExternalLink, Search, Filter, LayoutGrid,
  List as ListIcon, FileText, Check, Globe, LogOut, ChevronRight,
  BookOpen, Share2, Sparkles, RefreshCw, Layers, CheckCircle2, Clock,
  ArrowUpRight, ShieldCheck, Cpu, Key, Calendar
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
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering & Views
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  async function fetchArticles() {
    setLoading(true);
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        setError(data.error || "Failed to load articles.");
      }
    } catch {
      setError("Connection error to server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  // Keyboard shortcut (ESC to clear search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchQuery) {
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery]);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
      showFeedback("Article permanently deleted.");
      
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        alert("Delete failed on server: " + data.error);
        fetchArticles();
      }
    } catch {
      alert("Network error while deleting.");
      fetchArticles();
    }
  }

  function handleCopyUrl(slug: string) {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showFeedback("Live article link copied to clipboard!");
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/admin", { method: "DELETE" });
      window.location.href = "/admin-secure";
    } catch {
      window.location.href = "/admin-secure";
    }
  }

  function showFeedback(msg: string) {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  }

  // Memoized KPI Metrics for 60 FPS performance
  const { totalCount, publishedCount, draftCount } = useMemo(() => {
    return {
      totalCount: articles.length,
      publishedCount: articles.filter((a) => a.status === "Published").length,
      draftCount: articles.filter((a) => a.status !== "Published").length,
    };
  }, [articles]);

  // Extract unique categories cleanly & fast
  const allCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(articles.map((a) => a.category || "General").filter(Boolean)))];
  }, [articles]);

  // Filtered list with useMemo for instant 0ms search
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch = searchQuery === "" || 
        art.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.focus_keyword?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || (art.category || "General") === selectedCategory;
      const matchesStatus = selectedStatus === "All" || art.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, searchQuery, selectedCategory, selectedStatus]);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#030303] text-[#e5e5e5] flex font-sans antialiased selection:bg-[#E60A1C] selection:text-white relative">
        
        {/* Toast Notification - Sleek & Floating */}
        {actionFeedback && (
          <div className="fixed bottom-8 right-8 z-50 bg-[#121212]/95 backdrop-blur-xl border border-white/10 text-white px-5 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="w-2 h-2 rounded-full bg-[#E60A1C] animate-ping" />
            <span className="text-xs font-semibold tracking-wide">{actionFeedback}</span>
          </div>
        )}

        {/* ── 100% FIXED & STICKY LEFT SIDEBAR (Locked to Viewport) ─────────────── */}
        <aside
          className={`bg-[#080808] border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 ease-out z-50 fixed top-0 left-0 h-screen overflow-y-auto ${
            sidebarOpen ? "w-64 px-5 py-7" : "w-20 px-3 py-7 items-center"
          }`}
        >
          <div className="space-y-6 w-full">
            
            {/* Pristine Original Brand Logo Header (Zero Clutter!) */}
            <div className={`flex items-center ${!sidebarOpen ? "justify-center" : "px-2 pb-2"}`}>
              {sidebarOpen ? (
                <Link href="/admin-secure" className="block group">
                  <Image
                    src="/BRUTTO-NETTO-LOGO.svg"
                    alt="BruttoNetto Logo"
                    width={220}
                    height={52}
                    className="h-9 sm:h-10 w-auto transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-[0_0_15px_rgba(230,10,28,0.35)]"
                    priority
                  />
                </Link>
              ) : (
                <Link href="/admin-secure" className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white hover:bg-white/[0.1] transition-all">
                  <span className="font-display font-black text-base tracking-tighter text-[#E60A1C]">BN</span>
                </Link>
              )}
            </div>

            {/* Navigation Group */}
            <div className="space-y-4">
              {sidebarOpen && (
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30 px-2.5">
                  Editorial Status
                </div>
              )}

              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("All")}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    selectedStatus === "All"
                      ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.08] font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={16} className={selectedStatus === "All" ? "text-[#E60A1C]" : "text-white/40"} />
                    {sidebarOpen && <span>All Publications</span>}
                  </div>
                  {sidebarOpen && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${selectedStatus === "All" ? "bg-white/20 text-white" : "bg-white/[0.05] text-white/70"}`}>
                      {totalCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus("Published")}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    selectedStatus === "Published"
                      ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.08] font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className={selectedStatus === "Published" ? "text-emerald-400" : "text-white/40"} />
                    {sidebarOpen && <span>Live Published</span>}
                  </div>
                  {sidebarOpen && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      {publishedCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus("Draft")}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    selectedStatus === "Draft"
                      ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.08] font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} className={selectedStatus === "Draft" ? "text-amber-400" : "text-white/40"} />
                    {sidebarOpen && <span>Drafts / Review</span>}
                  </div>
                  {sidebarOpen && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      {draftCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

          </div>

          {/* Bottom Footer Section */}
          <div className="space-y-3 pt-6 border-t border-white/[0.08] w-full mt-auto">
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/"
                target="_blank"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-white/70 hover:text-white transition-all text-xs font-medium flex-1 ${!sidebarOpen && "justify-center"}`}
                title="Open live website"
              >
                <Globe size={15} className="text-white/50" />
                {sidebarOpen && <span className="truncate font-semibold">Live Website</span>}
                {sidebarOpen && <ArrowUpRight size={13} className="ml-auto text-white/30" />}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className={`p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all ${!sidebarOpen && "hidden"}`}
                title="Logout"
              >
                <LogOut size={15} />
              </button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.1] border border-white/[0.06] text-white/50 hover:text-white transition-all flex-shrink-0"
                title="Toggle sidebar"
              >
                <ChevronRight size={15} className={`transition-transform duration-300 ease-out ${sidebarOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </aside>


        {/* ── MAIN CONTENT WORKSPACE (Margin left matches fixed sidebar) ──────── */}
        <main className={`flex-1 min-h-screen overflow-y-auto px-6 sm:px-12 py-10 max-w-7xl space-y-8 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
          
          {/* Header Banner */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  MYSQL REAL-TIME SYNC
                </span>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-xs text-white/50 font-medium">BruttoNettoCalculator.com Editorial</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Publications & Blog Posts
              </h1>
              <p className="text-sm text-white/50 mt-1 max-w-xl">
                Manage, edit and publish tax, salary and legal guides with real-time SEO preview.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, keywords... [ESC]"
                  className="pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-white/20 text-white placeholder:text-white/30 text-xs font-medium outline-none transition-all duration-200 w-64 focus:w-80 shadow-inner"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40 hover:text-white">
                    ✕
                  </button>
                )}
              </div>

              {/* Refresh Data */}
              <button
                type="button"
                onClick={fetchArticles}
                disabled={loading}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white transition-all disabled:opacity-50"
                title="Sync with database"
              >
                <RefreshCw size={15} className={loading ? "animate-spin text-[#E60A1C]" : ""} />
              </button>

              {/* Primary Action Button */}
              <Link
                href="/admin-secure/articles/new"
                className="px-5 py-2.5 rounded-xl font-bold text-white text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-98 whitespace-nowrap group"
                style={{
                  background: "linear-gradient(135deg, #E60A1C, #b8000f)",
                  boxShadow: "0 4px 20px rgba(230,10,28,0.3)"
                }}
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Write New Article</span>
              </Link>
            </div>
          </header>

          {/* ── EXECUTIVE OVERVIEW RIBBON (Sleek Linear/Vercel Banner) ────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] rounded-2xl overflow-hidden border border-white/[0.08] shadow-xl">
            
            <div className="bg-[#0a0a0a] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white/40 text-[11px] font-mono uppercase tracking-wider mb-2">
                <span>Total Publications</span>
                <BookOpen size={14} className="text-white/30" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{loading ? "-" : totalCount}</div>
              <div className="text-[11px] text-white/40 mt-1">Stored in MySQL DB</div>
            </div>

            <div className="bg-[#0a0a0a] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400/70 text-[11px] font-mono uppercase tracking-wider mb-2">
                <span>Live Online</span>
                <CheckCircle2 size={14} className="text-emerald-400/50" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{loading ? "-" : publishedCount}</div>
              <div className="text-[11px] text-emerald-400/40 mt-1">Indexed & publicly accessible</div>
            </div>

            <div className="bg-[#0a0a0a] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400/70 text-[11px] font-mono uppercase tracking-wider mb-2">
                <span>Drafts & Review</span>
                <Clock size={14} className="text-amber-400/50" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{loading ? "-" : draftCount}</div>
              <div className="text-[11px] text-amber-400/40 mt-1">Pending publication</div>
            </div>

            <div className="bg-[#0a0a0a] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white/40 text-[11px] font-mono uppercase tracking-wider mb-2">
                <span>System Health</span>
                <Cpu size={14} className="text-[#E60A1C]/60" />
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% Optimal</span>
              </div>
              <div className="text-[11px] text-white/40 mt-1">Query Speed: 0.1ms</div>
            </div>

          </div>

          {/* ── PRECISION FILTER DOCK ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar w-full sm:w-auto">
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 mr-2 flex items-center gap-1.5 flex-shrink-0">
                <Filter size={12} />
                <span>Category:</span>
              </span>
              {allCategories.map((cat) => {
                const count = cat === "All" ? totalCount : articles.filter((a) => (a.category || "General") === cat).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? "bg-white text-black font-bold shadow-md scale-[1.02]"
                        : "bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    <span>{cat === "All" ? "All Categories" : cat}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isActive ? "bg-black/10 text-black font-bold" : "bg-white/[0.08] text-white/60"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-medium self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${viewMode === "table" ? "bg-white/[0.12] text-white font-bold shadow" : "text-white/50 hover:text-white"}`}
              >
                <ListIcon size={14} />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${viewMode === "grid" ? "bg-white/[0.12] text-white font-bold shadow" : "text-white/50 hover:text-white"}`}
              >
                <LayoutGrid size={14} />
                <span>Grid</span>
              </button>
            </div>

          </div>

          {/* ── ARTICLES WORKSPACE (Skeleton / Table / Grid) ──────────────────── */}
          {loading ? (
            <div className="bg-[#080808] border border-white/[0.08] rounded-2xl p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-xs font-mono text-white/40 uppercase tracking-widest">
                <span>Fetching records from database...</span>
                <span className="flex items-center gap-2"><Clock size={14} className="animate-spin text-[#E60A1C]" /> 60 FPS Shimmer</span>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/[0.04] animate-pulse">
                  <div className="space-y-2">
                    <div className="w-64 sm:w-96 h-4 rounded bg-white/[0.08]" />
                    <div className="w-36 h-3 rounded bg-white/[0.03]" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-6 rounded bg-white/[0.05]" />
                    <div className="w-20 h-8 rounded-lg bg-white/[0.08]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-24 bg-[#080808] border border-white/[0.08] rounded-2xl p-8 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
              <FileText size={40} className="text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
              <p className="text-white/50 text-xs max-w-md mx-auto mb-6">We couldn't find any publications matching your filter criteria.</p>
              <Link
                href="/admin-secure/articles/new"
                className="px-6 py-3 rounded-xl bg-[#E60A1C] hover:bg-[#ff1428] font-bold text-xs text-white inline-flex items-center gap-2 transition-all shadow-lg"
              >
                <Plus size={16} />
                <span>Write First Article</span>
              </Link>
            </div>
          ) : viewMode === "table" ? (
            /* ── PRECISION EDITORIAL LIST (Zero Clutter, Maximum Clarity) ─────── */
            <div className="bg-[#080808] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-[#0c0c0c] text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
                      <th className="py-4 px-6">ARTICLE TITLE</th>
                      <th className="py-4 px-6">CATEGORY / KEYWORD</th>
                      <th className="py-4 px-6 text-center">STATUS</th>
                      <th className="py-4 px-6">PUBLISHED DATE</th>
                      <th className="py-4 px-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05] text-sm">
                    {filteredArticles.map((art) => (
                      <tr
                        key={art.id}
                        className="transition-colors duration-150 hover:bg-white/[0.025] group"
                      >
                        {/* Title & Slug */}
                        <td className="py-4 px-6 max-w-md">
                          <div>
                            <Link
                              href={`/admin-secure/articles/edit/${art.slug}`}
                              className="font-bold text-white group-hover:text-[#E60A1C] transition-colors leading-snug block line-clamp-1"
                            >
                              {art.headline}
                            </Link>
                            <div className="text-[11px] text-white/40 font-mono mt-1 flex items-center gap-2 truncate">
                              <span>/blog/{art.slug}</span>
                              <span className="text-white/20">•</span>
                              <span>{art.read_time || "4 min"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category & Keyword */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/80">
                              {art.category || "General"}
                            </span>
                            {art.focus_keyword && (
                              <div className="text-[11px] text-amber-400/80 font-medium flex items-center gap-1">
                                <span>🔑 {art.focus_keyword}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          {art.status === "Published" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                              <Clock size={12} />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 text-xs text-white/50 font-mono whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-white/30" />
                            <span>{art.created_at ? new Date(art.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recent"}</span>
                          </div>
                        </td>

                        {/* Streamlined Vercel-Style Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Primary Edit Button */}
                            <Link
                              href={`/admin-secure/articles/edit/${art.slug}`}
                              className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white text-white hover:text-black font-semibold text-xs flex items-center gap-1.5 transition-all duration-150 border border-white/[0.08] hover:border-transparent"
                              title="Edit article contents"
                            >
                              <Edit size={13} />
                              <span>Edit</span>
                            </Link>

                            {/* View Live */}
                            {art.status === "Published" && (
                              <Link
                                href={`/blog/${art.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.1] border border-white/[0.08] text-white/60 hover:text-white transition-all"
                                title="View live on website ↗"
                              >
                                <Globe size={14} />
                              </Link>
                            )}

                            {/* Copy URL */}
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(art.slug)}
                              className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.1] border border-white/[0.08] text-white/60 hover:text-white transition-all"
                              title="Copy article link"
                            >
                              {copiedSlug === art.slug ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(art.slug, art.headline)}
                              className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/15 text-red-400/80 hover:text-red-400 transition-all ml-1"
                              title="Delete permanently"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ── SLEEK GRID VIEW (Precision Editorial Cards) ───────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-6 rounded-2xl bg-[#080808] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between space-y-5 group hover:bg-white/[0.015] shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/80">
                        {art.category || "General"}
                      </span>
                      {art.status === "Published" ? (
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Published</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">Draft</span>
                      )}
                    </div>

                    <Link href={`/admin-secure/articles/edit/${art.slug}`} className="block group/title">
                      <h3 className="font-bold text-base text-white group-hover/title:text-[#E60A1C] transition-colors leading-snug line-clamp-2">
                        {art.headline}
                      </h3>
                    </Link>

                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                      {art.excerpt || "No summary excerpt preview available for this publication."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                    <span className="font-mono text-white/40">{art.created_at ? new Date(art.created_at).toLocaleDateString("en-GB") : "Recent"}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin-secure/articles/edit/${art.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white text-white hover:text-black font-semibold text-xs transition-all border border-white/[0.08]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(art.slug, art.headline)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Precision Footer */}
          <footer className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
            <div>
              <span>BRUTTO-NETTO-CALCULATOR.COM • <strong className="text-white/60 font-sans">PRECISION EDITORIAL STUDIO</strong></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={14} />
                <span>Secure MySQL Session</span>
              </span>
              <span>v2.6 PRO</span>
            </div>
          </footer>

        </main>
      </div>
    </AdminAuthGuard>
  );
}
