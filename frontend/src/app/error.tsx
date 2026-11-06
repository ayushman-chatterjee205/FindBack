"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, HelpCircle, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error caught by root boundary:", error);
  }, [error]);

  const isNetworkError =
    error.message?.toLowerCase().includes("failed to fetch") ||
    error.message?.toLowerCase().includes("network") ||
    error.message?.toLowerCase().includes("conn");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#F4F4F1]">
      {/* Main Split Container Card (Matching Sign In Page Size and Structure Exactly) */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* ================================================================= */}
        {/* LEFT / TOP DECORATIVE BRAND PANEL                                 */}
        {/* ================================================================= */}
        <div className="relative md:w-5/12 lg:w-1/2 bg-gradient-to-br from-[#1E3A5F] via-[#234E70] to-[#0F172A] p-6 sm:p-10 flex flex-col items-center justify-between text-center select-none overflow-hidden shrink-0">
          
          {/* Subtle Dynamic Ambient Glow Circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-rose-500/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          {/* Large Stylized Translucent Error Code Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
            <span className="text-8xl sm:text-9xl font-black font-mono tracking-tighter text-white/[0.04] transform -rotate-12 translate-y-2">
              #CRASH
            </span>
          </div>

          {/* Top Tagline */}
          <div className="relative z-10 pt-2 sm:pt-4">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-rose-200 uppercase drop-shadow-xs">
              Application Boundary
            </span>
          </div>

          {/* Bottom Brand Title & Subtitle */}
          <div className="relative z-10 pb-2 sm:pb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.18em] text-white drop-shadow-md">
              FINDBACK
            </h2>
            <p className="text-[11px] sm:text-xs text-white/70 font-medium tracking-wide mt-1 max-w-[240px] mx-auto">
              Campus Custody & Real-Time Item Recovery
            </p>
          </div>

          {/* Organic Wave Divider: On Mobile (bottom) */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none" 
              className="w-full h-8 text-white fill-current"
            >
              <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" />
            </svg>
          </div>

          {/* Organic Wave Divider: On Desktop (right edge) */}
          <div className="hidden md:block absolute top-0 -right-[1px] bottom-0 w-10 lg:w-12 overflow-hidden pointer-events-none z-10">
            <svg 
              viewBox="0 0 60 600" 
              preserveAspectRatio="none" 
              className="w-full h-full text-white fill-current"
            >
              <path d="M60,0 C20,150 50,300 15,450 C0,520 25,580 60,600 L60,0 Z" />
            </svg>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT CONTENT PANEL (Clean Form/Card Layout matching Sign In)     */}
        {/* ================================================================= */}
        <div className="md:w-7/12 lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Top Back Link */}
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Return to Home</span>
              </Link>
            </div>

            {/* Error Header & Badge */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>{isNetworkError ? "Connection Interrupted" : "Runtime Exception"}</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  #BOUNDARY
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isNetworkError
                  ? "Cannot Reach Campus Service"
                  : "Something Went Off Track"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {isNetworkError
                  ? "We couldn't connect to the FindBack backend API. Ensure the backend server is running on port 8000 or check campus network connectivity."
                  : error.message ||
                    "An unexpected error occurred while rendering this view. Our campus diagnostics have logged the occurrence."}
              </p>
            </div>

            {/* Digest / Debug Note if available */}
            {error.digest && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 mb-4">
                Reference ID: {error.digest}
              </div>
            )}

            {/* Recommended Next Steps Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-findback-primary" />
                <span>Troubleshooting Steps:</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="text-findback-primary font-bold mt-0.5">•</span>
                  <span>Click "Try Again" below to safely remount the component.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-findback-primary font-bold mt-0.5">•</span>
                  <span>If testing locally, verify both frontend (port 3000) and backend (port 8000) are healthy.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-findback-primary font-bold mt-0.5">•</span>
                  <span>Your existing reports and items remain securely preserved in the database.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-6">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-findback-primary text-white text-xs font-semibold hover:bg-findback-primary-hover shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Heritage Institute of Technology Campus Edition · Diagnostics Boundary
          </div>

        </div>
      </div>
    </div>
  );
}
