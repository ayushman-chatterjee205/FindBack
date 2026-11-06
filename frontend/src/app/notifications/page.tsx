"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Inbox } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { NotificationItem } from "@/types";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <span className="text-xs uppercase font-bold tracking-wider text-findback-primary block mb-1">
          Activity Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
          Campus Notifications
        </h1>
        <p className="text-xs sm:text-sm text-findback-muted mt-1">
          Real-time updates regarding your lost belongings, matches, and custody reviews.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-findback-border p-12 text-center shadow-card max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-findback-sand flex items-center justify-center text-findback-muted mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-findback-text mb-1">
            No notifications yet
          </h3>
          <p className="text-xs text-findback-muted leading-relaxed">
            When our AI engine detects a match for your reported items or custody staff review your claims, alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Link
              key={item.id}
              href={item.link_url || "/my-reports"}
              className={`block p-5 rounded-2xl border transition-all card-hover group ${
                item.is_read
                  ? "bg-white border-findback-border"
                  : "bg-white border-findback-primary/40 shadow-card ring-1 ring-findback-primary/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === "match"
                        ? "bg-amber-50 text-status-matched"
                        : item.type === "claim"
                        ? "bg-emerald-50 text-findback-accent"
                        : "bg-findback-sand text-findback-primary"
                    }`}
                  >
                    {item.type === "match" ? (
                      <Sparkles className="w-4 h-4" />
                    ) : item.type === "claim" ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-findback-text group-hover:text-findback-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-findback-muted mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-findback-muted whitespace-nowrap shrink-0">
                  {formatTimeAgo(item.created_at)}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-findback-border/60 flex items-center justify-end text-xs font-semibold text-findback-primary">
                <span>View details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover-shift ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
