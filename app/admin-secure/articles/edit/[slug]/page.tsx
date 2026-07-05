"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import ArticleEditor from "@/components/admin/ArticleEditor";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { Article } from "@/lib/db";

export default function EditArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${params.slug}`);
        const data = await res.json();
        if (data.success && data.article) {
          setArticle(data.article);
        } else {
          setError(data.error || "Artikel nicht gefunden.");
        }
      } catch (err: any) {
        setError("Netzwerkfehler beim Laden.");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [params.slug]);

  return (
    <AdminAuthGuard>
      <main className="min-h-screen bg-[#050505] text-white py-10 sm:py-16 px-3.5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Back link */}
          <Link
            href="/admin-secure"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Zurück zum Dashboard</span>
          </Link>

          {loading ? (
            <div className="text-center py-24 bg-[#0a0a0a] border border-white/10 rounded-3xl">
              <Loader2 size={32} className="animate-spin text-[#E60A1C] mx-auto mb-4" />
              <p className="text-white/60 text-sm">Lade Artikeldaten aus MySQL...</p>
            </div>
          ) : error || !article ? (
            <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/30 text-center">
              <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-red-400 mb-2">{error || "Beitrag nicht vorhanden"}</h3>
              <Link
                href="/admin-secure"
                className="inline-block mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm"
              >
                Zum Admin Dashboard
              </Link>
            </div>
          ) : (
            <ArticleEditor initialArticle={article} isEdit={true} />
          )}
        </div>
      </main>
    </AdminAuthGuard>
  );
}
