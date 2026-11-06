"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { PackageX, RefreshCw, Home, Search, ShieldAlert } from "lucide-react";

export default function BrowseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Browse Catalog Error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl border border-findback-border p-8 sm:p-10 shadow-card">
        {/* Visual Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-status-lost mx-auto mb-5">
          <PackageX className="w-8 h-8 stroke-[1.8]" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-status-lost bg-status-lost-bg px-2.5 py-1 rounded-full">
          Catalog Sync Error
        </span>

        <h1 className="text-2xl font-bold text-findback-text mt-4 mb-2">
          Unable to Load Campus Custody Registry
        </h1>

        <p className="text-xs sm:text-sm text-findback-muted leading-relaxed max-w-md mx-auto mb-6">
          We encountered an issue synchronizing the found items database. This may happen if the backend server is restarting or if network connectivity is intermittent.
        </p>

        {/* Retry & Alternatives */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-findback-primary text-white text-xs font-semibold hover:bg-findback-primary-hover shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Custody Registry</span>
          </button>

          <Link
            href="/report-lost"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-findback-sand text-findback-text text-xs font-semibold hover:bg-gray-200 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-findback-accent" />
            <span>File a Lost Item Report Instead</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-findback-border flex items-center justify-between text-xs text-findback-muted">
          <Link href="/" className="hover:text-findback-text inline-flex items-center space-x-1">
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-findback-accent" />
            <span>Physical desks remain open for walk-in inquiries</span>
          </span>
        </div>
      </div>
    </div>
  );
}
