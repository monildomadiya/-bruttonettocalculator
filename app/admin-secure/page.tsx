"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink, Eye, Clock, Tag, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface Article {
  id: number;
  headline: string;
  slug: string;
  category: string;
  status: string;
  read_time: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!confirm(`Möchten Sie den Artikel "${title}" wirklich löschen?`)) return;
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

  return (
    <AdminAuthGuard>
      <main className="min-h-screen bg-[#060606] text-white py-12 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/15 border border-[#E60A1C]/30 text-[#FF2E44] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={14} />
                <span>Admin Center & MySQL Datenbank</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight">
                Blog & Ratgeber <span className="text-gradient-accent">Dashboard</span>
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Verwalten Sie hier alle Artikel, SEO-Einstellungen und Cloudinary-Bilder.
              </p>
            </div>

            <Link
              href="/admin-secure/articles/new"
              className="px-6 py-3.5 rounded-full font-extrabold text-white text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 4px 20px rgba(230,10,28,0.45)" }}
            >
              <Plus size={18} />
              <span>✨ + Draft New Article</span>
            </Link>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-8 p-5 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <span className="text-sm font-semibold text-red-300">{error}</span>
              </div>
              <button onClick={fetchArticles} className="px-4 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300">
                Erneut versuchen
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-24 bg-[#0e0e0e] border border-white/10 rounded-3xl">
              <div className="w-10 h-10 border-4 border-[#E60A1C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-sm font-semibold">Lade Artikel aus der MySQL Datenbank...</p>
            </div>
          ) : articles.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24 bg-[#0e0e0e] border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
                <Tag size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Keine Artikel gefunden</h3>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
                Starten Sie direkt, indem Sie Ihren ersten Ratgeber mit unserem Rich-Editor erstellen.
              </p>
              <Link
                href="/admin-secure/articles/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 font-bold text-sm transition-all"
              >
                <Plus size={16} />
                <span>Ersten Beitrag erstellen</span>
              </Link>
            </div>
          ) : (
            /* Articles Table */
            <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-extrabold uppercase tracking-wider text-white/50">
                      <th className="py-4 px-6">Titel & Slug</th>
                      <th className="py-4 px-6">Kategorie</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Lesezeit</th>
                      <th className="py-4 px-6">Erstellt am</th>
                      <th className="py-4 px-6 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white group-hover:text-[#FF2E44] transition-colors">
                            {art.headline}
                          </div>
                          <div className="text-xs text-white/40 font-mono mt-0.5">
                            /blog/{art.slug}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-white/80">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                            {art.category || "Allgemein"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {art.status === "Published" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                              <CheckCircle size={12} />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-extrabold">
                              <Clock size={12} />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-white/60 text-xs font-medium">
                          {art.read_time || "3 min read"}
                        </td>
                        <td className="py-4 px-6 text-white/50 text-xs">
                          {art.created_at ? new Date(art.created_at).toLocaleDateString("de-DE") : "Heute"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {art.status === "Published" && (
                              <Link
                                href={`/blog/${art.slug}`}
                                target="_blank"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                title="Live ansehen"
                              >
                                <ExternalLink size={15} />
                              </Link>
                            )}
                            <Link
                              href={`/admin-secure/articles/edit/${art.slug}`}
                              className="p-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 transition-all flex items-center gap-1.5 px-3 text-xs font-bold"
                              title="Bearbeiten"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </Link>
                            <button
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
        </div>
      </main>
    </AdminAuthGuard>
  );
}
