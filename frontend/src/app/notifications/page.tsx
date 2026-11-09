"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Inbox, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  Check, 
  X,
  Filter,
  Info
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

type FilterTab = "all" | "unread" | "matches" | "claims";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearRead,
    refresh 
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCardClick = async (id: string, linkUrl?: string) => {
    await markAsRead(id);
    if (linkUrl) {
      router.push(linkUrl);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.is_read;
    if (activeTab === "matches") return item.type === "match";
    if (activeTab === "claims") return item.type === "claim";
    return true;
  });

  const matchesCount = notifications.filter((n) => n.type === "match").length;
  const claimsCount = notifications.filter((n) => n.type === "claim").length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-findback-primary">
              Activity Center
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-findback-text">
            Campus Notifications
          </h1>
          <p className="text-xs sm:text-sm text-findback-muted mt-1">
            Real-time updates regarding your lost belongings, AI matches, and custody reviews.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsRead()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors shadow-2xs"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.some((n) => n.is_read) && (
            <button
              type="button"
              onClick={() => clearRead()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-xs font-semibold transition-colors"
              title="Remove read notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <span>All</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
            {notifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unread")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "unread"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "unread" ? "bg-white/25 text-white" : "bg-blue-100 text-blue-700 font-bold"}`}>
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("matches")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "matches"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Matches</span>
          {matchesCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "matches" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
              {matchesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("claims")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "claims"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Claims & Custody</span>
          {claimsCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "claims" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
              {claimsCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-card max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {activeTab === "unread" ? "All caught up!" : "No notifications found"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {activeTab === "unread"
              ? "You have read all your campus alerts. New matches and custody updates will appear here."
              : activeTab === "matches"
              ? "No AI match alerts yet. When an item matching your lost report is turned into custody, you will be notified."
              : activeTab === "claims"
              ? "No claim status updates yet. Verified proofs and pickup passes will be tracked here."
              : "When our AI engine detects a match or custody staff reviews your report, notifications will arrive here in real-time."}
          </p>
          {activeTab !== "all" && (
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Show all notifications
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all relative group ${
                item.is_read
                  ? "bg-white border-slate-200/90 hover:border-slate-300"
                  : "bg-blue-50/40 border-blue-200 shadow-2xs hover:border-blue-300 ring-1 ring-blue-500/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Icon & Content */}
                <div 
                  className="flex items-start space-x-3.5 flex-1 cursor-pointer"
                  onClick={() => handleCardClick(item.id, item.link_url || "/my-reports")}
                >
                  {/* Category Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                      item.type === "match"
                        ? "bg-amber-100 text-amber-700 border border-amber-200/80"
                        : item.type === "claim"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200/80"
                        : "bg-blue-100 text-blue-700 border border-blue-200/80"
                    }`}
                  >
                    {item.type === "match" ? (
                      <Sparkles className="w-5 h-5" />
                    ) : item.type === "claim" ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                      )}
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Right: Timestamp & Action Buttons */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium">
                    {formatTimeAgo(item.created_at)}
                  </span>

                  <div className="flex items-center gap-1 mt-2">
                    {!item.is_read ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-70 group-hover:opacity-100"
                      title="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Link */}
              <div 
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs cursor-pointer"
                onClick={() => handleCardClick(item.id, item.link_url || "/my-reports")}
              >
                <span className="text-[11px] font-medium text-slate-400">
                  {item.type === "match"
                    ? "AI Matching Engine"
                    : item.type === "claim"
                    ? "Central Block Security Vault"
                    : "Campus Registry Alert"}
                </span>
                <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View in portal</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
