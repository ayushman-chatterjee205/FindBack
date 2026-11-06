"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FileText
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rollNumber, setRollNumber] = useState(user?.roll_number || "");
  const [department, setDepartment] = useState("");
  const [topic, setTopic] = useState("custody_inquiry");
  const [referenceId, setReferenceId] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please complete all required fields (Name, Email, Message).");
      return;
    }

    if (!email.toLowerCase().endsWith("@heritageit.edu") && !email.toLowerCase().endsWith("@campus.edu")) {
      setErrorMessage("Please provide your verified college email address (@heritageit.edu).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate reliable dispatch
    await new Promise((r) => setTimeout(r, 800));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Home</span>
      </Link>

      {/* Page Title Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Campus Desk & Inquiries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Campus Custody & Support
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Need physical vault assistance, help claiming an item, or have an urgent query? Reach our duty security officers or submit an online inquiry below.
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: Campus Custody Directory & Checkpoints (5 cols)     */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Vault Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Central Campus Custody Vault
                </h3>
                <span className="text-[11px] text-blue-600 font-semibold">
                  Primary Physical Deposit Point (Bin #E-01 to #E-12)
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Central Block, Ground Floor (Room 101), next to Dean of Student Affairs</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Monday – Saturday</div>
                  <div className="text-slate-500">08:30 AM – 06:30 PM (IST)</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Campus Internal Ext: </span>
                  <span className="font-mono text-slate-900 font-bold">2101</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Checkpoints */}
          <div className="rounded-3xl border border-slate-200/90 bg-slate-50/60 p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3.5 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Secondary Custody Posts</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200/80">
                <div className="font-bold text-slate-900">ICT Block Reception Desk</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Floor 1 Reception · Open Mon–Fri, 09:00 AM – 05:30 PM</div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/80">
                <div className="font-bold text-slate-900">Central Library Information Counter</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Basement Level · Open Mon–Sat, 08:00 AM – 08:00 PM</div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/80">
                <div className="font-bold text-slate-900">Main Security Gate 1 Post</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Campus Main Entrance · 24/7 Control Room (+91 33 2443 0454)</div>
              </div>
            </div>

            {/* Official Support Email */}
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Official Portal Support:</span>
              <a
                href="mailto:findback-support@heritageit.edu"
                className="font-medium text-blue-600 hover:text-blue-700 underline"
              >
                findback-support@heritageit.edu
              </a>
            </div>
          </div>

        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: Interactive Campus Inquiry Form (7 cols)            */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          
          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Inquiry Logged Successfully
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                Your ticket has been routed to the campus custody officer on duty. If this is an urgent matter regarding high-value electronics or cash, visit Central Block Vault (Room 101) directly with your ID card.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                    setReferenceId("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Submit Another Inquiry
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Send Campus Support Inquiry
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct inquiry to custody officers, Proctorial Board, or technical developers.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2 mb-5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Two Column Field Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ayushman Chatterjee"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College Email (@heritageit.edu) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@heritageit.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Roll Number / Staff ID
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 2563002"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department / Year
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CSE / 3rd Year"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Inquiry Topic & Reference ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Inquiry Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="custody_inquiry">Urgent Custody Vault Inquiry</option>
                    <option value="disputed_claim">Claim Verification & Disputed Ownership</option>
                    <option value="otp_qr_issue">Handover OTP / QR Pass Problem</option>
                    <option value="good_samaritan">Finder Recognition & Certificate</option>
                    <option value="technical_bug">Portal Technical Issue / Bug Report</option>
                    <option value="other">General Campus Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Reference Report ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="e.g. LST-2026-081 or BIN #E-04"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Detailed Message */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide complete details including item characteristics, exact misplacement timeline, or ticket description..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-findback-primary text-white text-xs sm:text-sm font-bold hover:bg-findback-primary-hover shadow-sm disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Custody Desk...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Campus Desk</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
