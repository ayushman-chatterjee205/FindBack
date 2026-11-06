"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CustodyCrateLoader } from "@/components/CustodyCrateLoader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const isOfficer = Boolean(
    user?.is_security_officer ||
    user?.can_switch_views ||
    user?.email?.toLowerCase() === "officer@campus.edu" ||
    user?.role === "admin"
  );

  // Campus Security Officer has access to both views.
  // Students have access to student view.
  // Claim routes and report-found are accessible to all campus members.
  // Other staff (e.g. guard@campus.edu) do NOT have access to student-specific view (e.g. /my-reports).
  const isStudentViewAllowed = Boolean(
    user?.role === "student" ||
    isOfficer ||
    pathname === "/report-found" ||
    pathname.startsWith("/claim")
  );

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        const redirectParam = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
        router.replace(`/login${redirectParam}`);
      } else if (!isStudentViewAllowed) {
        // Other staff do not have access to student view
        router.replace("/error?code=403");
      }
    }
  }, [isLoading, user, isStudentViewAllowed, router, pathname]);

  if (isLoading || !user || !isStudentViewAllowed) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <CustodyCrateLoader
          size="md"
          label="Verifying Clearance..."
          subtext="Checking student authorization & access permissions..."
        />
      </div>
    );
  }

  return <>{children}</>;
}
