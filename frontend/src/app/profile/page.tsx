"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, BookOpen, LogOut, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-findback-sand border border-findback-border mx-auto mb-4 flex items-center justify-center text-findback-primary">
          <User className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-findback-text mb-2">Campus Profile</h1>
        <p className="text-xs text-findback-muted mb-6 leading-relaxed">
          You are currently browsing as a guest. Sign in with your campus account or test trial credentials to manage reports and property claims.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
        >
          <span>Sign In to FindBack</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-6">
        <span className="text-xs uppercase font-bold tracking-wider text-findback-primary block mb-1">
          Account & Campus Credentials
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
          Campus Profile
        </h1>
        <p className="text-xs sm:text-sm text-findback-muted mt-1">
          Managed via college domain authentication.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-findback-border p-6 shadow-card space-y-6">
        {/* User Card */}
        <div className="flex items-center space-x-4 pb-6 border-b border-findback-border">
          <div className="w-14 h-14 rounded-full bg-findback-primary text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-findback-text leading-tight">
              {user?.full_name || "Campus User"}
            </h2>
            <p className="text-xs text-findback-muted flex items-center space-x-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Credentials Details */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-findback-bg border border-findback-border">
            <span className="text-findback-muted font-medium">Campus Role</span>
            <span className="font-bold text-findback-text uppercase tracking-wider">
              {user?.role}
            </span>
          </div>

          {user?.roll_number && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-findback-bg border border-findback-border">
              <span className="text-findback-muted font-medium">Student Roll Number</span>
              <span className="font-bold font-mono text-findback-text">
                {user.roll_number}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-xl bg-findback-bg border border-findback-border">
            <span className="text-findback-muted font-medium">Domain Status</span>
            <span className="font-semibold text-findback-accent flex items-center space-x-1">
              <span>●</span>
              <span>Verified @campus.edu</span>
            </span>
          </div>
        </div>

        {/* Role Switcher Demo - Only for Campus Security Officer */}
        {Boolean(
          user?.is_security_officer ||
          user?.can_switch_views ||
          user?.email?.toLowerCase() === "officer@campus.edu" ||
          user?.role === "admin"
        ) ? (
          <div className="pt-2 border-t border-findback-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-findback-text">
                Switch Perspective (Campus Security Officer)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Dual Access Enabled
              </span>
            </div>
            <p className="text-[11px] text-findback-muted mb-2.5">
              As Campus Security Officer, you have authorized clearance to switch between Student and Staff desk views:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => switchRole("student")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  user?.role === "student"
                    ? "bg-findback-primary text-white border-findback-primary shadow-sm"
                    : "bg-findback-bg border-findback-border text-findback-muted hover:text-findback-text"
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => switchRole("staff")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  user?.role === "staff"
                    ? "bg-findback-primary text-white border-findback-primary shadow-sm"
                    : "bg-findback-bg border-findback-border text-findback-muted hover:text-findback-text"
                }`}
              >
                Staff Desk View
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-findback-border">
            <span className="text-xs font-bold text-findback-text block mb-1.5">
              View Permissions
            </span>
            <div className="p-3 rounded-xl bg-findback-bg border border-findback-border text-xs text-findback-muted flex items-center justify-between">
              <span>
                {user?.role === "staff"
                  ? "Restricted to Staff View (Student view access not permitted)"
                  : "Restricted to Student View (Staff view access not permitted)"}
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-findback-sand text-findback-text border border-findback-border">
                Fixed Role
              </span>
            </div>
          </div>
        )}

        {/* Action Links */}
        <div className="pt-2 border-t border-findback-border flex items-center justify-between">
          <Link
            href="/my-reports"
            className="text-xs font-semibold text-findback-primary hover:underline"
          >
            My Reports History
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
