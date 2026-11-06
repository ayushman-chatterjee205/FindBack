"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Clock,
  RefreshCw,
  AlertCircle,
  Inbox,
  MapPin,
  User,
  PackageCheck,
  Check,
  X,
} from "lucide-react";
import { api } from "@/lib/api";

interface ApprovedClaim {
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

interface ReturnedSummary {
  title: string;
  studentName?: string;
  rollNumber?: string;
  storageBin?: string;
  returnedAt?: string;
  claimId?: string;
}

export default function StaffHandoverPage() {
  const [pinInput, setPinInput] = useState("");
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [approvedClaims, setApprovedClaims] = useState<ApprovedClaim[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [returnedItem, setReturnedItem] = useState<ReturnedSummary | null>(null);

  const fetchApprovedClaims = useCallback(async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const data = await api.get<ApprovedClaim[]>("/claims/approved");
      if (Array.isArray(data)) {
        setApprovedClaims(data);
      }
    } catch (err) {
      console.warn("Could not fetch approved claims waiting for pickup:", err);
    } finally {
      setIsLoadingList(false);
      if (showSpin) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedClaims();
    const interval = setInterval(() => {
      fetchApprovedClaims(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchApprovedClaims]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin) return;

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await api.post<{
        success: boolean;
        message: string;
        item_title: string;
        claim_id: string;
        student_name?: string;
        student_roll?: string;
        storage_bin?: string;
      }>("/claims/handover-verify", {
        handover_otp: cleanPin,
        claim_id: selectedClaimId || undefined,
      });

      // Find candidate in approved claims list for fallback info
      const matchedLocalClaim = approvedClaims.find(
        (c) => c.id === res.claim_id || c.id === selectedClaimId
      );

      setReturnedItem({
        title: res.item_title || matchedLocalClaim?.itemTitle || "Verified Campus Item",
        studentName: res.student_name || matchedLocalClaim?.studentName || "Verified Student Claimant",
        rollNumber: res.student_roll || matchedLocalClaim?.studentRoll || "Enrolled Campus Student",
        storageBin: res.storage_bin || matchedLocalClaim?.storageBin || "Campus Custody Desk",
        returnedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        claimId: res.claim_id,
      });
      setPinInput("");
      setSelectedClaimId(null);
      fetchApprovedClaims(false);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Invalid 6-digit PIN. Please ask the student to open My Reports and tap 'Show Digital Pickup Pass' to get their live PIN."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setReturnedItem(null);
    setErrorMessage(null);
    setPinInput("");
    setSelectedClaimId(null);
    fetchApprovedClaims(true);
  };

  const selectedClaim = approvedClaims.find((c) => c.id === selectedClaimId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-findback-primary block">
              Physical Handover Desk
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Auto-Sync Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
            Custody Handover Console
          </h1>
          <p className="text-xs sm:text-sm text-findback-muted mt-1">
            Verify the student&apos;s dynamic 6-digit OTP pass to complete physical item handover.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => fetchApprovedClaims(true)}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-findback-border bg-white text-xs font-semibold text-findback-muted hover:text-findback-text hover:bg-findback-bg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-findback-primary" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/verify"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-findback-sand text-findback-primary hover:bg-findback-sand/80 transition-all border border-findback-border"
          >
            <span>Verify Claims</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Verification Form or Successfully Returned Box */}
        <div className="lg:col-span-7">
          {returnedItem ? (
            /* Prominent Successfully Returned Box */
            <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 sm:p-8 shadow-lift space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CUSTODY CLOSED &amp; RETURNED</span>
                </span>
                <span className="text-xs text-findback-muted font-medium">
                  {returnedItem.returnedAt}
                </span>
              </div>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <PackageCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-findback-text">
                  Successfully Handed Over!
                </h2>
                <p className="text-xs text-findback-muted max-w-sm mx-auto">
                  Physical item custody has been returned to the verified rightful owner.
                </p>
              </div>

              {/* Item & Claimant Details Card */}
              <div className="p-4 rounded-xl bg-findback-bg/70 border border-findback-border space-y-3 text-xs">
                <div className="flex items-start justify-between pb-2 border-b border-findback-border/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-findback-muted block">
                      Returned Item
                    </span>
                    <strong className="text-sm font-bold text-findback-text">
                      {returnedItem.title}
                    </strong>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    RETURNED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-findback-muted block mb-0.5">
                      Student Claimant
                    </span>
                    <p className="font-semibold text-findback-text">
                      {returnedItem.studentName}
                    </p>
                    <p className="text-findback-muted text-[11px]">
                      Roll: {returnedItem.rollNumber}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-findback-muted block mb-0.5">
                      Storage Locker Bin
                    </span>
                    <p className="font-semibold text-emerald-800">
                      {returnedItem.storageBin}
                    </p>
                    <p className="text-emerald-700 text-[11px] font-medium">
                      ✓ Bin status updated to Vacant
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-findback-border/60 flex items-center justify-between text-[11px] text-findback-muted">
                  <span>Institutional Audit Trail:</span>
                  <span className="font-mono font-semibold text-findback-text">
                    LOGGED &amp; SIGNED
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/congratulations?title=${encodeURIComponent(returnedItem.title)}&name=${encodeURIComponent(returnedItem.studentName || "")}&roll=${encodeURIComponent(returnedItem.rollNumber || "")}&loc=${encodeURIComponent(returnedItem.storageBin || "Campus Desk")}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all shadow-sm"
                >
                  <span>🎉 View Student Celebration</span>
                </Link>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Process Another Handover</span>
                </button>
                <Link
                  href="/inventory"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-medium text-findback-muted hover:text-findback-text"
                >
                  <span>Check Storage Vault Inventory →</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-findback-border p-6 sm:p-8 shadow-card space-y-6">
              {/* Terminal Banner */}
              <div className="p-5 rounded-xl border border-findback-border bg-findback-bg/60 text-center flex flex-col items-center justify-center">
                <div className="w-11 h-11 rounded-xl bg-findback-sand flex items-center justify-center text-findback-primary mb-2 shadow-sm">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-findback-text">
                  Campus Handover Terminal
                </span>
                <span className="text-[11px] text-findback-muted mt-0.5">
                  Ask student to open My Reports and tap &ldquo;Show Digital Pickup Pass&rdquo;
                </span>
              </div>

              {/* Active Selection Indicator */}
              {selectedClaim && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">
                        Selected for handover:
                      </span>
                      <strong className="text-amber-950">{selectedClaim.itemTitle}</strong>
                      <span className="text-amber-800 ml-1">({selectedClaim.studentName})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClaimId(null)}
                    className="p-1 rounded text-amber-700 hover:text-amber-900"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 6-Digit OTP Form */}
              <form onSubmit={handleVerify} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text">
                      Student&apos;s 6-Digit Verification PIN
                    </label>
                    <span className="text-[10px] text-findback-muted">Numeric only</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary text-center font-mono text-3xl font-bold tracking-widest text-findback-text outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || pinInput.length < 6}
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover disabled:opacity-50 shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  {isVerifying ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validating Pass &amp; Closing Custody...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify PIN &amp; Complete Handover</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Live List of Approved Items Waiting for Collection */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-findback-border p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-findback-border">
            <div>
              <h3 className="text-sm font-bold text-findback-text">
                Awaiting Physical Collection
              </h3>
              <p className="text-[11px] text-findback-muted">
                Approved claims ready for desk pickup
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {approvedClaims.length}
            </span>
          </div>

          {isLoadingList ? (
            <div className="py-8 text-center text-xs text-findback-muted">
              <div className="w-5 h-5 border-2 border-findback-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Checking pickup queue...</span>
            </div>
          ) : approvedClaims.length === 0 ? (
            <div className="py-8 text-center text-xs text-findback-muted space-y-1">
              <Inbox className="w-7 h-7 mx-auto text-gray-300 mb-2" />
              <p className="font-semibold text-findback-text">No items pending pickup</p>
              <p className="text-[11px] leading-relaxed max-w-xs mx-auto">
                When student claims are approved in Verify, they will show here until collected at the desk.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {approvedClaims.map((claim) => {
                const isSelected = selectedClaimId === claim.id;
                return (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaimId(isSelected ? null : claim.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "border-findback-primary bg-findback-sand/50 shadow-sm"
                        : "border-findback-border bg-findback-bg/40 hover:bg-findback-bg"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-findback-primary block">
                          {claim.storageBin}
                        </span>
                        <h4 className="text-xs font-bold text-findback-text">
                          {claim.itemTitle}
                        </h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        READY
                      </span>
                    </div>

                    <div className="text-[11px] text-findback-muted flex items-center justify-between">
                      <div>
                        <span>Claimant: </span>
                        <strong className="text-findback-text">{claim.studentName}</strong>
                        {claim.studentRoll && claim.studentRoll !== "N/A" && (
                          <span> ({claim.studentRoll})</span>
                        )}
                      </div>
                      <span className="text-[10px] text-findback-primary font-semibold">
                        {isSelected ? "Selected ✓" : "Click to select"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
