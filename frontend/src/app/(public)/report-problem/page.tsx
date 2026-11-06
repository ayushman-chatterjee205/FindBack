import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Report a Problem — FindBack",
  description: "Report technical glitches, incorrect item matching, or security concerns.",
};

export default function ReportProblemPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Help & Support</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Report a Problem
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Submit feedback regarding technical issues, false claims, or portal errors.
        </p>

        <div className="p-6 rounded-2xl bg-[#F4F7FB] border border-slate-200 text-center py-12">
          <p className="text-sm text-slate-600 font-medium">
            Content coming soon. The issue reporting form and ticket submission tool will be integrated here.
          </p>
        </div>
      </div>
    </div>
  );
}
