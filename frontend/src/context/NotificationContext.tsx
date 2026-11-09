"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { NotificationItem } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Initial realistic campus notifications for demo student accounts
const DEMO_STUDENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "demo-notif-1",
    user_id: "demo-student",
    title: "Potential Match Detected! ✨",
    message: "A Casio Scientific Calculator matching your lost report was turned into Central Block Vault (93% AI match).",
    link_url: "/my-reports",
    is_read: false,
    type: "match",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
  },
  {
    id: "demo-notif-2",
    user_id: "demo-student",
    title: "Custody Intake Confirmed 📦",
    message: "Item #FB-2026-0814 moved to Secure Bin #E-04 at Central Block Room 101.",
    link_url: "/my-reports",
    is_read: false,
    type: "claim",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: "demo-notif-3",
    user_id: "demo-student",
    title: "Ownership Claim Approved! 🎉",
    message: "Your ownership proof for 'Blue Thermos Flask' was verified by Officer Sharma. Your digital pickup pass is ready.",
    link_url: "/my-reports",
    is_read: true,
    type: "claim",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

const DEMO_STAFF_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "demo-staff-notif-1",
    user_id: "demo-staff",
    title: "New Ownership Claim Pending Review 📋",
    message: "Student Ayushman Chatterjee (2563002) submitted ownership challenge answers for Casio Calculator in Bin #E-02.",
    link_url: "/verify",
    is_read: false,
    type: "claim",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "demo-staff-notif-2",
    user_id: "demo-staff",
    title: "Vault Inventory Audit Scheduled 🔒",
    message: "Central Block Vault physical audit reminder for active lockers Bins #E-01 through #E-12.",
    link_url: "/inventory",
    is_read: true,
    type: "system",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const storageKey = user ? `findback_notifs_${user.email?.toLowerCase()}` : "findback_notifs_guest";

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    try {
      const serverNotifs = await api.get<NotificationItem[]>("/notifications");
      if (Array.isArray(serverNotifs) && serverNotifs.length > 0) {
        setNotifications(serverNotifs);
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(serverNotifs));
        }
        setIsLoading(false);
        return;
      }
    } catch {
      // Backend not running or offline
    }

    // Fallback: check localStorage first
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
            setIsLoading(false);
            return;
          }
        } catch {
          // ignore corrupted JSON
        }
      }

      // If no cache, seed appropriate demo notifications so experience is rich
      const initial = user.role === "staff" ? DEMO_STAFF_NOTIFICATIONS : DEMO_STUDENT_NOTIFICATIONS;
      setNotifications(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }

    setIsLoading(false);
  }, [user, storageKey]);

  useEffect(() => {
    fetchNotifications();

    // Periodic poll every 25 seconds for new matches/alerts
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden && user) {
        fetchNotifications();
      }
    }, 25000);

    // Refresh when user returns to tab
    const handleFocus = () => {
      if (user) {
        fetchNotifications();
      }
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchNotifications, user, token]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // Backend offline: localStorage already updated
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, is_read: true }));
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await api.post("/notifications/read-all");
    } catch {
      // Backend offline: localStorage already updated
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      // Backend offline
    }
  };

  const clearRead = async () => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => !n.is_read);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await api.delete("/notifications/clear/read");
    } catch {
      // Backend offline
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refresh: fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
