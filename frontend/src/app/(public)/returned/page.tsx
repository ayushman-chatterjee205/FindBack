"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReturnedRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/browse?tab=returned");
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-xs text-findback-muted">Loading Returned Items Archive...</p>
    </div>
  );
}
