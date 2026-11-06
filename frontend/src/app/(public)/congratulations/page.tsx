"use client";

import React, { useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  PackageCheck,
  Heart,
  Share2,
  Calendar,
  Building2,
  PartyPopper
} from "lucide-react";
import { ConfettiCanvas } from "@/components/ConfettiCanvas";

function CongratulationsContent() {
  const searchParams = useSearchParams();
  const itemTitle = searchParams.get("title") || "Campus Belonging";
  const studentName = searchParams.get("name") || "Verified Student";
  const rollNumber = searchParams.get("roll") || "";
  const location = searchParams.get("loc") || "Campus Custody Desk";

  const triggerBurstRef = useRef<(() => void) | null>(null);
  const [burstCount, setBurstCount] = useState(1);

  const handleShootConfetti = () => {
    if (triggerBurstRef.current) {
      triggerBurstRef.current();
      setBurstCount((prev) => prev + 1);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10 sm:py-14 overflow-hidden">
      {/* 60FPS Flying Confetti Canvas */}
      <ConfettiCanvas
        active={true}
        onBurstRef={(burstFn) => {
          triggerBurstRef.current = burstFn;
        }}
      />

      <div className="relative z-10 max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 text-center animate-in zoom-in-95 duration-300">
        
        {/* Celebration Header Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-6 shadow-xs">
          <PartyPopper className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>Campus Item Successfully Recovered!</span>
        </div>

        {/* Big Trophy / Reunited Badge with ambient glow */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />
          <div className="relative w-22 h-22 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 text-white flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
            <PackageCheck className="w-12 h-12 stroke-[2.2]" />
          </div>
        </div>

        {/* Headline & Congratulations message */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Congratulations!
        </h1>
        <p className="text-base sm:text-lg font-bold text-emerald-700 mb-2">
          Your lost item has safely made its way home.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
          Nothing beats the relief of recovering misplaced belongings. Thank you for relying on FindBack and our campus community&apos;s honesty.
        </p>

        {/* Digital Handover & Reunification Certificate Card */}
        <div className="text-left bg-gradient-to-b from-[#F4F7FB] to-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-200/90 shadow-sm mb-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
              OFFICIAL HANDOVER RECEIPT
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDate}</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Reunited Belonging
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {itemTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                Custody Status
              </span>
              <p className="font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Returned to Rightful Owner</span>
              </p>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                Handover Location
              </span>
              <p className="font-semibold text-slate-800 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{location}</span>
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Campus Authority:</span>
            <span className="font-semibold text-slate-700 font-mono">
              HERITAGE IT SECURITY DESK ✓
            </span>
          </div>
        </div>

        {/* Interactive Confetti & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <button
            onClick={handleShootConfetti}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Shoot More Confetti! 🎉</span>
          </button>

          <Link
            href="/browse?tab=returned"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>View Return Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Secondary Navigation */}
        <div className="flex items-center justify-center space-x-4 text-xs font-semibold text-slate-500">
          <Link href="/my-reports" className="hover:text-slate-900 hover:underline">
            My Reports
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-slate-900 hover:underline">
            Back to Home
          </Link>
        </div>

        {/* Campus Community Gratitude Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          <span>Made for honest campus citizens of Heritage Institute of Technology</span>
        </div>

      </div>
    </div>
  );
}

export default function CongratulationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-findback-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CongratulationsContent />
    </Suspense>
  );
}
