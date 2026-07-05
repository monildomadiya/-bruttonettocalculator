"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleEditor from "@/components/admin/ArticleEditor";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function NewArticlePage() {
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

          {/* Editor */}
          <ArticleEditor isEdit={false} />
        </div>
      </main>
    </AdminAuthGuard>
  );
}
