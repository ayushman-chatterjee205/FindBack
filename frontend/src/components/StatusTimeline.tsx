import React from "react";
import { Check, Clock, ShieldCheck, HeartHandshake } from "lucide-react";
import { ItemStatus } from "@/types";

interface StatusTimelineProps {
  currentStatus: ItemStatus;
  lostDate?: string;
  matchedDate?: string;
  verifiedDate?: string;
  returnedDate?: string;
}

const STEPS: { key: ItemStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "LOST", label: "Lost & Reported", desc: "Report logged in campus registry", icon: Clock },
  { key: "MATCHED", label: "Matched", desc: "Candidate found with high confidence", icon: Check },
  { key: "VERIFIED", label: "Verified", desc: "Ownership challenge proof approved", icon: ShieldCheck },
  { key: "RETURNED", label: "Returned", desc: "Physical custody closed with dynamic OTP", icon: HeartHandshake },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  lostDate,
  matchedDate,
  verifiedDate,
  returnedDate,
}) => {
  const statusOrder: ItemStatus[] = ["LOST", "MATCHED", "VERIFIED", "RETURNED"];
  
  // Normalize IN_CUSTODY to step 1/2
  const normalizedStatus = currentStatus === "IN_CUSTODY" ? "LOST" : currentStatus;
  const currentIndex = statusOrder.indexOf(normalizedStatus);

  const dates: Record<string, string | undefined> = {
    LOST: lostDate || "Logged",
    MATCHED: matchedDate,
    VERIFIED: verifiedDate,
    RETURNED: returnedDate,
  };

  return (
    <div className="py-2">
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-findback-border">
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative group">
              {/* Dot / Indicator */}
              <div
                className={`absolute -left-6 top-0.5 w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-findback-accent border-findback-accent text-white"
                    : "bg-white border-findback-border text-findback-muted"
                } ${isCurrent ? "ring-4 ring-findback-accent/20" : ""}`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-findback-border" />
                )}
              </div>

              {/* Text content */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isCompleted ? "text-findback-text" : "text-findback-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                  {dates[step.key] && (
                    <span className="text-[10px] text-findback-muted font-medium">
                      {dates[step.key]}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-findback-muted leading-relaxed mt-0.5">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
