"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Inbox,
  AlertCircle,
  X,
  RefreshCw,
  Clock,
  CheckCircle2,
  FileText,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { StatusTimeline } from "@/components/StatusTimeline";
import { MatchBreakdownModal } from "@/components/MatchBreakdownModal";
import { QRPickupModal } from "@/components/QRPickupModal";
import { LostItem, MatchCandidate } from "@/types";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface StudentClaim {
  id: string;
  match_id: string;
  student_id: string;
  item_title?: string;
  storage_bin?: string;
  proof_description: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  created_at: string;
}

export default function MyReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState<(LostItem & { matches?: MatchCandidate[] })[]>([]);
  const [claims, setClaims] = useState<StudentClaim[]>([]);
  const [activeTab, setActiveTab] = useState<"reports" | "claims">("reports");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchCandidate | null>(null);
  const [qrModalData, setQrModalData] = useState<{ id: string; title: string; bin?: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [reportsRes, claimsRes] = await Promise.allSettled([
        api.get<(LostItem & { matches?: MatchCandidate[] })[]>("/lost-items/my"),
        api.get<StudentClaim[]>("/claims/my"),
      ]);

      if (reportsRes.status === "fulfilled" && Array.isArray(reportsRes.value)) {
        const withMatches = await Promise.all(
          reportsRes.value.map(async (item) => {
            try {
              const matches = await api.get<MatchCandidate[]>(`/matches/lost/${item.id}`);
              return { ...item, matches };
            } catch {
              return { ...item, matches: [] };
            }
          })
        );
        setReports(withMatches);
      } else {
        setReports([]);
      }

      if (claimsRes.status === "fulfilled" && Array.isArray(claimsRes.value)) {
        setClaims(claimsRes.value);
      } else {
        setClaims([]);
      }
    } catch {
      setReports([]);
      setClaims([]);
    } finally {
      setIsLoading(false);
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
    const interval = setInterval(() => {
      fetchData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleReportLostClick = () => {
    if (!user) {
      setAuthError("Sign in to report lost items");
      return;
    }
    router.push("/report-lost");
  };

  // Filter out recovered/returned reports so they do not stay intact in "Reported Lost"
  // Once recovered, the item is exclusively shown and celebrated under "Ownership Claims"
  const activeReports = useMemo(() => {
    return reports.filter((report) => {
      // 1. If status is RETURNED, it has been recovered and handed over
      if (report.status === "RETURNED") return false;

      // 2. If any match candidate is RETURNED, it has been recovered
      if (report.matches?.some((m) => m.match_status === "RETURNED")) return false;

      // 3. If there is a completed claim for this item, it is recovered
      const isClaimCompleted = claims.some(
        (c) =>
          c.status === "COMPLETED" &&
          ((report.matches && report.matches.some((m) => m.id === c.match_id)) ||
            (c.item_title && report.title && c.item_title.trim().toLowerCase() === report.title.trim().toLowerCase()))
      );
      if (isClaimCompleted) return false;

      // 4. If the item's ownership claim is verified / approved (confirmed found in custody),
      // it is now managed directly under Ownership Claims
      const isClaimApproved = claims.some(
        (c) =>
          c.status === "APPROVED" &&
          ((report.matches && report.matches.some((m) => m.id === c.match_id)) ||
            (c.item_title && report.title && c.item_title.trim().toLowerCase() === report.title.trim().toLowerCase()))
      );
      if (report.status === "VERIFIED" && isClaimApproved) {
        return false;
      }

      return true;
    });
  }, [reports, claims]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Auth Error Banner */}
      {authError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-red-900">Sign In Required</p>
              <p className="text-xs sm:text-sm font-semibold text-red-800">{authError}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
            >
              Sign In Now →
            </Link>
            <button
              onClick={() => setAuthError(null)}
              className="text-red-400 hover:text-red-700 p-1 text-xs"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-findback-primary block mb-1">
            Student Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
            My Belongings & Claims
          </h1>
          <p className="text-xs sm:text-sm text-findback-muted mt-1">
            Live tracking for reported items, AI match evaluations, and ownership verification challenges.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchData(false)}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-findback-border bg-white text-findback-muted hover:text-findback-text hover:bg-findback-bg transition-colors disabled:opacity-50"
            title="Refresh reports"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-findback-primary" : ""}`} />
          </button>
          <button
            onClick={handleReportLostClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost Item</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-findback-border space-x-6 mb-8">
        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center space-x-2 ${
            activeTab === "reports"
              ? "text-findback-primary border-b-2 border-findback-primary"
              : "text-findback-muted hover:text-findback-text"
          }`}
        >
          <span>Reported Lost</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-100 text-orange-800 font-bold">
            {activeReports.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("claims")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center space-x-2 ${
            activeTab === "claims"
              ? "text-findback-primary border-b-2 border-findback-primary"
              : "text-findback-muted hover:text-findback-text"
          }`}
        >
          <span>Ownership Claims</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {claims.length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-findback-border p-16 text-center shadow-card max-w-lg mx-auto">
          <div className="w-8 h-8 border-2 border-findback-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-findback-muted font-medium">
            Synchronizing your campus records and AI match candidates...
          </p>
        </div>
      ) : activeTab === "reports" ? (
        activeReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-findback-border p-12 text-center shadow-card max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-findback-sand flex items-center justify-center text-findback-primary mx-auto mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-findback-text mb-1">
              No active lost reports
            </h3>
            <p className="text-xs text-findback-muted leading-relaxed mb-6">
              {claims.length > 0
                ? "Your reported belongings have been recovered or are currently active under Ownership Claims."
                : "You haven't filed any active lost reports. If you misplaced a belonging on campus, report it so our AI engine can monitor incoming custody inventory."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {claims.length > 0 && (
                <button
                  onClick={() => setActiveTab("claims")}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>View Ownership Claims ({claims.length})</span>
                </button>
              )}
              <button
                onClick={handleReportLostClick}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all group"
              >
                <span>Report Lost Item</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {activeReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-findback-border p-5 sm:p-6 shadow-card space-y-6"
              >
                {/* Top row: Item info & Current status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-findback-border/70">
                  <div>
                    <span className="text-xs font-semibold text-findback-muted uppercase tracking-wider block mb-1">
                      {report.category} · Last seen at {report.location_name || "Campus"}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-findback-text">
                      {report.title}
                    </h2>
                    <p className="text-xs text-findback-muted mt-1 max-w-xl leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Status Action CTA */}
                  <div className="shrink-0 flex items-center space-x-2">
                    {report.status === "RETURNED" && (
                      <Link
                        href={`/congratulations?title=${encodeURIComponent(report.title)}`}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all"
                      >
                        <span>🎉 View Return Celebration</span>
                      </Link>
                    )}
                    {report.status === "VERIFIED" && (
                      <button
                        onClick={() => {
                          const relevantClaim = claims.find(
                            (c) =>
                              (report.matches && report.matches.some((m) => m.id === c.match_id)) ||
                              c.item_title === report.title ||
                              c.status === "APPROVED"
                          );
                          setQrModalData({
                            id: relevantClaim ? relevantClaim.id : report.id,
                            title: report.title,
                            bin: relevantClaim?.storage_bin,
                          });
                        }}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-findback-accent text-white hover:bg-findback-accent-hover shadow-sm transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>View Pickup QR Pass</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Split layout: Status Timeline & Matches Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Vertical Progress Timeline */}
                  <div className="md:col-span-4 bg-findback-bg/50 rounded-xl p-4 border border-findback-border/70">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-findback-muted block mb-3">
                      Progress Tracker
                    </span>
                    <StatusTimeline currentStatus={report.status} />
                  </div>

                  {/* Potential Matches Section */}
                  <div className="md:col-span-8">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-findback-text">
                          Candidate Matches
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-status-matched border border-amber-200">
                          {report.matches_count || (report.matches ? report.matches.length : 0)} found
                        </span>
                      </div>
                    </div>

                    {report.matches && report.matches.length > 0 ? (
                      <div className="space-y-3">
                        {report.matches.map((match) => {
                          const matchClaim = claims.find((c) => c.match_id === match.id);
                          const isMatchClaimed = Boolean(
                            matchClaim ||
                            match.match_status === "CLAIMED" ||
                            match.match_status === "VERIFIED" ||
                            match.match_status === "RETURNED" ||
                            report.status === "VERIFIED" ||
                            report.status === "RETURNED"
                          );
                          const currentClaimStatus = matchClaim ? matchClaim.status : (match.match_status === "VERIFIED" || report.status === "VERIFIED" ? "APPROVED" : match.match_status === "RETURNED" ? "COMPLETED" : "PENDING");

                          return (
                            <div
                              key={match.id}
                              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isMatchClaimed
                                  ? "border-emerald-200 bg-emerald-50/20"
                                  : "border-findback-border bg-white shadow-subtle hover:border-findback-primary"
                              }`}
                            >
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-semibold text-findback-text">
                                    {match.found_item?.title}
                                  </span>
                                  <span className="text-findback-muted text-xs">·</span>
                                  <span className="text-xs text-findback-muted">
                                    {match.found_item?.location_name}
                                  </span>
                                </div>
                                <p className="text-[11px] text-findback-muted">
                                  Found in custody at {match.found_item?.storage_locker_bin || "Campus Desk"}
                                </p>
                              </div>

                              <div className="flex items-center space-x-3 self-end sm:self-center">
                                <div className="text-right">
                                  <span className="text-xs font-bold text-findback-primary block">
                                    {Math.round(match.composite_score)}%
                                  </span>
                                  <span className="text-[10px] text-findback-muted">
                                    Confidence
                                  </span>
                                </div>

                                {isMatchClaimed ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                                      <span>
                                        {currentClaimStatus === "APPROVED"
                                          ? "Claim Approved ✓"
                                          : currentClaimStatus === "COMPLETED"
                                          ? "Handover Completed ✓"
                                          : "Claim Under Review"}
                                      </span>
                                    </span>
                                    {currentClaimStatus === "APPROVED" ? (
                                      <button
                                        onClick={() =>
                                          setQrModalData({
                                            id: matchClaim ? matchClaim.id : match.id,
                                            title: match.found_item?.title || report.title,
                                            bin: matchClaim?.storage_bin || match.found_item?.storage_locker_bin,
                                          })
                                        }
                                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-findback-accent text-white hover:bg-findback-accent-hover shadow-sm transition-all"
                                      >
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Pickup Pass</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setActiveTab("claims")}
                                        className="text-[11px] font-semibold text-findback-primary hover:underline px-1 py-1"
                                      >
                                        View in Claims →
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setSelectedMatch(match)}
                                    className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover transition-colors"
                                  >
                                    <span>View Match</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-dashed border-findback-border text-center bg-findback-bg/30">
                        <p className="text-xs text-findback-muted">
                          Searching campus custody inventory. We will notify you immediately when a match appears.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Claims Tab */
        claims.length === 0 ? (
          <div className="bg-white rounded-2xl border border-findback-border p-12 text-center shadow-card max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-findback-accent flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-findback-text mb-1">
              No ownership claims filed
            </h3>
            <p className="text-xs text-findback-muted leading-relaxed mb-6">
              When you identify your misplaced belongings in the campus found inventory, click &ldquo;Claim This Item&rdquo; to submit confidential verification proof.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
            >
              <span>Browse Custody Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-findback-border p-5 sm:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        claim.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : claim.status === "PENDING"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : claim.status === "COMPLETED"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {claim.status === "APPROVED"
                        ? "CLAIM APPROVED ✓"
                        : claim.status === "PENDING"
                        ? "PENDING STAFF REVIEW"
                        : claim.status === "COMPLETED"
                        ? "HANDOVER COMPLETED"
                        : "CLAIM REJECTED"}
                    </span>
                    <span className="text-[11px] text-findback-muted">
                      {formatDate(claim.created_at)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-findback-text">
                    {claim.item_title || "Custody Item Claim"}
                  </h3>

                  <div className="flex items-center space-x-4 text-xs text-findback-muted">
                    <span className="inline-flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-findback-primary shrink-0" />
                      <span>{claim.storage_bin || "Campus Custody Desk"}</span>
                    </span>
                  </div>

                  <p className="text-xs text-findback-text/80 bg-findback-bg/60 p-2.5 rounded-xl border border-findback-border/70 max-w-xl">
                    <strong className="text-findback-text">Your Submitted Proof:</strong> &ldquo;
                    {claim.proof_description}&rdquo;
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-2 self-end sm:self-center">
                  {claim.status === "APPROVED" ? (
                    <button
                      onClick={() =>
                        setQrModalData({
                          id: claim.id,
                          title: claim.item_title || "Claimed Item",
                          bin: claim.storage_bin,
                        })
                      }
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-findback-accent text-white hover:bg-findback-accent-hover shadow-sm transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Show Digital Pickup Pass</span>
                    </button>
                  ) : claim.status === "PENDING" ? (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>In review by custody desk</span>
                    </div>
                  ) : claim.status === "COMPLETED" ? (
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Collected</span>
                      </div>
                      <Link
                        href={`/congratulations?title=${encodeURIComponent(claim.item_title || "Campus Item")}&loc=${encodeURIComponent(claim.storage_bin || "Campus Desk")}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs"
                      >
                        <span>🎉 Celebrate</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl font-medium">
                      Verification failed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Match Breakdown Modal */}
      <MatchBreakdownModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        isClaimed={Boolean(
          selectedMatch &&
          (claims.some((c) => c.match_id === selectedMatch.id) ||
           selectedMatch.match_status === "CLAIMED" ||
           selectedMatch.match_status === "VERIFIED" ||
           selectedMatch.match_status === "RETURNED")
        )}
        claimStatus={
          selectedMatch
            ? claims.find((c) => c.match_id === selectedMatch.id)?.status ||
              (selectedMatch.match_status === "VERIFIED" ? "APPROVED" : selectedMatch.match_status === "RETURNED" ? "COMPLETED" : "PENDING")
            : undefined
        }
      />

      {/* Dynamic QR Pickup Pass Modal */}
      {qrModalData && (
        <QRPickupModal
          isOpen={!!qrModalData}
          onClose={() => setQrModalData(null)}
          claimId={qrModalData.id}
          itemTitle={qrModalData.title}
          storageBin={qrModalData.bin}
        />
      )}
    </div>
  );
}
