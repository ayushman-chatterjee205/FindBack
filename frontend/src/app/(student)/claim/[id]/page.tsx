"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { QRPickupModal } from "@/components/QRPickupModal";
import { api } from "@/lib/api";
import { FoundItem } from "@/types";
import { formatDate, getCategoryEmoji } from "@/lib/utils";

function ClaimContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const claimId = (params?.id as string) || "";
  const matchIdParam = searchParams.get("matchId");

  const [foundItem, setFoundItem] = useState<FoundItem | null>(null);
  const [actualMatchId, setActualMatchId] = useState<string | null>(matchIdParam);
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [proofDescription, setProofDescription] = useState("");
  const [hasReceipt, setHasReceipt] = useState("no");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState<string | null>(null);
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
  const [existingClaim, setExistingClaim] = useState<any | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!claimId) {
      setIsLoadingItem(false);
      return;
    }

    setIsLoadingItem(true);

    // 1. Try to load as found item
    api
      .get<FoundItem>(`/found-items/${claimId}`)
      .then((data) => {
        if (data && data.title) {
          setFoundItem(data);
        }
      })
      .catch(() => {
        // 2. If not found, try loading as match candidate
        api
          .get<any>(`/matches/${claimId}`)
          .then((m) => {
            if (m && m.found_item) {
              setFoundItem(m.found_item);
              setActualMatchId(m.id);
            }
          })
          .catch((err) => {
            console.warn("Could not load found item details:", err);
          });
      })
      .finally(() => {
        setIsLoadingItem(false);
      });

    // Check if user already submitted a claim for this item/match
    api
      .get<any[]>("/claims/my")
      .then((myClaims) => {
        if (Array.isArray(myClaims)) {
          const matchTarget = myClaims.find(
            (c) =>
              c.id === claimId ||
              c.match_id === claimId ||
              (matchIdParam && c.match_id === matchIdParam) ||
              (foundItem && c.item_title === foundItem.title)
          );
          if (matchTarget) {
            setIsAlreadyClaimed(true);
            setExistingClaim(matchTarget);
            setSubmittedClaimId(matchTarget.id);
          }
        }
      })
      .catch(() => {});
  }, [claimId, matchIdParam]);

  const itemTitle = foundItem?.title || existingClaim?.item_title || "Found Custody Item";
  const storageBin = foundItem?.storage_locker_bin || existingClaim?.storage_bin || "Campus Custody Desk";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofDescription.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: any = {
        proof_description: proofDescription.trim(),
      };

      if (actualMatchId) {
        payload.match_id = actualMatchId;
      }
      if (foundItem?.id) {
        payload.found_item_id = foundItem.id;
      } else if (!actualMatchId) {
        payload.found_item_id = claimId;
      }

      const res = await api.post<any>("/claims", payload);

      if (res && res.id) {
        setSubmittedClaimId(res.id);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.warn("API claim submission error:", err);
      setSubmitError(err.message || "Failed to submit challenge proof. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <Link
        href="/browse"
        className="inline-flex items-center space-x-1 text-xs font-medium text-findback-muted hover:text-findback-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Catalog</span>
      </Link>

      <div className="mb-6">
        <span className="text-xs uppercase font-bold tracking-wider text-findback-accent block mb-1">
          Zero-Knowledge Verification
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
          Confirm Ownership Claim
        </h1>
        <p className="text-xs sm:text-sm text-findback-muted mt-1">
          Provide confidential details that match the physical item held in custody.
        </p>
      </div>

      {/* Found Item Context Card */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-findback-border shadow-card flex items-start space-x-4">
        <div className="w-14 h-14 rounded-xl bg-findback-sand border border-findback-border flex items-center justify-center shrink-0 text-2xl overflow-hidden">
          {foundItem?.primary_image_url ? (
            <img
              src={foundItem.primary_image_url}
              alt={itemTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{getCategoryEmoji(foundItem?.category || "Other")}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              In Campus Custody
            </span>
            {foundItem?.category && (
              <span className="text-xs text-findback-muted font-medium">
                {foundItem.category}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-findback-text truncate">
            {itemTitle}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-findback-muted">
            <span className="inline-flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-findback-primary shrink-0" />
              <span>{foundItem?.location_name || "Campus Desk"}</span>
            </span>
            {foundItem?.found_timestamp && (
              <span className="inline-flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-findback-primary shrink-0" />
                <span>{formatDate(foundItem.found_timestamp)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Already Claimed Screen (Process already done, do not show as doable again) */}
      {isAlreadyClaimed && !isSubmitted ? (
        <div className="bg-white rounded-2xl border border-findback-border p-6 sm:p-8 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-findback-text">
            Claim Already Submitted
          </h2>
          <p className="text-xs text-findback-muted leading-relaxed max-w-md mx-auto">
            You have already filed an ownership claim for this item. Your verification answers are recorded and securely logged in the custody registry.
          </p>

          <div className="p-4 rounded-xl bg-findback-bg border border-findback-border text-xs text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-findback-muted">Current Claim Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  existingClaim?.status === "APPROVED"
                    ? "bg-emerald-100 text-emerald-800"
                    : existingClaim?.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {existingClaim?.status === "APPROVED"
                  ? "CLAIM APPROVED ✓"
                  : existingClaim?.status === "COMPLETED"
                  ? "HANDOVER COMPLETED"
                  : "PENDING STAFF REVIEW"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-findback-muted">Custody Handover Point:</span>
              <strong className="text-findback-text">{storageBin}</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-findback-border flex flex-col sm:flex-row items-center justify-center gap-3">
            {existingClaim?.status === "APPROVED" && (
              <button
                onClick={() => setShowQR(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover transition-colors shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Show Pickup QR Pass</span>
              </button>
            )}
            <Link
              href="/my-reports"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-medium text-findback-primary bg-findback-sand hover:bg-findback-sand/80 transition-colors"
            >
              Track in My Reports →
            </Link>
          </div>
        </div>
      ) : isSubmitted ? (
        <div className="bg-white rounded-2xl border border-findback-border p-6 sm:p-8 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-findback-accent flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-findback-text">
            Proof Submitted for Verification
          </h2>
          <p className="text-xs text-findback-muted leading-relaxed max-w-md mx-auto">
            The custody desk officer is comparing your submitted verification answer against the physical item. You will be notified once reviewed.
          </p>

          <div className="p-3.5 rounded-xl bg-findback-bg border border-findback-border text-xs text-findback-text flex items-center justify-between">
            <span className="text-findback-muted">Custody Handover Point:</span>
            <strong className="text-findback-primary">{storageBin}</strong>
          </div>

          <div className="pt-4 border-t border-findback-border flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/my-reports"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover transition-colors shadow-sm"
            >
              <span>Track in My Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-findback-border p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Confidential notice */}
            <div className="p-3.5 rounded-xl bg-findback-bg border border-findback-border flex items-start space-x-2.5 text-xs text-findback-muted">
              <Lock className="w-4 h-4 text-findback-primary shrink-0 mt-0.5" />
              <span>
                To protect against false claims, your answers will only be visible to the custody officer reviewing the physical item.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                Describe unique distinguishing marks or hidden contents
              </label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Yellow Pikachu sticker on back, serial number ending in 402, scratches on top edge, specific keychains attached."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm text-findback-text placeholder:text-findback-muted outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                Do you have a purchase bill, warranty card, or reference photo?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasReceipt("yes")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    hasReceipt === "yes"
                      ? "bg-findback-primary text-white border-findback-primary"
                      : "bg-findback-bg border-findback-border text-findback-muted hover:text-findback-text"
                  }`}
                >
                  Yes, available
                </button>
                <button
                  type="button"
                  onClick={() => setHasReceipt("no")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    hasReceipt === "no"
                      ? "bg-findback-primary text-white border-findback-primary"
                      : "bg-findback-bg border-findback-border text-findback-muted hover:text-findback-text"
                  }`}
                >
                  No, just description
                </button>
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !proofDescription.trim()}
                className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover disabled:opacity-50 shadow-sm transition-all group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Challenge...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Verification Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <QRPickupModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        claimId={submittedClaimId || claimId}
        itemTitle={itemTitle}
        storageBin={storageBin}
      />
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-findback-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-findback-muted">Loading claim portal...</p>
        </div>
      }
    >
      <ClaimContent />
    </Suspense>
  );
}
