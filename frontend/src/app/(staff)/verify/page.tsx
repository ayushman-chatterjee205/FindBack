"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Check, X, ShieldCheck, AlertCircle, ArrowRight, Inbox, RefreshCw, Clock, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

interface PendingClaim {
  id: string;
  itemTitle: string;
  storageBin: string;
  studentName: string;
  studentRoll: string;
  studentEmail: string;
  studentProof: string;
  secretActualAttribute: string;
  submittedTime: string;
}

export default function StaffVerifyPage() {
  const [claims, setClaims] = useState<PendingClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchClaims = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const data = await api.get<PendingClaim[]>("/claims/pending");
      if (Array.isArray(data)) {
        setClaims(data);
      }
    } catch (err) {
      console.warn("Could not synchronize pending claims:", err);
    } finally {
      setIsLoading(false);
      if (showRefreshing) setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and automatic live sync interval every 5 seconds
  useEffect(() => {
    fetchClaims();
    const interval = setInterval(() => {
      fetchClaims(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchClaims]);

  const handleReview = async (claimId: string, approved: boolean) => {
    setProcessingId(claimId);
    setActionError(null);
    try {
      await api.patch(`/claims/${claimId}/review`, {
        status: approved ? "APPROVED" : "REJECTED",
      });

      setActionStatus(
        approved
          ? "✓ Claim approved! Dynamic handover pass issued to student with instant notification."
          : "Claim marked rejected. Student notified to provide further evidence."
      );

      // Instantly remove from local view
      setClaims((prev) => prev.filter((c) => c.id !== claimId));

      // Refresh to confirm with database
      setTimeout(() => {
        fetchClaims(false);
      }, 1000);

      setTimeout(() => {
        setActionStatus(null);
      }, 4500);
    } catch (err: any) {
      console.error("Failed to submit claim review:", err);
      setActionError(err.message || "Failed to submit review decision to campus server.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-findback-primary block">
              Staff Console
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Auto-Sync Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
            Verify Ownership Claims
          </h1>
          <p className="text-xs sm:text-sm text-findback-muted mt-1">
            Review student answers against physical items currently held in custody.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchClaims(true)}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-findback-border bg-white text-xs font-semibold text-findback-muted hover:text-findback-text hover:bg-findback-bg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-findback-primary" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/handover"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Handover Console</span>
          </Link>
        </div>
      </div>

      {actionStatus && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-findback-accent text-xs font-semibold flex items-center justify-between space-x-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{actionStatus}</span>
          </div>
          <button onClick={() => setActionStatus(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">
            ✕
          </button>
        </div>
      )}

      {actionError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between space-x-2 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-600 hover:text-red-800 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Summary Counts Bar */}
      <div className="mb-6 flex items-center justify-between text-xs text-findback-muted pb-2 border-b border-findback-border">
        <span>
          Pending review: <strong className="text-findback-text">{claims.length}</strong> active challenge{claims.length === 1 ? "" : "s"}
        </span>
        <span className="text-[11px] text-findback-muted">
          Auto-updates continuously with student submissions
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-findback-border p-8 shadow-card">
          <div className="w-8 h-8 border-2 border-findback-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-findback-muted">Loading pending claims from database...</p>
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-findback-border p-8 shadow-card max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-findback-sand text-findback-muted flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-findback-text mb-1">
            No pending claims
          </h3>
          <p className="text-xs text-findback-muted mb-4">
            All submitted ownership challenges have been reviewed. When students claim custody items, they will automatically appear here.
          </p>
          <Link
            href="/inventory"
            className="text-xs font-semibold text-findback-primary hover:underline"
          >
            Inspect Current Custody Inventory →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-2xl border border-findback-border p-6 shadow-card space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-findback-border">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-findback-primary">
                    {claim.storageBin}
                  </span>
                  <h2 className="text-lg font-bold text-findback-text">
                    {claim.itemTitle}
                  </h2>
                </div>
                <div className="text-xs text-findback-muted sm:text-right">
                  <span>Claimant: </span>
                  <strong className="text-findback-text">{claim.studentName}</strong> (
                  {claim.studentRoll})
                </div>
              </div>

              {/* Side-by-side verification comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-findback-bg border border-findback-border">
                  <span className="text-[10px] uppercase font-bold text-findback-muted tracking-wider block mb-1">
                    Student&apos;s Submitted Proof
                  </span>
                  <p className="text-xs font-medium text-findback-text leading-relaxed">
                    &ldquo;{claim.studentProof}&rdquo;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                  <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block mb-1">
                    Physical Item Inspection Record
                  </span>
                  <p className="text-xs font-medium text-amber-950 leading-relaxed">
                    &ldquo;{claim.secretActualAttribute}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  disabled={processingId === claim.id}
                  onClick={() => handleReview(claim.id, false)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-findback-border bg-white text-findback-muted hover:text-findback-text hover:bg-findback-bg transition-colors disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject Claim</span>
                </button>

                <button
                  type="button"
                  disabled={processingId === claim.id}
                  onClick={() => handleReview(claim.id, true)}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover shadow-sm transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{processingId === claim.id ? "Approving..." : "Approve & Issue Handover Pass"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
