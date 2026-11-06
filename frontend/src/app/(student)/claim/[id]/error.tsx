"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";

export default function ClaimError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Claim Page Encountered Error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl border border-findback-border p-8 shadow-card space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-findback-text">
          Unable to Load Ownership Challenge
        </h2>
        <p className="text-xs text-findback-muted leading-relaxed">
          The requested custody item record may have already been claimed, or network communication was temporarily disrupted.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Challenge</span>
          </button>
          <Link
            href="/browse"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium text-findback-muted hover:text-findback-text"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
