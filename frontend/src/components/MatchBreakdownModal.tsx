"use client";

import React from "react";
import Link from "next/link";
import { X, Check, ArrowRight, ShieldCheck, MapPin, Calendar, Tag } from "lucide-react";
import { MatchCandidate } from "@/types";
import { formatDate } from "@/lib/utils";

interface MatchBreakdownModalProps {
  match: MatchCandidate | null;
  onClose: () => void;
  isClaimed?: boolean;
  claimStatus?: string;
}

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  match,
  onClose,
  isClaimed = false,
  claimStatus,
}) => {
  if (!match) return null;

  const foundItem = match.found_item;
  const lostItem = match.lost_item;
  const confidence = Math.round(match.composite_score);
  const alreadyClaimed = isClaimed || match.match_status === "CLAIMED" || match.match_status === "VERIFIED" || match.match_status === "RETURNED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-findback-border w-full max-w-lg shadow-lift overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-findback-border flex items-center justify-between bg-findback-bg">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-findback-accent">
              Smart Comparison
            </span>
            <h3 className="text-base font-bold text-findback-text">
              Potential Item Match
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-findback-muted hover:text-findback-text hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Comparison summary card */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-findback-sand/50 border border-findback-border text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-findback-muted tracking-wider block mb-1">
                Your Lost Report
              </span>
              <p className="font-semibold text-findback-text">
                {lostItem?.title || "Your Item"}
              </p>
              <p className="text-findback-muted mt-0.5">
                {lostItem?.location_name || "Campus"}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-findback-muted tracking-wider block mb-1">
                Found Custody Item
              </span>
              <p className="font-semibold text-findback-text">
                {foundItem?.title || "Registered Found Item"}
              </p>
              <p className="text-findback-muted mt-0.5">
                {foundItem?.location_name || "Campus Desk"}
              </p>
            </div>
          </div>

          {/* WHY THIS MAY MATCH - Clean 4-signal breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-findback-primary">
                Why this may match
              </span>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-findback-accent text-xs font-bold">
                <span>{confidence}% Confidence</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-findback-bg border border-findback-border/70">
                <Check className="w-4 h-4 text-findback-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-findback-text">Similar description</span>
                  <p className="text-findback-muted text-[11px] mt-0.5">
                    Category ({foundItem?.category}) and model keywords match semantic intent.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-findback-bg border border-findback-border/70">
                <Check className="w-4 h-4 text-findback-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-findback-text">Similar appearance</span>
                  <p className="text-findback-muted text-[11px] mt-0.5">
                    Visual embeddings align across physical form factors and colors.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-findback-bg border border-findback-border/70">
                <Check className="w-4 h-4 text-findback-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-findback-text">Same campus area</span>
                  <p className="text-findback-muted text-[11px] mt-0.5">
                    Found in high proximity to where you last reported seeing it.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-findback-bg border border-findback-border/70">
                <Check className="w-4 h-4 text-findback-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-findback-text">Compatible time</span>
                  <p className="text-findback-muted text-[11px] mt-0.5">
                    Turned in shortly after the approximate loss window.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Custody Info */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              This item is securely held in custody at <strong>{foundItem?.storage_locker_bin || "Security Vault"}</strong>.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-findback-muted hover:text-findback-text transition-colors"
            >
              Close
            </button>

            {alreadyClaimed ? (
              <div className="inline-flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {match.match_status === "VERIFIED"
                      ? "Claim Approved ✓"
                      : match.match_status === "RETURNED"
                      ? "Item Returned ✓"
                      : "Claim In Review"}
                  </span>
                </span>
                <Link
                  href="/my-reports"
                  onClick={onClose}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover transition-colors"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <Link
                href={`/claim/${match.found_item_id || match.found_item?.id || match.id}?matchId=${match.id}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all group"
              >
                <span>This Is Mine — Verify Claim</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover-shift" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
