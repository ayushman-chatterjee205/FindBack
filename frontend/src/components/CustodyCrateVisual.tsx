"use client";

import React from "react";

interface CustodyCrateVisualProps {
  className?: string;
  sizeClass?: string;
}

export const CustodyCrateVisual: React.FC<CustodyCrateVisualProps> = ({ 
  className = "", 
  sizeClass = "w-56 sm:w-64 md:w-72 lg:w-80" 
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient Floor Shadow under Crate */}
      <div className="absolute -bottom-4 w-4/5 h-8 bg-black/18 blur-xl rounded-full" />

      {/* Main SVG Composition */}
      <svg
        viewBox="0 0 340 300"
        className={`${sizeClass} h-auto overflow-visible drop-shadow-2xl`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Crate Gradients */}
          <linearGradient id="crateFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="25%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          <linearGradient id="crateRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          <linearGradient id="crateInnerDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C2D12" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          <linearGradient id="crateRibHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.2" />
          </linearGradient>

          {/* Student ID Card Gradient */}
          <linearGradient id="studentCardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Smartphone Screen Gradient */}
          <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Globe Gradient */}
          <radialGradient id="globeGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="40%" stopColor="#0284C7" />
            <stop offset="80%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#082F49" />
          </radialGradient>

          {/* Gold Lanyard / Key Gradient */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          {/* Filter for subtle 3D inner shadows */}
          <filter id="crateShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#7C2D12" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ============================================================== */}
        {/* CRATE INTERIOR (BACK WALL)                                     */}
        {/* ============================================================== */}
        <path
          d="M 50 145 L 290 145 L 280 185 L 60 185 Z"
          fill="url(#crateInnerDark)"
        />

        {/* ============================================================== */}
        {/* ITEMS POPPING OUT OF CRATE (BACK LAYER)                         */}
        {/* ============================================================== */}

        {/* 1. Notebook / Spiral Document (Angled Left) */}
        <g transform="translate(62, 58) rotate(-14)">
          {/* Paper Shadow */}
          <rect x="2" y="2" width="76" height="96" rx="4" fill="black" opacity="0.1" />
          {/* Main Notebook */}
          <rect x="0" y="0" width="76" height="96" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Header Bar */}
          <rect x="0" y="0" width="76" height="18" rx="4" fill="#3B82F6" />
          <text x="8" y="12" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
            CAMPUS NOTES
          </text>
          {/* Lined Pages */}
          <line x1="8" y1="28" x2="68" y2="28" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="8" y1="36" x2="64" y2="36" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="8" y1="44" x2="68" y2="44" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="8" y1="52" x2="56" y2="52" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="8" y1="60" x2="66" y2="60" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
          {/* Sticky Tab */}
          <rect x="52" y="-6" width="16" height="12" rx="2" fill="#F59E0B" />
        </g>

        {/* 2. Stainless Steel Flask / Water Bottle (Left-Center) */}
        <g transform="translate(118, 48) rotate(-5)">
          {/* Bottle Body */}
          <rect x="0" y="20" width="34" height="90" rx="8" fill="#475569" stroke="#334155" strokeWidth="1.5" />
          {/* Highlight sheen */}
          <rect x="4" y="22" width="5" height="84" rx="2.5" fill="#94A3B8" opacity="0.6" />
          {/* Bottle Neck & Cap */}
          <rect x="8" y="8" width="18" height="14" rx="3" fill="#64748B" />
          <rect x="6" y="2" width="22" height="8" rx="2" fill="#1E293B" />
          <rect x="11" y="-4" width="12" height="6" rx="2" fill="#94A3B8" />
          {/* Brand Ring */}
          <circle cx="17" cy="55" r="8" fill="#0EA5E9" opacity="0.8" />
          <path d="M14 55 L16 57 L20 53" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* 3. The Central Iconic Campus Globe (Centerpiece like Reference Image) */}
        <g transform="translate(170, 115)">
          {/* Globe Sphere Drop Shadow */}
          <circle cx="0" cy="0" r="42" fill="black" opacity="0.18" filter="url(#crateShadow)" />
          {/* Globe Ball with Deep Oceanic Radial Gradient */}
          <circle cx="0" cy="0" r="40" fill="url(#globeGrad)" />
          
          {/* Continents / Landmasses (Stylized vector outlines) */}
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
          
          {/* Latitude & Longitude Meridian Lines */}
          <ellipse cx="0" cy="0" rx="39" ry="16" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="0" cy="0" rx="16" ry="39" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
          <line x1="-39" y1="0" x2="39" y2="0" stroke="white" strokeWidth="0.8" opacity="0.3" />
          
          {/* Globe Atmospheric Specular Glare */}
          <ellipse cx="-12" cy="-14" rx="18" ry="10" fill="white" opacity="0.35" transform="rotate(-30 -12 -14)" />
        </g>

        {/* 4. Student ID Card (Fanning to Right) */}
        <g transform="translate(188, 42) rotate(12)">
          {/* Card Drop Shadow */}
          <rect x="2" y="2" width="102" height="66" rx="6" fill="black" opacity="0.15" />
          {/* Card Base */}
          <rect x="0" y="0" width="102" height="66" rx="6" fill="url(#studentCardGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* University Top Stripe */}
          <rect x="0" y="0" width="102" height="15" rx="6" fill="#1E3A8A" />
          <rect x="0" y="10" width="102" height="5" fill="#1E3A8A" />
          <text x="8" y="10" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">
            UNIVERSITY ID
          </text>
          
          {/* Photo Avatar Box */}
          <rect x="8" y="20" width="22" height="26" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <circle cx="19" cy="29" r="5" fill="#64748B" />
          <path d="M12 43 C12 37 26 37 26 43 Z" fill="#64748B" />
          
          {/* Student Info Lines */}
          <text x="36" y="27" fill="#0F172A" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
            R. SEN
          </text>
          <text x="36" y="35" fill="#64748B" fontSize="5.5" fontWeight="bold" fontFamily="monospace">
            ROLL #21051234
          </text>
          <text x="36" y="42" fill="#2563EB" fontSize="5" fontWeight="bold" fontFamily="sans-serif">
            ENGG · COMP SCI
          </text>

          {/* Barcode / Smart Chip */}
          <rect x="8" y="50" width="56" height="8" rx="1.5" fill="#0F172A" opacity="0.75" />
          <line x1="12" y1="52" x2="12" y2="56" stroke="white" strokeWidth="1" />
          <line x1="16" y1="52" x2="16" y2="56" stroke="white" strokeWidth="1.5" />
          <line x1="20" y1="52" x2="20" y2="56" stroke="white" strokeWidth="0.8" />
          <line x1="24" y1="52" x2="24" y2="56" stroke="white" strokeWidth="2" />
          <line x1="30" y1="52" x2="30" y2="56" stroke="white" strokeWidth="1" />
          <line x1="36" y1="52" x2="36" y2="56" stroke="white" strokeWidth="1.8" />

          {/* Gold Smart Chip */}
          <rect x="74" y="26" width="18" height="14" rx="2" fill="url(#goldGrad)" stroke="#A16207" strokeWidth="0.8" />
          <line x1="74" y1="33" x2="92" y2="33" stroke="#78350F" strokeWidth="0.6" />
          <line x1="83" y1="26" x2="83" y2="40" stroke="#78350F" strokeWidth="0.6" />
        </g>

        {/* 5. Smartphone with Match Found (Leaning Far Right) */}
        <g transform="translate(232, 70) rotate(19)">
          {/* Phone Body */}
          <rect x="0" y="0" width="54" height="96" rx="9" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          {/* Screen */}
          <rect x="3" y="4" width="48" height="88" rx="7" fill="url(#phoneScreen)" />
          {/* Notch / Dynamic Island */}
          <rect x="18" y="6" width="18" height="4" rx="2" fill="#000000" />
          
          {/* Match Alert Notification Box */}
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

        {/* 6. Apple AirPods Pro Case (Tucked Right Front) */}
        <g transform="translate(196, 126) rotate(-6)">
          <rect x="0" y="0" width="46" height="34" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Seam line */}
          <line x1="0" y1="13" x2="46" y2="13" stroke="#CBD5E1" strokeWidth="0.8" />
          {/* Glowing Green LED Indicator */}
          <circle cx="23" cy="22" r="1.6" fill="#22C55E" />
          <circle cx="23" cy="22" r="3.2" fill="#22C55E" opacity="0.3" />
        </g>

        {/* 7. Brass Campus Keys with Lanyard (Hanging Out Left) */}
        <g transform="translate(68, 142) rotate(16)">
          {/* Blue Braided Lanyard */}
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
          {/* Key Ring */}
          <circle cx="8" cy="42" r="9" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" />
          {/* Brass Key 1 */}
          <path
            d="M 12 47 L 26 62 L 28 60 L 26 58 L 24 58 L 22 55 L 20 56 L 16 51 Z"
            fill="url(#goldGrad)"
            stroke="#A16207"
            strokeWidth="0.8"
          />
          {/* Key 2 / Room Tag */}
          <rect x="-6" y="46" width="16" height="24" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
          <circle cx="2" cy="50" r="2" fill="white" />
          <text x="-4" y="62" fill="white" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
            RM302
          </text>
        </g>

        {/* ============================================================== */}
        {/* THE CRATE BODY (FRONT RIM, INDUSTRIAL RIBS & LATCHES)          */}
        {/* ============================================================== */}
        <g filter="url(#crateShadow)">
          {/* Main Front Body */}
          <path
            d="M 40 155 
               L 300 155 
               L 286 265 
               C 286 272, 280 278, 272 278 
               L 68 278 
               C 60 278, 54 272, 54 265 
               Z"
            fill="url(#crateFront)"
            stroke="#C2410C"
            strokeWidth="2"
          />

          {/* Top Heavy-Duty Rim Lip */}
          <rect
            x="34"
            y="145"
            width="272"
            height="18"
            rx="4"
            fill="url(#crateRim)"
            stroke="#C2410C"
            strokeWidth="2"
          />
          {/* Rim Top Highlight Line */}
          <line x1="38" y1="147" x2="302" y2="147" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />

          {/* Vertical Strengthening Ribs (Recessed Channels) */}
          <g opacity="0.45">
            {/* Rib 1 */}
            <rect x="74" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
            <rect x="75" y="169" width="4" height="94" rx="2" fill="url(#crateRibHighlight)" />
            {/* Rib 2 */}
            <rect x="114" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
            <rect x="115" y="169" width="4" height="94" rx="2" fill="url(#crateRibHighlight)" />
            {/* Rib 3 */}
            <rect x="214" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
            <rect x="215" y="169" width="4" height="94" rx="2" fill="url(#crateRibHighlight)" />
            {/* Rib 4 */}
            <rect x="254" y="168" width="12" height="96" rx="3" fill="#7C2D12" />
            <rect x="255" y="169" width="4" height="94" rx="2" fill="url(#crateRibHighlight)" />
          </g>

          {/* Molded Center Recessed Handle Cutout */}
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

          {/* Official Campus Custody Barcode Label (Center Front) */}
          <g transform="translate(132, 206)">
            {/* White Label Base */}
            <rect x="0" y="0" width="76" height="52" rx="4" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
            
            {/* Top Amber Stripe */}
            <rect x="0" y="0" width="76" height="8" rx="4" fill="#0F172A" />
            <rect x="0" y="5" width="76" height="3" fill="#0F172A" />
            <text x="6" y="6" fill="#F8FAFC" fontSize="4.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
              FINDBACK CUSTODY
            </text>

            {/* Locker Bin Code */}
            <text x="6" y="18" fill="#EA580C" fontSize="8" fontWeight="900" fontFamily="monospace">
              BIN #E-04
            </text>
            <text x="6" y="24" fill="#64748B" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">
              CENTRAL BLOCK VAULT
            </text>

            {/* High-Precision Barcode */}
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

            {/* Checkmark Badge */}
            <circle cx="66" cy="18" r="5" fill="#10B981" />
            <path d="M64 18 L65.5 19.5 L68.5 16.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Metallic Corner Rivets */}
          <circle cx="48" cy="154" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
          <circle cx="292" cy="154" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
          <circle cx="64" cy="268" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
          <circle cx="276" cy="268" r="2.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
};
