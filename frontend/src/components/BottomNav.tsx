"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Home, Search, ClipboardList, Bell, User, Box, ShieldCheck, KeyRound } from "lucide-react";
import { SignInRequiredModal } from "@/components/SignInRequiredModal";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { unreadCount } = useNotifications();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  if (isLoading || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const isStaff = user?.role === "staff";

  const tabs = !user
    ? [
        { label: "Home", href: "/", icon: Home },
        { label: "Search", href: "/browse", icon: Search },
        { label: "Sign In", href: "/login", icon: User },
      ]
    : isStaff
    ? [
        { label: "Home", href: "/", icon: Home },
        { label: "Search", href: "/browse", icon: Search },
        { label: "Inventory", href: "/inventory", icon: Box },
        { label: "Verify", href: "/verify", icon: ShieldCheck },
        { label: "Handover", href: "/handover", icon: KeyRound },
      ]
    : [
        { label: "Home", href: "/", icon: Home },
        { label: "Search", href: "/browse", icon: Search },
        { label: "Reports", href: "/my-reports", icon: ClipboardList },
        { label: "Alerts", href: "/notifications", icon: Bell },
        { label: "Profile", href: "/profile", icon: User },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F4F7FB]/95 backdrop-blur-md border-t border-findback-border pb-safe">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          if (!user && tab.label === "Search") {
            return (
              <button
                key={tab.href}
                type="button"
                onClick={() => setIsSignInModalOpen(true)}
                className="flex flex-col items-center justify-center w-full h-full text-center transition-colors text-findback-muted hover:text-findback-text"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 stroke-[1.7]" />
                </div>
                <span className="text-[10px] mt-0.5 whitespace-nowrap">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full text-center transition-colors ${
                isActive
                  ? "text-findback-primary font-semibold"
                  : "text-findback-muted hover:text-findback-text"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.7]"}`} />
                {tab.label === "Alerts" && unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-findback-accent ring-2 ring-[#F4F7FB]" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sign In Required Modal for Guests */}
      <SignInRequiredModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        title="Sign In to Search Registry"
        description="Searching campus items, filtering custody bins, and viewing report archives requires campus authentication."
        redirectUrl="/browse"
      />
    </nav>
  );
};
