"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CustodyCrateLoader } from "@/components/CustodyCrateLoader";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const hasStaffAccess = Boolean(
    user?.role === "staff" ||
    user?.is_security_officer ||
    user?.can_switch_views ||
    user?.email?.toLowerCase() === "officer@campus.edu" ||
    user?.role === "admin"
  );

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (!hasStaffAccess) {
        // Students do not have access to staff view
        router.replace("/error?type=403");
      }
    }
  }, [isLoading, user, hasStaffAccess, router]);

  if (isLoading || !user || !hasStaffAccess) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <CustodyCrateLoader
          size="md"
          label="Verifying Staff Clearance..."
          subtext="Authenticating campus officer credentials & custody permissions..."
        />
      </div>
    );
  }

  return <>{children}</>;
}
