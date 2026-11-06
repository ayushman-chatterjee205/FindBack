"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  Layers, 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Clock,
  FileCheck2
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Home</span>
      </Link>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Campus Custody & Recovery Network</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          About FindBack
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-8">
          FindBack is an intelligent digital custody and recovery platform built for university campuses. 
          By bridging student reports, good samaritan turn-ins, and campus security custody into a unified, 
          AI-driven network, FindBack transforms lost-and-found from an informal gamble into a fast, transparent, 
          and tamper-proof campus service.
        </p>

        {/* Guiding Philosophy Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white mb-10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-300 tracking-wider uppercase mb-1">
                Our Core Philosophy
              </p>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
                “We don’t replace the people already solving the problem. We give them a smarter way to solve it.”
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Campus security guards, lab assistants, and conscientious students already work every day to return 
                lost property. FindBack equips them with intelligent tools—eliminating manual paper logbooks, unindexed 
                social chats, and verbal guessing games.
              </p>
            </div>
          </div>
        </div>

        {/* The Campus Reality / The Challenge */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>The Challenge We Solved</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Higher education campuses function as bustling micro-cities. At Heritage Institute of Technology, thousands 
            of students navigate 5 major building complexes (CME, Central, ICT, Mechanical, Science) across multi-floor lecture 
            theatres, specialized laboratories, and central dining areas daily.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fragmented Channels</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notices used to live in scattered WhatsApp groups, notice boards, and word-of-mouth chatter with zero searchability.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Manual Paper Logs</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Security staff recorded intake by hand in bound notebooks, requiring students to make repetitive physical inquiries across campus.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Verification Risk</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informal verbal claims risked mistaken releases or fraudulent handovers without any immutable custody audit trail.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Architectural Innovations */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Key Architectural Innovations</span>
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Engineered under modern web, artificial intelligence, and cybersecurity best practices.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. AI Matching */}
            <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors bg-white">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Multi-Signal AI Matching Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates candidate pairs across 4 weighted signals: semantic text tokenization (35%), deep visual image embeddings (35%), 
                campus spatial proximity (15%), and temporal decay curves (15%). Alerts trigger automatically at composite confidence ≥ 75%.
              </p>
            </div>

            {/* 2. Blind Proof */}
            <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors bg-white">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Blind Proof-of-Ownership Architecture
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public catalog listings deliberately mask unique identifiers (serial numbers, custom engravings, internal stickers). 
                Claimants must independently solve private ownership challenges verified securely by staff before pickup.
              </p>
            </div>

            {/* 3. Physical Vault */}
            <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors bg-white">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Physical Vault Bins (Central Block 101)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bridged directly with physical security operations. Found items are checked into barcode-indexed storage crates 
                (Bin #E-01 to #E-12) located in the Central Security Vault, establishing an unbroken chain of custody.
              </p>
            </div>

            {/* 4. Cryptographic Pass */}
            <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors bg-white">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Dynamic Cryptographic Handover Pass
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verified claims issue a single-use, 60-minute dynamic cryptographic QR code and 6-digit OTP pass. Security officers 
                validate this pass live at the desk, generating an immutable, tamper-proof record of return.
              </p>
            </div>
          </div>
        </div>

        {/* Quantified Impact Metrics */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Target Campus Impact</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tight">90%+</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Faster Recovery</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Slashed from days to hours</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">Zero</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Handover Fraud</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Blind proof challenge</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
              <div className="text-2xl sm:text-3xl font-black text-purple-700 tracking-tight">100%</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Custody Auditability</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Intake to vault return</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">5 Blocks</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Campus Coverage</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Unified central registry</p>
            </div>
          </div>
        </div>

        {/* Academic Roots */}
        <div className="p-5 rounded-2xl bg-[#F4F7FB] border border-slate-200 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                Institutional Origin
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Heritage Institute of Technology, Kolkata
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Department of Computer Science & Engineering (IoT & Cyber Security including Blockchain Technology) • Design Thinking & Ideation Lab 2026
              </p>
            </div>
            <Link
              href="/team"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0"
            >
              <span>Meet the Creator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Link
              href="/browse"
              className="px-4 py-2 rounded-xl bg-findback-primary text-white text-xs font-semibold hover:bg-findback-primary-hover transition-colors shadow-xs"
            >
              Browse Catalog
            </Link>
            <Link
              href="/faqs"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Read FAQs
            </Link>
          </div>
          <Link
            href="/contact"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Need assistance? Contact us &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
