"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  WifiOff, 
  Wifi, 
  RotateCw, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Smartphone
} from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  useEffect(() => {
    setIsOnline(typeof window !== "undefined" ? navigator.onLine : false);

    const handleOnline = () => {
      setIsOnline(true);
      setCheckResult("Connected! Your connection has been restored.");
    };

    const handleOffline = () => {
      setIsOnline(false);
      setCheckResult("You are currently disconnected from the campus network.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const testConnection = async () => {
    setIsChecking(true);
    setCheckResult(null);

    // Give user a realistic feedback loop
    await new Promise((r) => setTimeout(r, 600));

    if (navigator.onLine) {
      try {
        // Attempt a lightweight fetch test with cache-buster
        await fetch(`/favicon.ico?_ping=${Date.now()}`, { method: "HEAD", cache: "no-store" });
        setIsOnline(true);
        setCheckResult("Internet connection verified! You can return to your dashboard.");
      } catch {
        setIsOnline(false);
        setCheckResult("Wi-Fi network connected, but internet access is currently unavailable.");
      }
    } else {
      setIsOnline(false);
      setCheckResult("Device is still offline. Please verify Wi-Fi or mobile data.");
    }

    setIsChecking(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 text-center animate-in fade-in duration-300">
        
        {/* Live Network Status Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 transition-all duration-300">
          {isOnline ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connection Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Offline • Campus Network Dropped</span>
            </span>
          )}
        </div>

        {/* Animated Icon Badge */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-blue-50 animate-ping opacity-25" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-100 to-blue-50 border border-slate-200 flex items-center justify-center shadow-sm">
            {isOnline ? (
              <Wifi className="w-10 h-10 text-emerald-600 animate-in zoom-in" />
            ) : (
              <WifiOff className="w-10 h-10 text-slate-500 animate-pulse" />
            )}
          </div>
        </div>

        {/* Header & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          {isOnline ? "You Are Back Online!" : "No Internet Connection"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          {isOnline
            ? "Your internet link has re-established. You can now submit item claims, browse the registry, or check live campus updates."
            : "FindBack is unable to reach the campus server. Campus basement labs, workshop rooms, and thick concrete walls can interrupt wireless signals."}
        </p>

        {/* Status Message from Retry */}
        {checkResult && (
          <div
            className={`text-xs p-3 rounded-xl mb-6 font-medium animate-in fade-in flex items-center justify-center space-x-2 ${
              isOnline
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-amber-50 border border-amber-200 text-amber-900"
            }`}
          >
            {isOnline ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{checkResult}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={testConnection}
            disabled={isChecking}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
            <span>{isChecking ? "Checking Link..." : "Retry Connection"}</span>
          </button>

          {isOnline ? (
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Back to Home</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Return Home</span>
            </Link>
          )}
        </div>

        {/* Campus Network Offline Tips */}
        <div className="text-left bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 text-xs space-y-2.5">
          <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 uppercase text-[10px] tracking-wider text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Network Troubleshooting Tips</span>
          </h4>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Verify Campus Wi-Fi:</strong> Reconnect to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">Heritage-WiFi</code> or Eduroam. Check if your login captive portal requires renewal.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Physical QR Pass Safe:</strong> If you are on your way to the security desk to collect an approved item, you can present your saved screenshot or 6-digit PIN offline.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Mobile Cellular:</strong> In lab basement zones (ICT/CME ground level), move toward campus building atriums for stronger signals.
              </span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
