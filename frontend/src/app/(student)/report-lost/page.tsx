"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, ShieldAlert, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ItemCategory } from "@/types";

const CATEGORIES: ItemCategory[] = [
  "Electronics",
  "IDs & Cards",
  "Keys",
  "Bags & Wallets",
  "Accessories",
  "Books & Notes",
  "Clothing",
  "Other",
];

import { LocationPicker } from "@/components/LocationPicker";
import { api } from "@/lib/api";
import { useCategories } from "@/lib/useCategories";

export default function ReportLostPage() {
  const router = useRouter();
  const { categoryNames } = useCategories();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Electronics");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [location, setLocation] = useState("ICT Block • Floor 1");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [approxTime, setApproxTime] = useState("14:30");
  const [description, setDescription] = useState("");
  const [secretDetails, setSecretDetails] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Progressive disclosure: 1: Basics, 2: Location/Time, 3: Details & Secret verification
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    setSubmitProgress("Saving report to campus database...");

    try {
      const finalCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : category;
      const lostTimestamp = new Date(`${date}T${approxTime}:00`).toISOString();
      const payload = {
        title,
        category: finalCategory,
        description,
        secret_details: secretDetails.trim() || undefined,
        location_name: location,
        lost_timestamp: lostTimestamp,
        image_url: imagePreview || undefined,
      };

      const result = await api.post<any>("/lost-items", payload);
      setSubmitProgress(
        result.matches_count && result.matches_count > 0
          ? `Identified ${result.matches_count} candidate match(es)! Finalizing...`
          : "Scanning custody inventory for matches..."
      );

      setTimeout(() => {
        setSubmitProgress("Report logged successfully ✓");
        setTimeout(() => {
          router.push("/my-reports");
        }, 600);
      }, 700);
    } catch (err: any) {
      console.error("Failed to submit lost item report:", err);
      setErrorMessage(err.message || "Could not save lost report to the database. Please try again.");
      setIsSubmitting(false);
      setSubmitProgress(null);
    }
  };

  const { user, isLoading: authLoading } = useAuth();

  if (!authLoading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-findback-text mb-2">
          Authentication Required
        </h1>
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold mb-4">
          Sign in to report lost items
        </div>
        <p className="text-xs text-findback-muted leading-relaxed mb-6">
          To protect campus custody records and enable multi-signal AI matching with instant notifications, you must be signed in with your college account before submitting a report.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-findback-border bg-white text-findback-text hover:bg-findback-bg transition-all"
          >
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-1 text-xs font-medium text-findback-muted hover:text-findback-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="mb-6">
        <span className="text-xs uppercase font-bold tracking-wider text-status-lost block mb-1">
          Step {step} of 3
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
          Report a Lost Item
        </h1>
        <p className="text-xs sm:text-sm text-findback-muted mt-1">
          Something missing? Let&apos;s find it together.
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center space-x-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              s <= step ? "bg-findback-primary" : "bg-findback-border"
            }`}
          />
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-findback-border p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit}>
          {/* STEP 1: What did you lose? */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                  What did you lose?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio fx-991EX Calculator, Black Herschel Backpack"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm text-findback-text placeholder:text-findback-muted outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text">
                    Category
                  </label>
                  <span className="text-[11px] text-findback-accent font-medium">Dynamic catalog</span>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm text-findback-text outline-none transition-all"
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
                      placeholder="Type custom category name (e.g. Sports Equipment, Musical Instrument, Lab Tool)..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-findback-primary bg-white focus:ring-1 focus:ring-findback-primary text-xs text-findback-text outline-none transition-all placeholder:text-findback-muted"
                    />
                  </div>
                )}
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                  Reference Photo <span className="text-findback-muted font-normal">(Optional, helps AI matching)</span>
                </label>
                <div className="relative border-2 border-dashed border-findback-border hover:border-findback-primary rounded-xl p-6 flex flex-col items-center justify-center text-center bg-findback-bg/40 cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-medium">
                        Click to change
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-findback-sand flex items-center justify-center text-findback-primary mb-2 group-hover:scale-105 transition-transform">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-findback-text">
                        + Upload Photo
                      </span>
                      <span className="text-[11px] text-findback-muted mt-0.5">
                        A past photo, or similar manufacturer image
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all group"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover-shift" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Where and When */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <LocationPicker
                value={location}
                onChange={setLocation}
                label="Where did you last see it?"
                helperText="Our spatial AI matching engine uses campus building and floor hierarchies to calculate proximity."
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary text-sm text-findback-text outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                    Approx. Time
                  </label>
                  <input
                    type="time"
                    required
                    value={approxTime}
                    onChange={(e) => setApproxTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary text-sm text-findback-text outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-findback-muted hover:text-findback-text transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all group"
                >
                  <span>Continue to Description</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover-shift" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Description & Secret Verification Details */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text mb-1.5">
                  General Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Black solar scientific calculator with slider case, slight scratch on corner."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm text-findback-text placeholder:text-findback-muted outline-none transition-all resize-none"
                />
              </div>

              {/* Private Secret Detail (Anti-Fraud Clue) */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold mb-1">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Private Distinguishing Mark (Secret Proof)</span>
                </div>
                <p className="text-[11px] text-amber-800/80 mb-2 leading-relaxed">
                  Only you and the custody officer can see this. Never displayed publicly.
                </p>
                <input
                  type="text"
                  placeholder="e.g. Has a yellow sticker on back battery cover, initial 'A' engraved"
                  value={secretDetails}
                  onChange={(e) => setSecretDetails(e.target.value)}
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

              {/* Submission Animation State */}
              {isSubmitting && submitProgress && (
                <div className="p-3.5 rounded-xl bg-findback-bg border border-findback-border text-center animate-calm-pulse">
                  <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-findback-primary">
                    <Loader2 className="w-4 h-4 animate-spin text-findback-accent" />
                    <span>{submitProgress}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(2)}
                  className="text-xs font-medium text-findback-muted hover:text-findback-text transition-colors disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover disabled:opacity-50 shadow-sm transition-all group"
                >
                  <span>Submit Lost Report</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover-shift" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
