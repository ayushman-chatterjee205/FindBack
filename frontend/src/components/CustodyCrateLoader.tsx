"use client";

import React from "react";

export interface CustodyCrateLoaderProps {
  /** Size variant */
  size?: "sm" | "md" | "lg" | "fullscreen";
  /** Primary label message */
  label?: string;
  /** Secondary subtitle / hint */
  subtext?: string;
  /** Whether to show the glowing shimmer progress bar */
  showProgress?: boolean;
  /** Additional container classes */
  className?: string;
}

export const CustodyCrateLoader: React.FC<CustodyCrateLoaderProps> = ({
  size = "md",
  label = "Reconnecting Belongings...",
  subtext = "Scanning campus custody vault & verified registries...",
  showProgress = true,
  className = "",
}) => {
  // Sizing definitions
  const sizeMap = {
    sm: {
      svgWidth: "w-32 sm:w-36",
      labelClass: "text-xs font-semibold",
      subtextClass: "text-[10px]",
      containerClass: "py-4",
      barWidth: "w-28",
    },
    md: {
      svgWidth: "w-52 sm:w-60",
      labelClass: "text-sm sm:text-base font-bold",
      subtextClass: "text-xs",
      containerClass: "py-8",
      barWidth: "w-48 sm:w-56",
    },
    lg: {
      svgWidth: "w-64 sm:w-72 md:w-80",
      labelClass: "text-base sm:text-lg font-bold",
      subtextClass: "text-xs sm:text-sm",
      containerClass: "py-12",
      barWidth: "w-64 sm:w-72",
    },
    fullscreen: {
      svgWidth: "w-64 sm:w-72 md:w-84",
      labelClass: "text-lg sm:text-xl font-bold",
      subtextClass: "text-xs sm:text-sm max-w-sm",
      containerClass: "p-6",
      barWidth: "w-64 sm:w-80",
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex flex-col items-center justify-center text-center select-none ${currentSize.containerClass} ${className}`}>
      {/* SVG Animation Stage */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Floor Shadow */}
        <div className="absolute -bottom-3 w-4/5 h-6 bg-black/15 blur-lg rounded-full anim-shadow-scale" />

        <svg
          viewBox="0 0 340 300"
          className={`${currentSize.svgWidth} h-auto overflow-visible drop-shadow-xl`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="crateLoaderFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="30%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            <linearGradient id="crateLoaderRim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            <linearGradient id="crateLoaderInnerDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C2D12" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>

            <linearGradient id="crateLoaderRib" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="crateLoaderIdGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            <linearGradient id="crateLoaderPhoneScreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <radialGradient id="crateLoaderGlobeGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="40%" stopColor="#0284C7" />
              <stop offset="80%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </radialGradient>

            <linearGradient id="crateLoaderGoldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            <filter id="crateLoaderDrop" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#7C2D12" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* CRATE INTERIOR BACK WALL (Breathes with crate)                 */}
          {/* ============================================================== */}
          <g className="anim-crate-hover">
            <path
              d="M 50 145 L 290 145 L 280 185 L 60 185 Z"
              fill="url(#crateLoaderInnerDark)"
            />
          </g>

          {/* ============================================================== */}
          {/* FLOATING BELONGINGS (Each floats independently out-of-phase)   */}
          {/* ============================================================== */}

          {/* 1. Campus Notebook / Document */}
          <g className="anim-float-notebook">
            <rect x="2" y="2" width="76" height="96" rx="4" fill="black" opacity="0.1" />
            <rect x="0" y="0" width="76" height="96" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="0" y="0" width="76" height="18" rx="4" fill="#3B82F6" />
            <text x="8" y="12" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
              CAMPUS NOTES
            </text>
            <line x1="8" y1="28" x2="68" y2="28" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8" y1="36" x2="64" y2="36" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8" y1="44" x2="68" y2="44" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8" y1="52" x2="56" y2="52" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8" y1="60" x2="66" y2="60" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            <rect x="52" y="-6" width="16" height="12" rx="2" fill="#F59E0B" />
          </g>

          {/* 2. Stainless Steel Flask / Bottle */}
          <g className="anim-float-bottle">
            <rect x="0" y="20" width="34" height="90" rx="8" fill="#475569" stroke="#334155" strokeWidth="1.5" />
            <rect x="4" y="22" width="5" height="84" rx="2.5" fill="#94A3B8" opacity="0.6" />
            <rect x="8" y="8" width="18" height="14" rx="3" fill="#64748B" />
            <rect x="6" y="2" width="22" height="8" rx="2" fill="#1E293B" />
            <rect x="11" y="-4" width="12" height="6" rx="2" fill="#94A3B8" />
            <circle cx="17" cy="55" r="8" fill="#0EA5E9" opacity="0.8" />
            <path d="M14 55 L16 57 L20 53" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* 3. The Campus Globe (Centerpiece Orb) */}
          <g className="anim-float-globe">
            <circle cx="0" cy="0" r="42" fill="black" opacity="0.16" />
            <circle cx="0" cy="0" r="40" fill="url(#crateLoaderGlobeGrad)" />
            <path
              d="M -24 -18 Q -16 -24 -8 -16 Q -2 -10 -6 0 Q -10 10 -20 8 Q -30 6 -24 -18 Z"
              fill="#34D399"
              opacity="0.85"
            />
            <path
              d="M 6 -22 Q 18 -26 26 -16 Q 30 -6 22 2 Q 14 10 8 4 Q 2 -2 6 -22 Z"
              fill="#34D399"
              opacity="0.85"
            />
            <path
              d="M -12 12 Q -2 8 8 18 Q 12 28 0 32 Q -12 36 -16 26 Z"
              fill="#34D399"
              opacity="0.85"
            />
            <ellipse cx="0" cy="0" rx="39" ry="16" fill="none" stroke="white" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="0" cy="0" rx="16" ry="39" fill="none" stroke="white" strokeWidth="0.8" opacity="0.35" />
            <line x1="-39" y1="0" x2="39" y2="0" stroke="white" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="-12" cy="-14" rx="18" ry="10" fill="white" opacity="0.35" transform="rotate(-30 -12 -14)" />
          </g>

          {/* 4. Student ID Card */}
          <g className="anim-float-card">
            <rect x="2" y="2" width="102" height="66" rx="6" fill="black" opacity="0.14" />
            <rect x="0" y="0" width="102" height="66" rx="6" fill="url(#crateLoaderIdGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="0" y="0" width="102" height="15" rx="6" fill="#1E3A8A" />
            <rect x="0" y="10" width="102" height="5" fill="#1E3A8A" />
            <text x="8" y="10" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">
              UNIVERSITY ID
            </text>
            <rect x="8" y="20" width="22" height="26" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
            <circle cx="19" cy="29" r="5" fill="#64748B" />
            <path d="M12 43 C12 37 26 37 26 43 Z" fill="#64748B" />
            <text x="36" y="27" fill="#0F172A" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
              R. SEN
            </text>
            <text x="36" y="35" fill="#64748B" fontSize="5.5" fontWeight="bold" fontFamily="monospace">
              ROLL #21051234
            </text>
            <text x="36" y="42" fill="#2563EB" fontSize="5" fontWeight="bold" fontFamily="sans-serif">
              ENGG · COMP SCI
            </text>
            <rect x="8" y="50" width="56" height="8" rx="1.5" fill="#0F172A" opacity="0.75" />
            <line x1="12" y1="52" x2="12" y2="56" stroke="white" strokeWidth="1" />
            <line x1="16" y1="52" x2="16" y2="56" stroke="white" strokeWidth="1.5" />
            <line x1="20" y1="52" x2="20" y2="56" stroke="white" strokeWidth="0.8" />
            <line x1="24" y1="52" x2="24" y2="56" stroke="white" strokeWidth="2" />
            <line x1="30" y1="52" x2="30" y2="56" stroke="white" strokeWidth="1" />
            <line x1="36" y1="52" x2="36" y2="56" stroke="white" strokeWidth="1.8" />
            <rect x="74" y="26" width="18" height="14" rx="2" fill="url(#crateLoaderGoldGrad)" stroke="#A16207" strokeWidth="0.8" />
            <line x1="74" y1="33" x2="92" y2="33" stroke="#78350F" strokeWidth="0.6" />
            <line x1="83" y1="26" x2="83" y2="40" stroke="#78350F" strokeWidth="0.6" />
          </g>

          {/* 5. Smartphone with Match Found */}
          <g className="anim-float-phone">
            <rect x="0" y="0" width="54" height="96" rx="9" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <rect x="3" y="4" width="48" height="88" rx="7" fill="url(#crateLoaderPhoneScreen)" />
            <rect x="18" y="6" width="18" height="4" rx="2" fill="#000000" />
            <rect x="6" y="18" width="42" height="34" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="0.8" />
            <circle cx="14" cy="28" r="4" fill="#10B981" />
            <path d="M12 28 L13.5 29.5 L16 26.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <text x="21" y="27" fill="#F8FAFC" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">
              MATCH 98%
            </text>
            <text x="21" y="32" fill="#94A3B8" fontSize="3.5" fontFamily="sans-serif">
              Found in ICT Block
            </text>
            <rect x="10" y="38" width="34" height="9" rx="2" fill="#0284C7" />
            <text x="16" y="44" fill="#FFFFFF" fontSize="4" fontWeight="bold" fontFamily="sans-serif">
              CLAIM ITEM
            </text>
          </g>

          {/* 6. Apple AirPods Case */}
          <g className="anim-float-airpods">
            <rect x="0" y="0" width="46" height="34" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <line x1="0" y1="13" x2="46" y2="13" stroke="#CBD5E1" strokeWidth="0.8" />
            <circle cx="23" cy="22" r="1.6" fill="#22C55E" />
            <circle cx="23" cy="22" r="3.2" fill="#22C55E" opacity="0.3" />
          </g>

          {/* 7. Brass Keys with Braided Lanyard */}
          <g className="anim-float-keys">
            <path
              d="M 12 -18 Q 4 4 10 16 Q 16 28 8 40"
              fill="none"
              stroke="#1D4ED8"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 12 -18 Q 4 4 10 16 Q 16 28 8 40"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle cx="8" cy="42" r="9" fill="none" stroke="url(#crateLoaderGoldGrad)" strokeWidth="2.5" />
            <path
              d="M 12 47 L 26 62 L 28 60 L 26 58 L 24 58 L 22 55 L 20 56 L 16 51 Z"
              fill="url(#crateLoaderGoldGrad)"
              stroke="#A16207"
              strokeWidth="0.8"
            />
            <rect x="-6" y="46" width="16" height="24" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
            <circle cx="2" cy="50" r="2" fill="white" />
            <text x="-4" y="62" fill="white" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
              RM302
            </text>
          </g>

          {/* Ascending Sonar Sparkle Particles */}
          <g className="anim-sparkle-1">
            <circle cx="0" cy="0" r="3.5" fill="#38BDF8" />
            <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill="#67E8F9" />
          </g>
          <g className="anim-sparkle-2">
            <circle cx="0" cy="0" r="3" fill="#FBBF24" />
            <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#FDE047" />
          </g>
          <g className="anim-sparkle-3">
            <circle cx="0" cy="0" r="4" fill="#34D399" />
            <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill="#A7F3D0" />
          </g>

          {/* ============================================================== */}
          {/* THE CRATE BODY (FRONT RIM, INDUSTRIAL RIBS & LATCHES)          */}
          {/* ============================================================== */}
          <g className="anim-crate-hover" filter="url(#crateLoaderDrop)">
            <path
              d="M 40 155 
                 L 300 155 
                 L 286 265 
                 C 286 272, 280 278, 272 278 
                 L 68 278 
                 C 60 278, 54 272, 54 265 
                 Z"
              fill="url(#crateLoaderFront)"
              stroke="#C2410C"
              strokeWidth="2"
            />

            <rect
              x="34"
              y="145"
              width="272"
              height="18"
              rx="4"
              fill="url(#crateLoaderRim)"
              stroke="#C2410C"
              strokeWidth="2"
            />
            <line x1="38" y1="147" x2="302" y2="147" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />

            <g opacity="0.45">
              <rect x="74" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
              <rect x="75" y="169" width="4" height="94" rx="2" fill="url(#crateLoaderRib)" />
              <rect x="114" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
              <rect x="115" y="169" width="4" height="94" rx="2" fill="url(#crateLoaderRib)" />
              <rect x="214" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
              <rect x="215" y="169" width="4" height="94" rx="2" fill="url(#crateLoaderRib)" />
              <rect x="254" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
              <rect x="255" y="169" width="4" height="94" rx="2" fill="url(#crateLoaderRib)" />
            </g>

            <rect
              x="142"
              y="172"
              width="56"
              height="18"
              rx="9"
              fill="#431407"
              stroke="#9A3412"
              strokeWidth="1.5"
            />
            <rect
              x="145"
              y="175"
              width="50"
              height="12"
              rx="6"
              fill="#270D05"
            />

            {/* Official Campus Custody Barcode Label */}
            <g transform="translate(132, 206)">
              <rect x="0" y="0" width="76" height="52" rx="4" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
              <rect x="0" y="0" width="76" height="8" rx="4" fill="#0F172A" />
              <rect x="0" y="5" width="76" height="3" fill="#0F172A" />
              <text x="6" y="6" fill="#F8FAFC" fontSize="4.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
                FINDBACK CUSTODY
              </text>
              <text x="6" y="18" fill="#EA580C" fontSize="8" fontWeight="900" fontFamily="monospace">
                BIN #E-04
              </text>
              <text x="6" y="24" fill="#64748B" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">
                CENTRAL BLOCK VAULT
              </text>

              <g transform="translate(6, 28)">
                <rect x="0" y="0" width="2" height="14" fill="#0F172A" />
                <rect x="3" y="0" width="1" height="14" fill="#0F172A" />
                <rect x="6" y="0" width="3" height="14" fill="#0F172A" />
                <rect x="11" y="0" width="1.5" height="14" fill="#0F172A" />
                <rect x="14" y="0" width="2" height="14" fill="#0F172A" />
                <rect x="18" y="0" width="1" height="14" fill="#0F172A" />
                <rect x="21" y="0" width="3.5" height="14" fill="#0F172A" />
                <rect x="26" y="0" width="1" height="14" fill="#0F172A" />
                <rect x="29" y="0" width="2.5" height="14" fill="#0F172A" />
                <rect x="34" y="0" width="1" height="14" fill="#0F172A" />
                <rect x="37" y="0" width="3" height="14" fill="#0F172A" />
                <rect x="42" y="0" width="1.5" height="14" fill="#0F172A" />
                <rect x="46" y="0" width="2" height="14" fill="#0F172A" />
                <rect x="50" y="0" width="3.5" height="14" fill="#0F172A" />
                <rect x="56" y="0" width="1" height="14" fill="#0F172A" />
                <rect x="59" y="0" width="2" height="14" fill="#0F172A" />
                <rect x="62" y="0" width="2" height="14" fill="#0F172A" />
              </g>

              <circle cx="66" cy="18" r="5" fill="#10B981" />
              <path d="M64 18 L65.5 19.5 L68.5 16.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Corner Rivets */}
            <circle cx="48" cy="154" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
            <circle cx="292" cy="154" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
            <circle cx="64" cy="268" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
            <circle cx="276" cy="268" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
          </g>
        </svg>
      </div>

      {/* Text & Shimmer Progress Bar */}
      <div className="mt-4 flex flex-col items-center">
        {label && (
          <h4 className={`${currentSize.labelClass} text-findback-text tracking-tight mb-1`}>
            {label}
          </h4>
        )}
        {subtext && (
          <p className={`${currentSize.subtextClass} text-findback-muted leading-relaxed`}>
            {subtext}
          </p>
        )}

        {showProgress && (
          <div className={`mt-3.5 ${currentSize.barWidth} h-1.5 bg-blue-100/80 rounded-full overflow-hidden relative`}>
            <div className="absolute inset-y-0 w-2/5 bg-gradient-to-r from-blue-500 via-sky-400 to-findback-primary rounded-full anim-progress-shimmer" />
          </div>
        )}
      </div>
    </div>
  );

  if (size === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F7FB]/92 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
