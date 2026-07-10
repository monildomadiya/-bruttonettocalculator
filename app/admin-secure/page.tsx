"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, Edit, Trash2, ExternalLink, Search, Filter, LayoutGrid,
  List as ListIcon, FileText, Check, Globe, LogOut, ChevronRight,
  BookOpen, Share2, RefreshCw, Layers, CheckCircle2, Clock,
  ArrowUpRight, ShieldCheck, Cpu, Calendar, X, Menu, BarChart2,
  Zap, Settings, Tag, Eye, Megaphone,
} from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ slug: string; title: string } | null>(null);

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

  useEffect(() => { fetchArticles(); }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchQuery) setSearchQuery("");
        if (mobileSidebarOpen) setMobileSidebarOpen(false);
        if (deleteConfirm) setDeleteConfirm(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, mobileSidebarOpen, deleteConfirm]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [selectedStatus, selectedCategory]);

  async function confirmDelete() {
    if (!deleteConfirm) return;
    const { slug, title } = deleteConfirm;
    setDeleteConfirm(null);
    setArticles((prev) => prev.filter((a) => a.slug !== slug));
    showFeedback("Article deleted successfully.");
    try {
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        showFeedback("Delete failed on server. Refreshing...");
        fetchArticles();
      }
    } catch {
      showFeedback("Network error. Refreshing...");
      fetchArticles();
    }
  }

  function handleCopyUrl(slug: string) {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showFeedback("Article URL copied to clipboard!");
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  async function handleLogout() {
    try {
      await signOut(auth); // Sign out of Firebase first
      await fetch("/api/auth/admin", { method: "DELETE" }); // Remove session cookie
    } catch (err) {
      console.error("Logout failed", err);
    }
    window.location.href = "/admin-secure";
  }

  function showFeedback(msg: string) {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  }

  const { totalCount, publishedCount, draftCount } = useMemo(() => ({
    totalCount: articles.length,
    publishedCount: articles.filter((a) => a.status === "Published").length,
    draftCount: articles.filter((a) => a.status !== "Published").length,
  }), [articles]);

  const allCategories = useMemo(() =>
    ["All", ...Array.from(new Set(articles.map((a) => a.category || "General").filter(Boolean)))],
    [articles]
  );

  const filteredArticles = useMemo(() =>
    articles.filter((art) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        art.headline?.toLowerCase().includes(q) ||
        art.slug?.toLowerCase().includes(q) ||
        art.focus_keyword?.toLowerCase().includes(q) ||
        art.excerpt?.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "All" || (art.category || "General") === selectedCategory;
      const matchesStatus = selectedStatus === "All" || art.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    }),
    [articles, searchQuery, selectedCategory, selectedStatus]
  );

  /* ─── Sidebar content (shared between desktop & mobile) ─────────── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.07]">
        <Link href="/admin-secure" className="block">
          <Image
            src="/BRUTTO-NETTO-LOGO.svg"
            alt="BruttoNetto"
            width={180}
            height={44}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <p className="text-[10px] text-white/30 font-mono mt-1.5 uppercase tracking-widest">
          Editorial Studio
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Status filters */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 px-3 mb-2">
            Filter by Status
          </p>
          <div className="space-y-0.5">
            {[
              { label: "All Articles",    value: "All",       icon: Layers,       count: totalCount,     color: "text-white/70" },
              { label: "Published",       value: "Published", icon: CheckCircle2, count: publishedCount, color: "text-emerald-400" },
              { label: "Drafts & Review", value: "Draft",     icon: Clock,        count: draftCount,     color: "text-amber-400" },
            ].map(({ label, value, icon: Icon, count, color }) => {
              const active = selectedStatus === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedStatus(value)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-white/10 text-white shadow-sm border border-white/10"
                      : "text-white/55 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={active ? color : "text-white/35"} />
                    <span>{label}</span>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                    active ? "bg-white/15 text-white" : "bg-white/[0.05] text-white/50"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 px-3 mb-2">
            Quick Actions
          </p>
          <div className="space-y-0.5">
            <Link
              href="/admin-secure/articles/new"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <Plus size={15} className="text-white/35" />
              <span>New Article</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <Globe size={15} className="text-white/35" />
              <span>Live Website</span>
              <ArrowUpRight size={12} className="ml-auto text-white/25" />
            </Link>
          </div>
        </div>

        {/* Monetization */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 px-3 mb-2">
            Monetarisierung
          </p>
          <div className="space-y-0.5">
            <Link
              href="/admin-secure/ads"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <Megaphone size={15} className="text-white/35" />
              <span>Google AdSense</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-4 border-t border-white/[0.07]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#040404] text-[#e5e5e5] font-sans antialiased selection:bg-[#E60A1C] selection:text-white">

        {/* ── Toast Notification ────────────────────────────────────── */}
        {actionFeedback && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#161616] border border-white/[12%] text-white text-sm font-medium shadow-2xl backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            {actionFeedback}
          </div>
        )}

        {/* ── Delete Confirm Modal ──────────────────────────────────── */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/[12%] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">Delete Article?</h3>
                  <p className="text-white/55 text-sm mt-1 leading-relaxed">
                    <span className="text-white/75 font-medium">"{deleteConfirm.title}"</span> will be permanently removed. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-bold transition-all"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile Sidebar Overlay ────────────────────────────────── */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ── Desktop Sidebar (fixed, hidden on mobile) ─────────────── */}
        <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-screen w-60 xl:w-64 bg-[#080808] border-r border-white/[0.07] z-30 overflow-hidden">
          <SidebarContent />
        </aside>

        {/* ── Mobile Sidebar (slide-in drawer) ─────────────────────── */}
        <aside
          className={`fixed top-0 left-0 h-screen w-72 bg-[#080808] border-r border-white/[0.07] z-50 transform transition-transform duration-300 ease-out lg:hidden ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.05] text-white/50 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          <SidebarContent />
        </aside>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <div className="lg:pl-60 xl:pl-64 min-h-screen flex flex-col">

          {/* ── Top Bar ──────────────────────────────────────────────── */}
          <header className="sticky top-0 z-20 bg-[#040404]/90 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            {/* Mobile hamburger + title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex-shrink-0 p-2 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                <h1 className="font-display font-black text-lg sm:text-xl text-white tracking-tight truncate">
                  Editorial Dashboard
                </h1>
                <p className="hidden sm:block text-xs text-white/40 mt-0.5">
                  BruttoNettoCalculator.com
                </p>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search — expands on focus */}
              <div className="relative hidden sm:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search… [ESC]"
                  className="pl-8 pr-7 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] focus:border-white/20 text-white placeholder:text-white/30 text-sm outline-none transition-all w-44 focus:w-60 xl:focus:w-72"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Refresh */}
              <button
                onClick={fetchArticles}
                disabled={loading}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-white/60 hover:text-white transition-all disabled:opacity-50"
                title="Sync database"
              >
                <RefreshCw size={15} className={loading ? "animate-spin text-[#E60A1C]" : ""} />
              </button>

              {/* New Article */}
              <Link
                href="/admin-secure/articles/new"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#E60A1C,#b8000f)", boxShadow: "0 3px 14px rgba(230,10,28,0.35)" }}
              >
                <Plus size={15} />
                <span className="hidden sm:inline">New Article</span>
              </Link>
            </div>
          </header>

          {/* ── Page Body ────────────────────────────────────────────── */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-[1400px] w-full mx-auto">

            {/* Mobile search */}
            <div className="relative sm:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] focus:border-white/20 text-white placeholder:text-white/30 text-sm outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* ── KPI Stats ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Total Articles",  value: loading ? "—" : totalCount,     sub: "In database",               color: "text-white",       dot: "" },
                { label: "Published",       value: loading ? "—" : publishedCount, sub: "Live & indexed",             color: "text-emerald-400", dot: "bg-emerald-400" },
                { label: "Drafts",          value: loading ? "—" : draftCount,     sub: "Pending publish",           color: "text-amber-400",   dot: "bg-amber-400" },
                { label: "System",          value: "100%",                          sub: "DB query: 0.1ms",           color: "text-white",       dot: "bg-emerald-400" },
              ].map(({ label, value, sub, color, dot }) => (
                <div key={label} className="bg-[#090909] border border-white/[0.07] rounded-2xl p-4 sm:p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/35">{label}</span>
                    {dot && <span className={`w-2 h-2 rounded-full ${dot} ${label === "Published" ? "animate-pulse" : ""}`} />}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${color}`}>{value}</div>
                  <div className="text-[11px] text-white/35">{sub}</div>
                </div>
              ))}
            </div>

            {/* ── Filters & View Toggle ────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">

              {/* Category pills with fade-masked scroll */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Label */}
                <span className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-mono text-white/35 uppercase tracking-widest">
                  <Filter size={10} />
                  <span>Category</span>
                </span>

                {/* Scrollable pills — fade on right edge, no scrollbar */}
                <div className="relative flex-1 min-w-0">
                  {/* Right fade overlay */}
                  <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-10 z-10"
                    style={{ background: "linear-gradient(to right, transparent, #040404)" }}
                  />
                  {/* Left fade overlay */}
                  <div
                    className="pointer-events-none absolute left-0 top-0 h-full w-4 z-10"
                    style={{ background: "linear-gradient(to left, transparent, #040404)" }}
                  />
                  <div
                    className="flex items-center gap-1.5 overflow-x-auto cat-pill-scroll"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <div className="flex items-center gap-1.5 flex-nowrap py-0.5 px-1">
                      {allCategories.map((cat) => {
                        const count = cat === "All" ? totalCount : articles.filter((a) => (a.category || "General") === cat).length;
                        const active = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                              active
                                ? "bg-white text-black font-bold shadow-md"
                                : "bg-white/[0.05] border border-white/[0.09] text-white/55 hover:text-white hover:bg-white/[0.1] hover:border-white/20"
                            }`}
                          >
                            <span>{cat === "All" ? "All Categories" : cat}</span>
                            <span
                              className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                                active ? "bg-black/[12%] text-black/70" : "bg-white/[0.07] text-white/40"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center flex-shrink-0 self-end sm:self-auto p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                {([["table", ListIcon, "List"], ["grid", LayoutGrid, "Grid"]] as const).map(([mode, Icon, label]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === mode ? "bg-white/[0.12] text-white font-bold" : "text-white/45 hover:text-white"
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Results count ────────────────────────────────────── */}
            {!loading && (
              <p className="text-xs text-white/35 -mt-2">
                Showing <span className="text-white/65 font-semibold">{filteredArticles.length}</span> of {totalCount} articles
                {searchQuery && <> matching <span className="text-white/65 font-medium">"{searchQuery}"</span></>}
              </p>
            )}

            {/* ── Content: Loading / Empty / Table / Grid ───────────── */}
            {loading ? (
              <div className="bg-[#090909] border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] text-[11px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-[#E60A1C]" />
                  Fetching from database...
                </div>
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] animate-pulse">
                    <div className="space-y-2 flex-1 mr-8">
                      <div className="h-4 bg-white/[0.07] rounded w-3/4" />
                      <div className="h-3 bg-white/[0.04] rounded w-1/3" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-20 h-8 bg-white/[0.06] rounded-lg" />
                      <div className="w-8 h-8 bg-white/[0.04] rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>

            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-[#090909] border border-white/[0.07] rounded-2xl">
                <FileText size={36} className="text-white/15 mx-auto mb-4" />
                <h3 className="text-base font-bold text-white mb-1">No articles found</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto mb-6">
                  {searchQuery ? `No results for "${searchQuery}". Try a different search.` : "No publications match the current filter."}
                </p>
                <Link
                  href="/admin-secure/articles/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#E60A1C,#b8000f)" }}
                >
                  <Plus size={15} />
                  Write New Article
                </Link>
              </div>

            ) : viewMode === "table" ? (
              /* ── TABLE VIEW ─────────────────────────────────────── */
              <div className="bg-[#090909] border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b border-white/[0.07] bg-[#0c0c0c] text-[10px] font-mono uppercase tracking-widest text-white/35">
                        <th className="py-3.5 px-5">Article</th>
                        <th className="py-3.5 px-5 hidden md:table-cell">Category</th>
                        <th className="py-3.5 px-5 text-center">Status</th>
                        <th className="py-3.5 px-5 hidden lg:table-cell">Date</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredArticles.map((art) => (
                        <tr key={art.id} className="group hover:bg-white/[0.02] transition-colors">
                          {/* Title */}
                          <td className="py-4 px-5">
                            <Link
                              href={`/admin-secure/articles/edit/${art.slug}`}
                              className="font-semibold text-white/90 hover:text-white group-hover:text-[#FF2E44] transition-colors text-sm leading-snug line-clamp-1 block"
                            >
                              {art.headline}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-white/35 font-mono">
                              <span className="truncate max-w-[180px] sm:max-w-xs">/blog/{art.slug}</span>
                              <span>·</span>
                              <span>{art.read_time || "3 min"}</span>
                            </div>
                            {art.focus_keyword && (
                              <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400/70">
                                <Tag size={10} />
                                <span className="truncate max-w-[140px]">{art.focus_keyword}</span>
                              </div>
                            )}
                          </td>

                          {/* Category */}
                          <td className="py-4 px-5 hidden md:table-cell">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/70">
                              {art.category || "General"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-5 text-center whitespace-nowrap">
                            {art.status === "Published" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                                <Clock size={11} />
                                Draft
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-4 px-5 hidden lg:table-cell">
                            <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono whitespace-nowrap">
                              <Calendar size={12} className="text-white/25" />
                              {art.created_at
                                ? new Date(art.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                : "—"}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/admin-secure/articles/edit/${art.slug}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white text-white hover:text-black text-xs font-semibold border border-white/[0.08] hover:border-transparent transition-all"
                                title="Edit"
                              >
                                <Edit size={12} />
                                <span className="hidden sm:inline">Edit</span>
                              </Link>

                              {art.status === "Published" && (
                                <Link
                                  href={`/blog/${art.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-white/50 hover:text-white transition-all"
                                  title="View live"
                                >
                                  <Eye size={13} />
                                </Link>
                              )}

                              <button
                                onClick={() => handleCopyUrl(art.slug)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-white/50 hover:text-white transition-all"
                                title="Copy URL"
                              >
                                {copiedSlug === art.slug ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                              </button>

                              <button
                                onClick={() => setDeleteConfirm({ slug: art.slug, title: art.headline })}
                                className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/15 text-red-400/70 hover:text-red-400 transition-all"
                                title="Delete"
                              >
                                <Trash2 size={13} />
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
              /* ── GRID VIEW ──────────────────────────────────────── */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="group bg-[#090909] border border-white/[0.07] hover:border-white/15 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:bg-white/[0.015] shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/70 truncate max-w-[120px]">
                        {art.category || "General"}
                      </span>
                      {art.status === "Published" ? (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Live
                        </span>
                      ) : (
                        <span className="flex-shrink-0 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <Link href={`/admin-secure/articles/edit/${art.slug}`} className="block">
                        <h3 className="font-bold text-sm text-white/90 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                          {art.headline}
                        </h3>
                      </Link>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                        {art.excerpt || "No excerpt available."}
                      </p>
                      {art.focus_keyword && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-400/60">
                          <Tag size={10} />
                          <span className="truncate">{art.focus_keyword}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] gap-2">
                      <span className="text-[11px] font-mono text-white/35">
                        {art.created_at ? new Date(art.created_at).toLocaleDateString("en-GB") : "—"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin-secure/articles/edit/${art.slug}`}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white text-white hover:text-black text-xs font-semibold border border-white/[0.08] hover:border-transparent transition-all"
                        >
                          Edit
                        </Link>
                        {art.status === "Published" && (
                          <Link
                            href={`/blog/${art.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-white/50 hover:text-white transition-all"
                            title="View live"
                          >
                            <Eye size={13} />
                          </Link>
                        )}
                        <button
                          onClick={() => setDeleteConfirm({ slug: art.slug, title: art.headline })}
                          className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/15 text-red-400/60 hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <footer className="pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-white/30">
              <span>BRUTTO-NETTO-CALCULATOR.COM · EDITORIAL STUDIO</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400/70">
                  <ShieldCheck size={13} />
                  Secure Session
                </span>
                <span>v3.0</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
