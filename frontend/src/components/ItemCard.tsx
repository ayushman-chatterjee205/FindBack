import React from "react";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { getCategoryEmoji, getStatusDetails, formatDate } from "@/lib/utils";
import { ItemCategory, ItemStatus } from "@/types";

interface ItemCardProps {
  id: string;
  title: string;
  category: ItemCategory;
  locationName: string;
  date: string;
  status: ItemStatus;
  imageUrl?: string;
  matchScore?: number;
  onViewMatch?: () => void;
  isClickable?: boolean;
  isCensored?: boolean;
  onCensoredClick?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  category,
  locationName,
  date,
  status,
  imageUrl,
  matchScore,
  onViewMatch,
  isClickable = true,
  isCensored = false,
  onCensoredClick,
}) => {
  const statusInfo = getStatusDetails(status);

  const handleCardClick = () => {
    if (isCensored && onCensoredClick) {
      onCensoredClick();
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-xl border border-findback-border p-4 shadow-card card-hover flex flex-col justify-between transition-all group ${
        isCensored ? "cursor-pointer" : ""
      }`}
    >
      <div>
        {/* Item Photo / Thumbnail Placeholder */}
        <div className="w-full h-44 rounded-lg bg-findback-sand/60 border border-findback-border/60 overflow-hidden flex items-center justify-center relative mb-3.5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-findback-muted">
              <span className="text-4xl mb-1">{getCategoryEmoji(category)}</span>
              <span className="text-xs font-medium text-findback-muted-light">Photo Registered</span>
            </div>
          )}

          {/* Optional Match Confidence Badge */}
          {matchScore !== undefined && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-findback-primary text-white text-xs font-semibold shadow-sm flex items-center space-x-1">
              <span className={isCensored ? "filter blur-[4px] select-none" : ""}>{Math.round(matchScore)}%</span>
              <span className="text-[10px] opacity-80">match</span>
            </div>
          )}
        </div>

        {/* Category Badge & Title */}
        <div className="mb-2">
          <div className="flex items-center space-x-1.5 text-xs text-findback-muted font-medium mb-1">
            <span>{getCategoryEmoji(category)}</span>
            <span>{category}</span>
          </div>
          <h3 className={`font-semibold text-base text-findback-text leading-snug line-clamp-1 group-hover:text-findback-primary transition-colors ${
            isCensored ? "filter blur-[5px] select-none" : ""
          }`}>
            {title}
          </h3>
        </div>

        {/* Location and Date Metadata */}
        <div className="space-y-1.5 text-xs text-findback-muted mb-3.5">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-findback-muted shrink-0" />
            <span className={`truncate ${isCensored ? "filter blur-[4px] select-none" : ""}`}>
              {locationName || "Campus Zone"}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-findback-muted shrink-0" />
            <span className={isCensored ? "filter blur-[4px] select-none" : ""}>
              {formatDate(date)}
            </span>
          </div>
        </div>
      </div>

      {/* Status & Action */}
      <div className="pt-3 border-t border-findback-border/60 flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusInfo.colorClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dotClass}`} />
          {statusInfo.label}
        </span>

        {isCensored ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCensoredClick?.();
            }}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-findback-primary hover:text-findback-primary-hover transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : onViewMatch ? (
          <button
            onClick={onViewMatch}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-findback-accent hover:text-findback-accent-hover transition-colors"
          >
            <span>View Match</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            href={`/browse?id=${id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-findback-primary hover:text-findback-primary-hover transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
