"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  PhoneCall, 
  Lock, 
  Eye, 
  FileCheck2, 
  Clock, 
  AlertOctagon,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export default function SafetyPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Official Campus Protocol</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Campus Safety Guidelines
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed mb-8">
          To ensure personal security, protect personal property, and prevent custody disputes, all students, staff, and visitors must adhere to the official FindBack campus safety code.
        </p>

        {/* 1. Core Rule: Zero Private Meetups */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border border-amber-200/90 mb-8">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                Fundamental Campus Safety Mandate
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                Zero Private Meetups Allowed
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>FindBack strictly prohibits unmonitored peer-to-peer exchanges</strong> in student hostels, dark campus corridors, secluded parking zones, or off-campus locations. All physical custody transfers must occur at one of the <strong>5 official CCTV-monitored campus custody checkpoints</strong> in the presence of on-duty security staff.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Structured Safety Pillars (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* Pillar 1: High Value Items */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              High-Value Asset Protocol
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Items such as laptops, mobile phones, wallets, cash, jewelry, and government ID cards are placed into tamper-evident sealed custody bags within designated locker bins (e.g. Bin #E-04).
            </p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>IMEI / Serial numbers logged on arrival</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dual-custody verification before opening</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Anti-Fraud & Legal Deterrence */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center mb-3">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              Anti-Fraud & Audit Tracking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Every item claim, QR code scan, and failed OTP entry is logged immutably into the institutional audit ledger along with student roll number, timestamp, and device IP address.
            </p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>False claims forwarded to Proctorial Board</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero tolerance for impersonation</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Proof of Ownership Standard */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-3">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              Verified Ownership Standards
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              To reclaim a misplaced item, claimants must provide irrefutable corroboration. Handover will NOT be granted on circumstantial claims alone.
            </p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Correct secret detail / passcode unlock</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Active college ID card matching claimant</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4: Time-Critical Deposit */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              2-Hour Deposit Window
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Finders are requested to deposit discovered items with campus security within 2 hours of finding. Holding unattended items beyond 24 hours without reporting may result in security inquiry.
            </p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant digital hand-in receipt issued</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Good Samaritan campus recognition</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Suspicious or Hazardous Packages Alert */}
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 mb-8">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900 mb-1">
                Notice: Suspicious or Unidentified Packages
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed">
                If you encounter an unattended bag emitting sounds, leaking chemicals, containing unknown wires, or left in an isolated lab/corridor, <strong>DO NOT TOUCH OR MOVE IT</strong>. Immediately alert campus control room via the emergency hotline.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Designated Campus Safe Checkpoints */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-findback-primary" />
            <span>Approved CCTV-Monitored Custody Checkpoints</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">1. Central Block Vault (Room 101)</div>
              <div className="text-slate-500 mt-0.5">Primary Campus Custody & Safe Lockers (Bin #E-01 – #E-12)</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Open Mon–Sat: 08:30 AM – 06:30 PM</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">2. Main Security Gate Control Post</div>
              <div className="text-slate-500 mt-0.5">Main Campus Entrance & Emergency Control Room</div>
              <div className="text-[11px] text-blue-600 font-medium mt-1">24/7 Round-the-Clock Active Operations</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">3. ICT Block Reception Desk</div>
              <div className="text-slate-500 mt-0.5">Ground Floor Reception & Tech Lab Wings</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Open Mon–Fri: 09:00 AM – 05:30 PM</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="font-bold text-slate-900">4. Central Library Desk</div>
              <div className="text-slate-500 mt-0.5">Basement Floor Main Entry & Reading Halls</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Open Mon–Sat: 08:00 AM – 08:00 PM</div>
            </div>
          </div>
        </div>

      </div>

      {/* Emergency Hotline Bar */}
      <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
            Emergency Contacts
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
            Need Immediate Campus Security Intervention?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            For emergencies, theft reports, or suspicious items, call the direct lines below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Security Desk</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">Ext. 2101</span>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Main Gate Control</span>
            <span className="text-sm font-bold text-emerald-300 font-mono">+91 33 2443 0454</span>
          </div>
        </div>
      </div>
    </div>
  );
}
