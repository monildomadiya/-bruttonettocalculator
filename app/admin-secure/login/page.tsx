"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin-secure");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D] flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-black/40" />
    </div>
  );
}
