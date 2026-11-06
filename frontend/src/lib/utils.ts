import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ItemCategory, ItemStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(isoString);
  } catch {
    return isoString;
  }
}

export function getCategoryEmoji(category: ItemCategory | string): string {
  switch (category) {
    case "Electronics":
      return "📱";
    case "IDs & Cards":
      return "🪪";
    case "Keys":
      return "🔑";
    case "Bags & Wallets":
      return "🎒";
    case "Accessories":
      return "👓";
    case "Books & Notes":
      return "📚";
    case "Clothing":
      return "🧥";
    default:
      return "📦";
  }
}

export function getStatusDetails(status: ItemStatus) {
  switch (status) {
    case "LOST":
      return {
        label: "Lost / Searching",
        colorClass: "bg-status-lost-bg text-status-lost border-orange-200",
        dotClass: "bg-status-lost",
      };
    case "IN_CUSTODY":
      return {
        label: "In Custody",
        colorClass: "bg-amber-50 text-amber-700 border-amber-200",
        dotClass: "bg-amber-600",
      };
    case "MATCHED":
      return {
        label: "Potential Match",
        colorClass: "bg-status-matched-bg text-status-matched border-amber-300",
        dotClass: "bg-status-matched",
      };
    case "VERIFIED":
      return {
        label: "Claim Verified",
        colorClass: "bg-status-verified-bg text-status-verified border-blue-200",
        dotClass: "bg-status-verified",
      };
    case "RETURNED":
      return {
        label: "Returned",
        colorClass: "bg-status-returned-bg text-status-returned border-emerald-200",
        dotClass: "bg-status-returned",
      };
    default:
      return {
        label: status,
        colorClass: "bg-gray-100 text-gray-700 border-gray-200",
        dotClass: "bg-gray-500",
      };
  }
}
