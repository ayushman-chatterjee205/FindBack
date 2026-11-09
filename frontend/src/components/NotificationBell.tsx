"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, ArrowRight, Inbox, Sparkles, ShieldCheck, CheckCheck } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";

interface NotificationBellProps {
  isLightNav?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ isLightNav = true }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = async (id: string, linkUrl?: string) => {
    await markAsRead(id);
    setIsOpen(false);
    if (linkUrl) {
      router.push(linkUrl);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 lg:p-2 rounded-lg transition-colors relative shrink-0 ${
          isLightNav
            ? "text-findback-muted hover:text-findback-text hover:bg-black/5 border border-transparent hover:border-findback-border"
            : "text-white/85 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/20"
        }`}
        title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center bg-findback-accent text-white shadow-xs ring-2 ${
              isLightNav ? "ring-[#F4F7FB]" : "ring-[#215194]"
            }`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-lift border border-findback-border z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-findback-border/60 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-findback-text">Campus Alerts</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="text-[11px] text-findback-accent hover:underline font-semibold flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-9 h-9 rounded-xl bg-findback-sand flex items-center justify-center text-findback-muted mx-auto mb-2">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-findback-text font-bold">
                    No alerts yet
                  </p>
                  <p className="text-[11px] text-findback-muted mt-0.5 max-w-[200px] mx-auto">
                    AI match updates and custody reviews will appear here.
                  </p>
                </div>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.link_url || "/my-reports")}
                    className={`block p-2.5 rounded-xl border text-xs transition-all cursor-pointer group ${
                      n.is_read
                        ? "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                        : "bg-blue-50/50 border-blue-100 hover:bg-blue-50/80 text-slate-900 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {!n.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                        <span className="truncate group-hover:text-findback-primary transition-colors">
                          {n.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTimeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-2 pt-2 border-t border-findback-border/60 text-center">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-findback-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View all activity</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
