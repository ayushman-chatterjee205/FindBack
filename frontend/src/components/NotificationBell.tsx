"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, ArrowRight, Inbox } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { NotificationItem } from "@/types";
import { api } from "@/lib/api";

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    api
      .get<NotificationItem[]>("/notifications")
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(() => {
        setNotifications([]);
      });
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-findback-muted hover:text-findback-text hover:bg-white border border-transparent hover:border-findback-border transition-colors relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-findback-accent ring-2 ring-[#F4F7FB]" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lift border border-findback-border z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-findback-border/60 pb-2 mb-2">
              <span className="text-xs font-bold text-findback-text">Alerts</span>
              {notifications.length > 0 && (
                <button
                  onClick={() =>
                    setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
                  }
                  className="text-[11px] text-findback-accent hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-findback-muted font-medium">
                    No new alerts
                  </p>
                  <p className="text-[11px] text-findback-muted mt-0.5">
                    Match updates and review decisions will notify you here.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link_url || "/my-reports"}
                    onClick={() => setIsOpen(false)}
                    className={`block p-2.5 rounded-lg border text-xs transition-colors ${
                      n.is_read
                        ? "bg-white border-transparent hover:bg-findback-bg"
                        : "bg-findback-sand/40 border-findback-border hover:bg-findback-sand/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-findback-text">{n.title}</span>
                      <span className="text-[10px] text-findback-muted">
                        {formatTimeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-findback-muted text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-findback-border/60 text-center">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-findback-primary hover:underline inline-flex items-center space-x-1"
              >
                <span>View all notifications</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
