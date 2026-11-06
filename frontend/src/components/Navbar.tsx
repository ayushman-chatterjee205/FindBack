"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Search, PlusCircle, Bell, User as UserIcon, Shield, Box, AlertCircle, X, ChevronDown, CheckCircle2, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { SignInRequiredModal } from "@/components/SignInRequiredModal";

/**
 * Computes dynamic navbar background color matching the Split Hero gradient as user scrolls
 */
function getNavBg(scrollY: number): { r: number; g: number; b: number; alpha: number } {
  if (scrollY <= 0) {
    return { r: 33, g: 81, b: 148, alpha: 1 }; // Deep blue #215194
  }
  // 0 -> 120px: Deep blue (#215194) to medium ocean blue (#3572C6)
  if (scrollY < 120) {
    const t = scrollY / 120;
    return {
      r: Math.round(33 + (53 - 33) * t),
      g: Math.round(81 + (114 - 81) * t),
      b: Math.round(148 + (198 - 148) * t),
      alpha: 1,
    };
  }
  // 120 -> 220px: Ocean blue (#3572C6) to soft sky blue (#BAE6FD)
  if (scrollY < 220) {
    const t = (scrollY - 120) / 100;
    return {
      r: Math.round(53 + (186 - 53) * t),
      g: Math.round(114 + (230 - 114) * t),
      b: Math.round(198 + (253 - 198) * t),
      alpha: 1,
    };
  }
  // 220 -> 320px: Soft sky blue (#BAE6FD) to subtle cool-tinted background (#F4F7FB)
  if (scrollY < 320) {
    const t = (scrollY - 220) / 100;
    return {
      r: Math.round(186 + (244 - 186) * t),
      g: Math.round(230 + (247 - 230) * t),
      b: Math.round(253 + (251 - 253) * t),
      alpha: 1,
    };
  }
  // 320px+: Sits cleanly over subtle cool-tinted background
  return { r: 244, g: 247, b: 251, alpha: 0.94 };
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, switchRole } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [pendingClaimsCount, setPendingClaimsCount] = useState<number>(0);
  const [approvedClaimsCount, setApprovedClaimsCount] = useState<number>(0);
  const [isSearchFolderOpen, setIsSearchFolderOpen] = useState(false);

  const isHome = pathname === "/";
  const [isLightNav, setIsLightNav] = useState(!isHome);
  const [isPastHero, setIsPastHero] = useState(!isHome);
  const headerRef = useRef<HTMLElement>(null);

  const isStaff = user?.role === "staff";

  // Dynamic scroll listener to match navbar background with the split hero background
  useEffect(() => {
    if (!isHome) {
      setIsLightNav(true);
      setIsPastHero(true);
      if (headerRef.current) {
        headerRef.current.style.backgroundColor = "rgba(244, 247, 251, 0.95)";
      }
      return;
    }

    let rafId: number | null = null;
    const updateNav = () => {
      const y = window.scrollY;
      const bg = getNavBg(y);
      if (headerRef.current) {
        headerRef.current.style.backgroundColor = `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.alpha})`;
      }
      setIsLightNav(y >= 160);
      setIsPastHero(y >= 300);
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateNav);
    };

    updateNav();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome, pathname]);

  // Close folder menu on navigation
  useEffect(() => {
    setIsSearchFolderOpen(false);
  }, [pathname]);

  // Poll for staff claim counts
  useEffect(() => {
    if (!isStaff) return;
    let isMounted = true;

    const fetchCounts = async () => {
      try {
        const [pendingRes, approvedRes] = await Promise.allSettled([
          api.get<any[]>("/claims/pending"),
          api.get<any[]>("/claims/approved"),
        ]);

        if (!isMounted) return;

        if (pendingRes.status === "fulfilled" && Array.isArray(pendingRes.value)) {
          setPendingClaimsCount(pendingRes.value.length);
        }
        if (approvedRes.status === "fulfilled" && Array.isArray(approvedRes.value)) {
          setApprovedClaimsCount(approvedRes.value.length);
        }
      } catch {
        // Ignore network errors in background poll
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isStaff]);

  // The navbar is hidden only on login and register pages, or while auth is bootstrapping.
  // Guests on home and public pages can see the navbar.
  if (isLoading || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const canSwitchViews = Boolean(
    user?.is_security_officer ||
    user?.can_switch_views ||
    user?.email?.toLowerCase() === "officer@campus.edu" ||
    user?.role === "admin"
  );

  const navLinks = !user
    ? [
        { label: "Home", href: "/" },
        { label: "Search Items", href: "/browse" },
        { label: "Campus Map", href: "/#hotspots" },
        { label: "About Us", href: "/about" }
      ]
    : isStaff
    ? [
        { label: "Home", href: "/" },
        { label: "Search Items", href: "/browse" },
        { label: "Inventory", href: "/inventory" },
        {
          label: "Verify Claims",
          href: "/verify",
          badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined,
          badgeColor: "bg-amber-100 text-amber-800 border-amber-300 animate-pulse",
        },
        {
          label: "Handover Console",
          href: "/handover",
          badge: approvedClaimsCount > 0 ? approvedClaimsCount : undefined,
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
        },
        { label: "About Us", href: "/about" }
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Search Items", href: "/browse" },
        { label: "My Reports", href: "/my-reports" },
        { label: "Campus Map", href: "/#hotspots" },
        { label: "About Us", href: "/about" }
      ];

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 transition-[box-shadow,border-color] duration-300 ${
        isPastHero ? "border-b border-findback-border/80 shadow-subtle backdrop-blur-md" : "border-b-0"
      }`}
      style={{
        backgroundColor: !isHome ? "rgba(244, 247, 251, 0.95)" : "#215194",
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-16 flex items-center justify-between gap-2 lg:gap-4 flex-nowrap">
        {/* Brand Logo & Nav */}
        <div className="flex items-center space-x-3 lg:space-x-6 shrink-0">
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
            <div
              className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-sm bg-white flex items-center justify-center p-1 group-hover:scale-105 group-hover:shadow-md transition-all shrink-0 ${
                isLightNav ? "border border-findback-border" : "border border-white/30"
              }`}
            >
              <Image
                src="/logo.png"
                alt="FindBack Logo"
                width={44}
                height={44}
                className="object-contain w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                priority
              />
            </div>
            <div className="flex items-center shrink-0">
              <span
                className={`font-black text-xl sm:text-2xl tracking-wider leading-none whitespace-nowrap transition-colors duration-300 ${
                  isLightNav ? "text-findback-text" : "text-white drop-shadow-xs"
                }`}
              >
                FINDBACK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isSearchFolder = link.href === "/browse";

              // If unauthenticated guest clicks Search Items or Campus Map, trigger sign-in dialog
              if (!user && isSearchFolder) {
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => setIsSignInModalOpen(true)}
                    className={`px-2 lg:px-2.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors duration-300 flex items-center space-x-1 whitespace-nowrap ${
                      isLightNav
                        ? "text-findback-muted hover:text-findback-text hover:bg-black/5"
                        : "text-white/85 hover:text-white hover:bg-white/15"
                    }`}
                  >
                    <span className="whitespace-nowrap">{link.label}</span>
                  </button>
                );
              }

              if (!user && (link.label === "Campus Map" || link.href === "/#hotspots")) {
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => setIsSignInModalOpen(true)}
                    className={`px-2 lg:px-2.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors duration-300 flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                      isLightNav
                        ? "text-findback-muted hover:text-findback-text hover:bg-black/5"
                        : "text-white/85 hover:text-white hover:bg-white/15"
                    }`}
                  >
                    <span className="whitespace-nowrap">{link.label}</span>
                  </button>
                );
              }

              if (isSearchFolder) {
                return (
                  <div
                    key={link.href}
                    className="relative shrink-0"
                    onMouseEnter={() => setIsSearchFolderOpen(true)}
                    onMouseLeave={() => setIsSearchFolderOpen(false)}
                  >
                    <div className="flex items-center whitespace-nowrap">
                      <Link
                        href="/browse"
                        className={`px-2 lg:px-2.5 py-1.5 rounded-l-md text-xs lg:text-sm font-medium transition-colors duration-300 flex items-center space-x-1 whitespace-nowrap ${
                          isActive
                            ? isLightNav
                              ? "text-findback-primary bg-findback-sand font-bold border border-findback-border/60"
                              : "text-white bg-white/20 font-bold border border-white/25"
                            : isLightNav
                            ? "text-findback-muted hover:text-findback-text hover:bg-black/5"
                            : "text-white/85 hover:text-white hover:bg-white/15"
                        }`}
                      >
                        <span className="whitespace-nowrap">{link.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsSearchFolderOpen((prev) => !prev);
                        }}
                        className={`px-1 py-1.5 rounded-r-md text-xs lg:text-sm transition-colors duration-300 shrink-0 ${
                          isLightNav
                            ? isActive
                              ? "text-findback-primary bg-findback-sand border-t border-b border-r border-findback-border/60 border-l border-l-findback-border/60"
                              : "border-l border-findback-border/60 text-findback-muted hover:text-findback-text hover:bg-black/5"
                            : isActive
                            ? "text-white bg-white/20 border-t border-b border-r border-white/25 border-l border-l-white/20"
                            : "border-l border-white/20 text-white/85 hover:text-white hover:bg-white/15"
                        }`}
                        title="View Search Items sections (including Returned Items)"
                        aria-label="Toggle Search Items folder"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSearchFolderOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {/* Search Items Folder Dropdown Menu */}
                    {isSearchFolderOpen && (
                      <div className="absolute top-full left-0 mt-1 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
                        <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 whitespace-nowrap">
                            <Layers className="w-3 h-3 text-[#215194]" />
                            <span>{link.label} Folder</span>
                          </span>
                          <span className="text-[10px] text-[#215194] font-semibold whitespace-nowrap">Campus Registry</span>
                        </div>

                        {/* Section 1: All Lost & Found */}
                        <Link
                          href="/browse"
                          onClick={() => setIsSearchFolderOpen(false)}
                          className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#215194] shrink-0 group-hover/item:scale-105 transition-transform">
                            <Search className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight whitespace-nowrap">
                              All Lost & Found Items
                            </span>
                            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                              Search active missing reports & custody inventory
                            </span>
                          </div>
                        </Link>

                        {/* Section 2: Returned Items (with Owner Name, Date, Timing) */}
                        <Link
                          href="/browse?tab=returned"
                          onClick={() => setIsSearchFolderOpen(false)}
                          className="flex items-start space-x-3 p-2.5 rounded-xl bg-emerald-50/40 hover:bg-emerald-50 transition-colors group/item mt-1 border border-emerald-200/70"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0 group-hover/item:scale-105 transition-transform border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-950 block leading-tight whitespace-nowrap">
                                Returned Items Archive
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
                                ✓ Returned
                              </span>
                            </div>
                            <span className="text-[11px] text-emerald-700 font-medium leading-tight block mt-0.5">
                              Shows Owner Name, Date & Timing
                            </span>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 lg:px-2.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors duration-300 flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? isLightNav
                        ? "text-findback-primary bg-findback-sand font-bold border border-findback-border/60"
                        : "text-white bg-white/20 font-bold border border-white/25"
                      : isLightNav
                      ? "text-findback-muted hover:text-findback-text hover:bg-black/5"
                      : "text-white/85 hover:text-white hover:bg-white/15"
                  }`}
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  {link.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border whitespace-nowrap shrink-0 ${
                        link.badgeColor || (isLightNav ? "bg-findback-sand text-findback-primary border-findback-border" : "bg-white/20 text-white border-white/30")
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Tray */}
        <div className="flex items-center space-x-2 lg:space-x-3 shrink-0 whitespace-nowrap">
          {/* Quick Action Button */}
          {!isStaff && (
            <button
              onClick={() => {
                if (!user) {
                  setIsSignInModalOpen(true);
                  return;
                }
                router.push("/report-lost");
              }}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap shrink-0 ${
                isLightNav
                  ? "bg-findback-primary text-white hover:bg-findback-primary-hover shadow-xs border border-transparent"
                  : "bg-white/15 text-white hover:bg-white/25 border border-white/25 shadow-xs"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Report Lost</span>
            </button>
          )}

          {/* Notifications Icon */}
          {user ? (
            <Link
              href="/notifications"
              className={`p-1.5 lg:p-2 rounded-lg transition-colors duration-300 relative shrink-0 ${
                isLightNav
                  ? "text-findback-muted hover:text-findback-text hover:bg-black/5 border border-transparent hover:border-findback-border"
                  : "text-white/85 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/20"
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ${isLightNav ? "ring-[#F4F7FB]" : "ring-[#215194]"}`} />
            </Link>
          ) : (
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className={`p-1.5 lg:p-2 rounded-lg transition-colors duration-300 relative shrink-0 ${
                isLightNav
                  ? "text-findback-muted hover:text-findback-text hover:bg-black/5 border border-transparent hover:border-findback-border"
                  : "text-white/85 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/20"
              }`}
              title="Notifications (Sign in required)"
            >
              <Bell className="w-4 h-4" />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ${isLightNav ? "ring-[#F4F7FB]" : "ring-[#215194]"}`} />
            </button>
          )}

          {/* Role Indicator / Switcher */}
          {canSwitchViews ? (
            <button
              onClick={() => switchRole(isStaff ? "student" : "staff")}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 lg:px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
                isLightNav
                  ? "border border-findback-border bg-white text-findback-text hover:bg-findback-sand shadow-xs"
                  : "border border-white/30 bg-white/15 text-white hover:bg-white/25 hover:shadow-sm"
              }`}
              title="Campus Security Officer: Click to switch between Student View and Staff View"
            >
              {isStaff ? (
                <>
                  <Shield className={`w-3.5 h-3.5 shrink-0 ${isLightNav ? "text-emerald-600" : "text-emerald-300"}`} />
                  <span className="whitespace-nowrap">Staff View</span>
                  <span className={`text-[10px] font-normal whitespace-nowrap ${isLightNav ? "text-slate-500" : "text-white/70"}`}>⇄ Student</span>
                </>
              ) : (
                <>
                  <UserIcon className={`w-3.5 h-3.5 shrink-0 ${isLightNav ? "text-blue-600" : "text-blue-200"}`} />
                  <span className="whitespace-nowrap">Student View</span>
                  <span className={`text-[10px] font-normal whitespace-nowrap ${isLightNav ? "text-slate-500" : "text-white/70"}`}>⇄ Staff</span>
                </>
              )}
            </button>
          ) : isStaff ? (
            <div
              className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-default whitespace-nowrap shrink-0 transition-colors duration-300 ${
                isLightNav
                  ? "border border-findback-border bg-findback-sand/70 text-slate-700"
                  : "border border-white/25 bg-white/10 text-white/80"
              }`}
              title="Staff Account (Student view access not permitted)"
            >
              <Shield className={`w-3.5 h-3.5 shrink-0 ${isLightNav ? "text-emerald-600" : "text-emerald-300"}`} />
              <span className="whitespace-nowrap">Staff Desk</span>
            </div>
          ) : (
            <div
              className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-default whitespace-nowrap shrink-0 transition-colors duration-300 ${
                isLightNav
                  ? "border border-findback-border bg-findback-sand/70 text-slate-700"
                  : "border border-white/25 bg-white/10 text-white/80"
              }`}
              title="Student Account (Staff view access not permitted)"
            >
              <UserIcon className={`w-3.5 h-3.5 shrink-0 ${isLightNav ? "text-blue-600" : "text-blue-200"}`} />
              <span className="whitespace-nowrap">Student</span>
            </div>
          )}

          {/* Profile or Sign In link */}
          {user ? (
            <Link
              href="/profile"
              className={`flex items-center space-x-2 pl-2 text-xs font-medium transition-colors duration-300 shrink-0 ${
                isLightNav
                  ? "border-l border-findback-border text-findback-text hover:text-findback-primary"
                  : "border-l border-white/20 text-white hover:text-white/80"
              }`}
              title={`Logged in as ${user.full_name} (${user.role})`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                  isLightNav
                    ? "bg-findback-sand border border-findback-border text-findback-primary"
                    : "bg-white/20 border border-white/30 text-white"
                }`}
              >
                {user.full_name?.charAt(0) || "U"}
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className={`inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap shrink-0 ${
                isLightNav
                  ? "bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm"
                  : "bg-white text-[#1E3A5F] hover:bg-blue-50 shadow-md"
              }`}
            >
              <span className="whitespace-nowrap">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Auth Error Notification Toast */}
      {authError && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-red-50 border-2 border-red-300 text-red-900 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 max-w-sm sm:max-w-md">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-red-950 uppercase tracking-wider text-[10px]">Access Restricted</p>
              <p className="font-semibold text-red-800">{authError}</p>
            </div>
            <Link
              href="/login"
              onClick={() => setAuthError(null)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 ml-1"
            >
              Sign In
            </Link>
            <button
              onClick={() => setAuthError(null)}
              className="text-red-400 hover:text-red-700 p-1 transition-colors ml-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sign In Required Modal for Guests */}
      <SignInRequiredModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        title="Sign In Required"
        description="Accessing reporting tools, security alerts, and item matches requires campus authentication."
      />
    </header>
  );
};
