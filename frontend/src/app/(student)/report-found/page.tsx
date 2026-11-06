"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Package, MapPin, Upload, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { ItemCategory } from "@/types";
import { useCategories } from "@/lib/useCategories";
import { LocationPicker } from "@/components/LocationPicker";
import { api } from "@/lib/api";

const DROP_OFF_LOCATIONS = [
  "Central Block Main Custody Desk (Floor 1)",
  "ICT Block Security & Helpdesk (Floor 1)",
  "CME Block Department Office (Floor 1)",
  "Central Library Front Circulation Counter",
  "Campus Canteen Lost & Found Counter",
];

export default function ReportFoundPage() {
  const router = useRouter();
  const { categoryNames } = useCategories();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Electronics");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [location, setLocation] = useState("ICT Block • Floor 1");
  const [dropOffDesk, setDropOffDesk] = useState(DROP_OFF_LOCATIONS[0]);
  const [description, setDescription] = useState("");
  const [unrevealedDetails, setUnrevealedDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const finalCategory = isCustomCategory ? (customCategory.trim() || "Other") : category;
      const foundTimestamp = new Date().toISOString();
      await api.post<any>("/found-items", {
        title,
        category: finalCategory,
        storage_locker_bin: dropOffDesk,
        location_name: location,
        found_timestamp: foundTimestamp,
        description,
        secret_details: unrevealedDetails.trim() || undefined,
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to log found item:", err);
      setErrorMessage(err.message || "Failed to log found item to custody database. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-findback-accent flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-findback-text mb-2">
          Thank you for turning it in!
        </h1>
        <p className="text-sm text-findback-muted mb-6 leading-relaxed">
          Your found report for <strong>{title}</strong> has been logged. Please drop the item off at{" "}
          <strong>{dropOffDesk}</strong> so the custody officer can safeguard it.
        </p>
        <div className="space-y-3">
          <Link
            href="/browse"
            className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover transition-colors"
          >
            Browse Campus Catalog
          </Link>
          <Link
            href="/"
            className="block text-xs font-medium text-findback-muted hover:text-findback-text"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center space-x-1 text-xs font-medium text-findback-muted hover:text-findback-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="mb-6">
        <span className="text-xs uppercase font-bold tracking-wider text-findback-accent block mb-1">
          Campus Custody Drop-off
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
          I Found Something
        </h1>
        <p className="text-xs sm:text-sm text-findback-muted mt-1">
          Found an item? Someone might be looking for it.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-findback-border p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
              What did you find?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Casio Calculator, Blue Water Bottle, Keyring with 3 keys"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm text-findback-text placeholder:text-findback-muted outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text">
                  Category
                </label>
                <span className="text-[10px] text-findback-accent font-medium">Dynamic catalog</span>
              </div>
              <select
                value={isCustomCategory ? "__CUSTOM__" : category}
                onChange={(e) => {
                  if (e.target.value === "__CUSTOM__") {
                    setIsCustomCategory(true);
                  } else {
                    setIsCustomCategory(false);
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary text-sm text-findback-text outline-none transition-all"
              >
                {categoryNames.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__CUSTOM__">+ Add Custom Category...</option>
              </select>

              {isCustomCategory && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="text"
                    required
                    placeholder="Type custom category name..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-findback-primary bg-white focus:ring-1 focus:ring-findback-primary text-xs text-findback-text outline-none transition-all placeholder:text-findback-muted"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                Drop-off Desk
              </label>
              <select
                value={dropOffDesk}
                onChange={(e) => setDropOffDesk(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary text-sm text-findback-text outline-none transition-all"
              >
                {DROP_OFF_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <LocationPicker
            value={location}
            onChange={setLocation}
            label="Where on campus was it found?"
            helperText="Specify the building, floor, and room number, or enter a custom location if it was found elsewhere."
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
              Public Description
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Black scientific calculator found on desk. No battery cover issues."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary text-sm text-findback-text outline-none transition-all resize-none"
            />
          </div>

          {/* Unrevealed Attribute (Strict Anti-Theft Guard) */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Unrevealed Distinguishing Attribute (Concealed from Public)</span>
            </div>
            <p className="text-[11px] text-amber-800/80 mb-2">
              Something only the true owner would know (e.g., sticker character, engraved initials, wallpaper, cash amount).
            </p>
            <input
              type="text"
              placeholder="e.g. Has a yellow Pikachu sticker on back"
              value={unrevealedDetails}
              onChange={(e) => setUnrevealedDetails(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-amber-300/80 bg-white text-xs text-findback-text placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Logging to Database...</span>
                </>
              ) : (
                <>
                  <span>Log Found Item</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover-shift" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
