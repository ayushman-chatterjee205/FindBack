"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CustodyCrateVisual } from "@/components/CustodyCrateVisual";
import { 
  Mail, 
  Lock, 
  User, 
  Hash, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [role, setRole] = useState<"student" | "staff">("student");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Domain restriction: Matches backend allowed domains (heritageit.edu or campus.edu)
    const isAllowedDomain = normalizedEmail.endsWith("@heritageit.edu");
    if (!isAllowedDomain) {
      setErrorMessage("Please register using official college email only (@heritageit.edu).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          full_name: fullName.trim(),
          roll_number: rollNumber.trim() || undefined,
          role,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setErrorMessage(
          errorData.detail || "Registration failed. Please register using college email only (@heritageit.edu or @campus.edu)."
        );
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Account created successfully! Authenticating your session...");
      
      // Auto login with new credentials
      const loginRes = await login(normalizedEmail, role, password);
      if (loginRes.success) {
        router.push("/");
      } else {
        setErrorMessage(loginRes.message || "Account created, but sign-in failed. Please login manually.");
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage("Unable to connect to authentication server. Please ensure the backend is running on port 8000.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#F4F4F1]">
      {/* Main Split Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* ================================================================= */}
        {/* LEFT / TOP DECORATIVE BRAND PANEL (Matching Sign In)              */}
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

          {/* Central Circular Badge with Custody Crate */}
          <div className="relative z-10 my-6 sm:my-8 flex items-center justify-center">
            <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] group">
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
        {/* RIGHT FORM PANEL (Create Account Form)                            */}
        {/* ================================================================= */}
        <div className="md:w-7/12 lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Register with your campus email to track and recover belongings
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs mb-4 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-4 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Role Toggle Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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

              {/* Full Name Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#234E70] focus:ring-2 focus:ring-[#234E70]/10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  College Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="yourname.dept@heritageit.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#234E70] focus:ring-2 focus:ring-[#234E70]/10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Only official college emails (<span className="font-semibold text-slate-700">@heritageit.edu</span>) are permitted.
                </p>
              </div>

              {/* Roll Number / Campus ID */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {role === "student" ? "Roll Number / Student ID" : "Staff ID Number"}
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder={role === "student" ? "e.g. 21051234" : "e.g. SEC-8801"}
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#234E70] focus:ring-2 focus:ring-[#234E70]/10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#234E70] focus:ring-2 focus:ring-[#234E70]/10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-700 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-2"
              >
                {isSubmitting ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Already have an account link */}
            <div className="text-center mt-4 text-xs text-slate-500">
              Already have a campus account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#234E70] hover:underline ml-1"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Security & Reassurance Tag */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>• College identity verification</span>
            <span>• Anti-fraud custody tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
}