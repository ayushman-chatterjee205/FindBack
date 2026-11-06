"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  WifiOff,
  ServerCrash,
  Clock,
  ArrowLeft,
  Home,
  FileQuestion,
  HelpCircle,
  RefreshCw,
} from "lucide-react";

interface ErrorConfig {
  code: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  glowColor: string;
  actionText: string;
  actionHref: string;
  tips: string[];
}

const ERROR_CONFIGS: Record<string, ErrorConfig> = {
  "403": {
    code: "403",
    badge: "Access Denied • Role Restriction",
    title: "Authorization Required",
    description:
      "This section is restricted based on your campus account role. Student accounts cannot access the staff custody console, and standard staff cannot access student view. Only Campus Security Officers hold dual access clearance.",
    icon: ShieldAlert,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
    glowColor: "from-amber-400/20 to-orange-500/10",
    actionText: "Return to Safe Dashboard",
    actionHref: "/",
    tips: [
      "If you are a student, your features are in 'Home', 'Search Items', and 'My Reports'.",
      "If you are staff, access 'Custody Inventory', 'Verify Claims', and 'Handover Console'.",
      "Need access to both perspectives? Sign in with Campus Security Officer credentials.",
    ],
  },
  "404": {
    code: "404",
    badge: "Not Found • Missing Record",
    title: "Item or Page Not Located",
    description:
      "We couldn't locate the item, claim, or page you were looking for. The item may have already been claimed and returned to its owner, or the URL may be incorrect.",
    icon: FileQuestion,
    iconColor: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-200",
    glowColor: "from-cyan-400/20 to-sky-500/10",
    actionText: "Browse Current Custody Items",
    actionHref: "/browse",
    tips: [
      "Check the public catalog to see all active unclaimed items.",
      "File a lost report to be notified automatically when a matching item arrives.",
      "Visit the physical campus custody desk at Central Block Vault (Bin #E-04).",
    ],
  },
  "500": {
    code: "500",
    badge: "Server Error • Custody Core",
    title: "Campus Backend Disconnected",
    description:
      "An unexpected server error occurred while processing your request. The database or AI embedding engine may be undergoing scheduled maintenance or restarting.",
    icon: ServerCrash,
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50 border-rose-200",
    glowColor: "from-rose-500/20 to-red-500/10",
    actionText: "Try Again",
    actionHref: "/",
    tips: [
      "Wait 10-15 seconds and refresh the page.",
      "Verify that the backend service is running on port 8000.",
      "Your submitted reports are safely stored in the persistent database once received.",
    ],
  },
  network: {
    code: "OFFLINE",
    badge: "Network Offline • Connection Dropped",
    title: "No Internet or Campus Wi-Fi",
    description:
      "Your device appears to have lost its connection to the network. Campus basement areas and thick lab walls can sometimes interrupt Wi-Fi signals.",
    icon: WifiOff,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    glowColor: "from-blue-500/20 to-indigo-500/10",
    actionText: "Check Connection & Reload",
    actionHref: "/browse",
    tips: [
      "Reconnect to the campus Wi-Fi network (e.g. Eduroam or HIT-Student).",
      "If you have an approved pickup pass, you can present your saved offline pass directly.",
      "Toggle your mobile data or airplane mode off and on.",
    ],
  },
  timeout: {
    code: "408",
    badge: "Request Timeout • AI Heavy Sweep",
    title: "The Search Took Too Long",
    description:
      "The request timed out while cross-referencing visual embeddings and spatial campus trees. The server might be experiencing high load.",
    icon: Clock,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    glowColor: "from-purple-500/20 to-indigo-500/10",
    actionText: "Retry Search with Filters",
    actionHref: "/browse",
    tips: [
      "Filter by a specific category (e.g. Electronics, Keys) to narrow the query.",
      "Limit your location search to a single campus building.",
      "Check your connection speed and retry in a moment.",
    ],
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const codeParam =
    searchParams.get("code")?.toLowerCase() ||
    searchParams.get("type")?.toLowerCase() ||
    "404";
  const config = ERROR_CONFIGS[codeParam] || ERROR_CONFIGS["404"];
  const Icon = config.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#F4F4F1]">
      {/* Main Split Container Card (Matching Sign In Page Size and Structure Exactly) */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* ================================================================= */}
        {/* LEFT / TOP DECORATIVE BRAND PANEL                                 */}
        {/* ================================================================= */}
        <div className="relative md:w-5/12 lg:w-1/2 bg-gradient-to-br from-[#1E3A5F] via-[#234E70] to-[#0F172A] p-6 sm:p-10 flex flex-col items-center justify-between text-center select-none overflow-hidden shrink-0">
          
          {/* Subtle Dynamic Ambient Glow Circles */}
          <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-br ${config.glowColor} blur-2xl pointer-events-none`} />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

          {/* Large Stylized Translucent Error Code Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
            <span className="text-8xl sm:text-8xl font-black font-mono tracking-tighter text-white/[0.04] transform -rotate-12 translate-y-2">
              #{config.code}
            </span>
          </div>

          {/* Top Tagline */}
          <div className="relative z-10 pt-2 sm:pt-4">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-cyan-200 uppercase drop-shadow-xs">
              System Notice
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
                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${config.bgColor} ${config.iconColor}`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>{config.badge}</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  #{config.code}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {config.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Recommended Next Steps Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-findback-primary" />
                <span>Recommended Next Steps:</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {config.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-findback-primary font-bold mt-0.5">•</span>
                    <span className="leading-snug">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-6">
              <Link
                href={config.actionHref}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-findback-primary text-white text-xs font-semibold hover:bg-findback-primary-hover shadow-sm transition-all text-center"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{config.actionText}</span>
              </Link>

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
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 mt-auto">
            Heritage Institute of Technology Campus Edition · System Diagnostics
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-xs text-slate-500">
          Loading error diagnostics...
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
