"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WifiOff, X } from "lucide-react";

export const OfflineDetector: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const offline = typeof navigator !== "undefined" && !navigator.onLine;
      setIsOffline(offline);
      if (!offline) setDismissed(false);
    };

    updateStatus();

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[99999] w-[92%] max-w-md animate-in slide-in-from-top-3 duration-200 pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between text-xs gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <p className="truncate text-[11px] text-slate-200">
            <strong className="text-white font-semibold">No internet connection.</strong> Campus network may be offline.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/offline"
            className="px-2.5 py-1 rounded-lg bg-white text-slate-900 font-bold text-[10px] hover:bg-slate-100 transition-colors"
          >
            Troubleshoot
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
