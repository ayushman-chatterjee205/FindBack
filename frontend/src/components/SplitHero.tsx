"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Package, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  PlusCircle,
  Clock
} from "lucide-react";
import { CustodyCrateVisual } from "./CustodyCrateVisual";
import { useAuth } from "@/context/AuthContext";
import { SignInRequiredModal } from "./SignInRequiredModal";

interface SplitHeroProps {
  userFullName?: string;
  isStaff?: boolean;
}

export const SplitHero: React.FC<SplitHeroProps> = ({ userFullName, isStaff }) => {
  const { user } = useAuth();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[#215194]">
      {/* ==================================================================== */}
      {/* UPPER ATMOSPHERIC SKY BACKDROP (WITH HORIZON ARC)                    */}
      {/* ==================================================================== */}
      <div className="relative w-full bg-gradient-to-b from-[#215194] via-[#3572C6] to-[#BAE6FD]/85 pt-10 sm:pt-14 pb-20 sm:pb-28 px-4 sm:px-6">
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center animate-hero-content hero-content-hover">
          {/* Top Tagline / Context Pill (Matching "The Global Operating Account") */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/90 shadow-xs mb-6 sm:mb-8">
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              The Campus Custody & Recovery Network
            </span>
          </div>

          {/* ================================================================ */}
          {/* THE SPLIT HERO CORE: [ LEFT HEADLINE ] [ CRATE ] [ RIGHT HEADLINE] */}
          {/* ================================================================ */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-10 my-2">
            
            {/* Left Headline (Right-aligned on desktop) */}
            <div className="flex-1 text-center md:text-right order-1 md:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08] drop-shadow-xs">
                Lost on <br className="hidden md:inline" />
                <span className="text-[#1E293B]">campus.</span>
              </h1>
            </div>

            {/* Central Iconic 3D Custody Crate (straddling horizon) */}
            <div className="shrink-0 order-2 md:order-2 my-2 sm:my-0 z-20">
              <CustodyCrateVisual />
            </div>

            {/* Right Headline (Left-aligned on desktop) */}
            <div className="flex-1 text-center md:text-left order-3 md:order-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08] drop-shadow-xs">
                Found in <br className="hidden md:inline" />
                <span className="text-findback-primary">minutes.</span>
              </h1>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* HORIZON CURVE (Gentle parabolic dip matching reference image)     */}
        {/* ================================================================ */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-10 sm:h-16 md:h-20 text-[#F4F7FB]"
          >
            <path
              d="M0,0 C480,75 960,75 1440,0 L1440,90 L0,90 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* LOWER SECTION: SUBTITLE, CTA PILL & 4-COLUMN VALUE PROPOSITIONS      */}
      {/* Matches the subtle cool-tinted background (#F4F7FB)                  */}
      {/* ==================================================================== */}
      <div className="relative bg-[#F4F7FB] pt-2 sm:pt-4 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Centered Descriptive Paragraph (matching reference format) */}
          <p className="text-sm sm:text-base md:text-lg text-[#475569] font-normal leading-relaxed max-w-2xl px-2">
            Your campus moves fast. Misplaced belongings shouldn&apos;t slow you down.
            Real-time multi-signal AI matches student reports to verified custody lockers
            across 5 campus blocks, with fraud-proof dynamic QR handovers.
          </p>

          {/* Primary Action Button (Clean pill button matching reference) */}
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3">
            {/* Primary Pill Button */}
            <button
              onClick={() => {
                if (!user) {
                  setIsSignInModalOpen(true);
                  return;
                }
                setIsReportModalOpen(true);
              }}
              className="px-7 py-3 rounded-full bg-[#0F172A] text-white hover:bg-[#1E293B] text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span>Report an Item</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Catalog Pill Button */}
            {user ? (
              <Link
                href="/browse"
                className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-findback-border shadow-xs hover:border-slate-300 transition-all flex items-center space-x-2"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Browse Custody Registry</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignInModalOpen(true)}
                className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-findback-border shadow-xs hover:border-slate-300 transition-all flex items-center space-x-2"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Browse Custody Registry</span>
              </button>
            )}

            {/* Quick Returned Archive link */}
            {user ? (
              <Link
                href="/browse?tab=returned"
                className="px-5 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 shadow-xs transition-all flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Returned Archive</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignInModalOpen(true)}
                className="px-5 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 shadow-xs transition-all flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Returned Archive</span>
              </button>
            )}
          </div>

          {/* Logged in persona or guest helper badge */}
          {userFullName ? (
            <p className="text-xs text-slate-500 font-medium mt-3">
              Logged in as <span className="font-semibold text-slate-700">{userFullName}</span> {isStaff ? "(Campus Staff Desk)" : "(Student Account)"}
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium mt-3">
              Campus Guest Mode · <Link href="/login" className="font-semibold text-findback-primary hover:underline">Sign in</Link> to report items or file custody claims
            </p>
          )}
        </div>

        {/* ================================================================ */}
        {/* 4-COLUMN VALUE PROPOSITION ROW (Matching 4 columns in reference)  */}
        {/* ================================================================ */}
        <div className="max-w-6xl mx-auto mt-12 sm:mt-16 pt-10 border-t border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Column 1: Campus Coverage */}
            <div className="feature-magnify-card flex flex-col items-start sm:items-center text-left sm:text-center p-4 rounded-2xl border border-transparent group cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-findback-primary transition-colors mb-1">
                5 Campus Blocks Covered
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ICT, CME, Central Block, Library, and Canteen with 6-floor custody zone mapping.
              </p>
            </div>

            {/* Column 2: AI Multi-Signal Engine */}
            <div className="feature-magnify-card flex flex-col items-start sm:items-center text-left sm:text-center p-4 rounded-2xl border border-transparent group cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-findback-primary transition-colors mb-1">
                Multi-Signal AI Matching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dense semantic text, visual feature vectors, and spatio-temporal decay scoring.
              </p>
            </div>

            {/* Column 3: Anti-Fraud QR Handover */}
            <div className="feature-magnify-card flex flex-col items-start sm:items-center text-left sm:text-center p-4 rounded-2xl border border-transparent group cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-300">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-findback-primary transition-colors mb-1">
                Anti-Fraud QR Handover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confidential distinguishing marks & single-use 6-digit OTP release tokens.
              </p>
            </div>

            {/* Column 4: Public Return Archive */}
            <div className="feature-magnify-card flex flex-col items-start sm:items-center text-left sm:text-center p-4 rounded-2xl border border-transparent group cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-findback-primary transition-colors mb-1">
                Verified Return Archive
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public custody release registry with verified student roll, date, and officer timestamp.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* REPORT SELECTION MODAL DIALOG                                        */}
      {/* ==================================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-findback-border shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-findback-border mb-6">
              <div>
                <h3 className="text-lg font-bold text-findback-text">Choose Report Action</h3>
                <p className="text-xs text-findback-muted mt-0.5">What would you like to log with campus security?</p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Option 1: Lost */}
              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false);
                  if (!user) {
                    setIsSignInModalOpen(true);
                  } else {
                    window.location.href = "/report-lost";
                  }
                }}
                className="w-full text-left flex items-center justify-between p-4 rounded-2xl border-2 border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 transition-all group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 group-hover:scale-105 group-hover:bg-orange-200/80 transition-all flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      I Lost Something
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">Log missing belongings to trigger instant AI matching.</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Option 2: Found */}
              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false);
                  if (!user) {
                    setIsSignInModalOpen(true);
                  } else {
                    window.location.href = "/report-found";
                  }
                }}
                className="w-full text-left flex items-center justify-between p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-400 transition-all group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">I Found Something</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Register a found item into campus custody locker bins.</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Required Modal */}
      <SignInRequiredModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        title="Sign In to Report Items"
        description="To submit a lost item report or register found custody property, please sign in with your campus account."
        redirectUrl="/report-lost"
      />
    </section>
  );
};
