"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { CustodyCrateVisual } from "@/components/CustodyCrateVisual";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Shield, 
  ShieldCheck,
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Check
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login, user, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "staff">("student");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTrialFeedback, setActiveTrialFeedback] = useState<string | null>(null);

  // If already logged in, redirect to destination
  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectUrl);
    }
  }, [isLoading, user, router, redirectUrl]);

  // Quick fill trial credentials
  const fillTrialCredentials = (trialType: "student" | "staff" | "officer", autoSubmit = false) => {
    setErrorMessage(null);
    if (trialType === "student") {
      setEmail("student@campus.edu");
      setPassword("student1234");
      setRole("student");
      setActiveTrialFeedback("Filled Student Demo: student@campus.edu / student1234 (Student View)");
      if (autoSubmit) {
        handleDirectLogin("student@campus.edu", "student", "student1234");
      }
    } else if (trialType === "staff") {
      setEmail("guard@campus.edu");
      setPassword("guard1234");
      setRole("staff");
      setActiveTrialFeedback("Filled Staff Demo: guard@campus.edu / guard1234 (Staff View)");
      if (autoSubmit) {
        handleDirectLogin("guard@campus.edu", "staff", "guard1234");
      }
    } else {
      setEmail("officer@campus.edu");
      setPassword("officer1234");
      setRole("staff");
      setActiveTrialFeedback("Filled Security Officer: officer@campus.edu / officer1234 (Dual Access: Student & Staff)");
      if (autoSubmit) {
        handleDirectLogin("officer@campus.edu", "staff", "officer1234");
      }
    }
  };

  const handleDirectLogin = async (loginEmail: string, loginRole: "student" | "staff", loginPass: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await login(loginEmail, loginRole, loginPass);
      if (res && !res.success) {
        setErrorMessage(res.message || "Account does not exist.");
        setIsSubmitting(false);
        return;
      }
      router.push(redirectUrl);
    } catch {
      setErrorMessage("Unable to connect to authentication service. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await login(email, role, password);
      if (res && !res.success) {
        setErrorMessage(res.message || "Account does not exist.");
        setIsSubmitting(false);
        return;
      }
      router.push(redirectUrl);
    } catch {
      setErrorMessage("An error occurred during sign in. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#F4F4F1]">
      {/* Main Split Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* ================================================================= */}
        {/* LEFT / TOP DECORATIVE BRAND PANEL (Based on Template)             */}
        {/* ================================================================= */}
        <div className="relative md:w-5/12 lg:w-1/2 bg-gradient-to-br from-[#1E3A5F] via-[#234E70] to-[#0F172A] p-6 sm:p-10 flex flex-col items-center justify-between text-center select-none overflow-hidden shrink-0">
          
          {/* Subtle Ambient Glow Circles in Background */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-teal-400/15 blur-2xl pointer-events-none" />

          {/* Top Tagline */}
          <div className="relative z-10 pt-2 sm:pt-4">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-cyan-200 uppercase drop-shadow-xs">
              Welcome To
            </span>
          </div>

          {/* Central Circular Badge with Custody Crate (Replacing the rocket from template) */}
          <div className="relative z-10 my-6 sm:my-8 flex items-center justify-center">
            {/* Soft Outer Ring Pulse */}
            <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] group">
              {/* Inner Glowing Disc */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-white/15 to-white/5 border border-white/25 flex items-center justify-center overflow-visible">
                <CustodyCrateVisual sizeClass="w-32 sm:w-40 md:w-44" />
              </div>
            </div>
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
        {/* RIGHT FORM PANEL (Clean White Form with Demo Pills)               */}
        {/* ================================================================= */}
        <div className="md:w-7/12 lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your campus credentials to access your account
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs mb-4 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Active Trial Feedback Toast */}
            {activeTrialFeedback && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-4 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{activeTrialFeedback}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Toggle Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === "student"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("staff")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === "staff"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                    <span>Campus Staff</span>
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  College Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="yourname.dept@heritageit.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#234E70] focus:ring-2 focus:ring-[#234E70]/10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#234E70] focus:ring-2 focus:ring-[#234E70]/10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#234E70] border-slate-300 focus:ring-[#234E70]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    alert("To reset password, contact campus security administration at custody@campus.edu or use a demo account.");
                  }}
                  className="text-xs font-semibold text-[#234E70] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Pill Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Don't have an account link */}
            <div className="text-center mt-4 text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#234E70] hover:underline ml-1"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* =============================================================== */}
          {/* DEMO / TRIAL CREDENTIALS TRAY (Kept for easy grading & testing) */}
          {/* =============================================================== */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Quick Demo Accounts</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Click to fill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillTrialCredentials("student")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50/60 hover:border-blue-300 transition-all text-left group"
                title="student@campus.edu / student1234"
              >
                <div className="text-[11px] font-bold text-slate-800 truncate group-hover:text-blue-700">
                  🎓 Student
                </div>
                <div className="text-[9px] text-slate-500 font-mono truncate">
                  student@campus
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillTrialCredentials("staff")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-teal-50/60 hover:border-teal-300 transition-all text-left group"
                title="guard@campus.edu / guard1234"
              >
                <div className="text-[11px] font-bold text-slate-800 truncate group-hover:text-teal-700">
                  🛡️ Staff
                </div>
                <div className="text-[9px] text-slate-500 font-mono truncate">
                  guard@campus
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillTrialCredentials("officer")}
                className="p-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 hover:border-amber-400 transition-all text-left group"
                title="officer@campus.edu / officer1234 (Dual Access)"
              >
                <div className="text-[11px] font-bold text-amber-900 truncate flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Officer</span>
                </div>
                <div className="text-[9px] text-amber-700 font-mono truncate">
                  ★ Dual View
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-findback-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}