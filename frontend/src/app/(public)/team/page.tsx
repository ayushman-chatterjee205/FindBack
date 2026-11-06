"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Building2, 
  GraduationCap, 
  Code2, 
  ShieldCheck,
  Sparkles,
  Github,
  Mail,
  Layers,
  Cpu
} from "lucide-react";

export default function TeamPage() {
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
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>Creator & Lead Engineer</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Behind FindBack
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-8">
          FindBack was conceived, architected, and built by Ayushman Chatterjee to bring an automated, dignified, 
          and AI-driven lost-and-found custody infrastructure to university campuses.
        </p>

        {/* Department Info Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F7FB] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-600 shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Heritage Institute of Technology, Kolkata
              </p>
              <p className="text-xs text-slate-600">
                Department of Computer Science & Engineering (IoT & Cyber Security including Blockchain Technology)
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-[11px] font-bold tracking-wide uppercase shrink-0">
            Ideation Lab 2026
          </span>
        </div>

        {/* Creator Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-blue-200/80 bg-gradient-to-br from-white via-blue-50/20 to-slate-50/50 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Avatar Badge */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                AC
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Ayushman Chatterjee
                  </h2>
                  <span className="px-3 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold tracking-wide">
                    Lead Developer & Architect
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Roll No: <span className="text-slate-800 font-bold">2563002</span>
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-xl">
                  Designed and implemented the complete full-stack architecture, including the 4-signal multi-modal 
                  AI matching engine (semantic embeddings, visual vectors, campus spatial graph, and temporal decay), 
                  secure anti-fraud custody verification workflows, and mobile simulation UI.
                </p>
              </div>
            </div>
          </div>

          {/* Core Competencies / Responsibilities */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2.5">
              <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">Full-Stack Web</p>
                <p className="text-[11px] text-slate-500">Next.js 14, React, Tailwind</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">AI & Matching Core</p>
                <p className="text-[11px] text-slate-500">FastAPI, Embeddings, pgvector</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">Custody & Security</p>
                <p className="text-[11px] text-slate-500">Dynamic OTP / QR Handover</p>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Collaboration Note */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Campus Security Vault Integration
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                FindBack is designed for operational deployment alongside campus security personnel. 
                Physical item intake, custody crate verification (Bins #E-01 to #E-12), and authenticated handovers are operated 
                directly from the Central Block Security Vault (Room 101, Ground Floor).
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Link
              href="/about"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              About the Platform
            </Link>
            <Link
              href="/safety"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Safety Guidelines
            </Link>
          </div>
          <Link
            href="/contact"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Get in touch &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
