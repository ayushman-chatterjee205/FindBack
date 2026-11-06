"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  Building2
} from "lucide-react";
import { CustodyCrateVisual } from "@/components/CustodyCrateVisual";

function SignedOutContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "expired";

  const reasonTitle = 
    reason === "expired"
      ? "Session Expired for Security"
      : reason === "manual"
      ? "Signed Out Successfully"
      : "Session Closed";

  const reasonDescription =
    reason === "expired"
      ? "For your protection and to secure campus custody records, FindBack sessions automatically conclude after 7 days or periods of inactivity on shared computers."
      : "You have securely signed out of your campus account. All your active reports and claims are stored safely.";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 bg-[#F4F4F1]">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-10 text-center animate-in fade-in duration-300">
        
        {/* Security / Sign Out Badge */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-xs">
            <Lock className="w-9 h-9 text-slate-700 stroke-[2.2]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <Clock className="w-4 h-4 stroke-[2.4]" />
          </div>
        </div>

        {/* Headings */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
          Campus Authentication Notice
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {reasonTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          {reasonDescription}
        </p>

        {/* Security Reassurance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
          <div className="p-3.5 rounded-2xl bg-[#F4F7FB] border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Records Safe</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Your lost item reports and verified matches remain safely stored in the custody database.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F7FB] border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs mb-1">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Lab PC Protected</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Automatic sign out prevents other students from accessing your account on shared campus computers.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 max-w-sm mx-auto">
          <Link
            href="/login"
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Return to Home as Guest</span>
          </Link>
        </div>

        {/* Footer Support Note */}
        <p className="text-[11px] text-slate-400 mt-6">
          Having trouble signing in? Use your official campus email (<span className="text-slate-600 font-medium">@heritageit.edu</span>).
        </p>

      </div>
    </div>
  );
}

export default function SignedOutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-findback-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignedOutContent />
    </Suspense>
  );
}
