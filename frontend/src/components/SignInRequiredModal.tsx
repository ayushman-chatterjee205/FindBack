"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Lock, LogIn, UserPlus, X } from "lucide-react";

interface SignInRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectUrl?: string;
}

export const SignInRequiredModal: React.FC<SignInRequiredModalProps> = ({
  isOpen,
  onClose,
  title = "Sign In Required",
  description = "Access to reporting items, claiming custody property, and tracking matches requires a campus account.",
  redirectUrl = "/",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll and handle Escape key while modal is active
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-findback-border shadow-2xl relative my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock / Security Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-5 mx-auto shadow-xs">
          <Lock className="w-7 h-7 stroke-[2.2]" />
        </div>

        {/* Header & Description */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">

           <Link
            href={`/login`}
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <Link
            href="/register"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4 text-slate-600" />
            <span>Create Campus Account</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
