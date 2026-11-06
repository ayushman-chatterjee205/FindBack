"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Inbox, 
  Sparkles, 
  QrCode, 
  UserCheck, 
  MessageSquare,
  Building2,
  ExternalLink
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "reporting" | "custody" | "matching" | "claims" | "accounts";
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_DATA: FAQItem[] = [
  // 1. Reporting
  {
    id: "rep-1",
    category: "reporting",
    question: "How do I report a lost item on FindBack?",
    answer:
      "Log in with your official college account and navigate to 'Report Lost'. Select the category (Electronics, Keys, Wallets, Documents, etc.), choose the exact campus building and floor where you believe it was misplaced, specify the date and time, and add a descriptive title and visual notes. You can also upload a reference photo if available.",
    highlight: "Reports are instantly cross-referenced against campus custody records.",
  },
  {
    id: "rep-2",
    category: "reporting",
    question: "What are 'Secret Details' and who can see them?",
    answer:
      "Secret Details are confidential identifiers that only the legitimate owner would know—such as a smartphone lockscreen wallpaper description, private keychain engraving, serial numbers, or contents inside a pocket. These details are cryptographically masked from the public catalog and are only disclosed to campus security officers when evaluating a claim.",
    highlight: "Zero-knowledge privacy ensures unauthorized individuals cannot claim your item.",
  },
  {
    id: "rep-3",
    category: "reporting",
    question: "Can I update or delete my report after submission?",
    answer:
      "Yes. You can review, edit, or withdraw any active report from your 'My Reports' dashboard at any time, provided that a physical custody handover has not already been completed.",
  },

  // 2. Custody & Desks
  {
    id: "cus-1",
    category: "custody",
    question: "I found an unattended item on campus. What should I do?",
    answer:
      "First, file a 'Report Found' entry on FindBack so the campus community is notified immediately. Within 2 hours of discovery, hand over the physical item to the nearest campus security post or the Central Block Main Security Desk (Room 101, Bin #E-04). The duty officer will log the item into campus custody and issue a digital confirmation.",
    highlight: "Never keep unattended belongings in hostels or personal bags.",
  },
  {
    id: "cus-2",
    category: "custody",
    question: "Where are the official campus custody deposit points located?",
    answer:
      "FindBack operates 5 designated custody checkpoints across campus: (1) Central Block Main Security Vault (Room 101), (2) ICT Block Ground Floor Reception, (3) CME Block Security Desk, (4) Central Library Basement Reception, and (5) Campus Canteen Security Post. All checkpoints are CCTV-monitored.",
  },
  {
    id: "cus-3",
    category: "custody",
    question: "What are Custody Bins (e.g. BIN #E-04)?",
    answer:
      "Every physical item deposited with campus security is cataloged into an industrial, tamper-evident custody locker bin labeled from BIN #E-01 through BIN #E-12. This ensures physical belongings are organized systematically and can be retrieved by staff in under 60 seconds during verification.",
  },
  {
    id: "cus-4",
    category: "custody",
    question: "Does the finder receive official recognition?",
    answer:
      "Yes! When an item is successfully reunited with its owner, the finder's contribution is recorded in the verified campus Good Samaritan registry, acknowledging their integrity and civic responsibility.",
  },

  // 3. AI Matching
  {
    id: "mat-1",
    category: "matching",
    question: "How does the multi-signal AI matching engine work?",
    answer:
      "FindBack utilizes a 4-signal composite matching algorithm combining: (1) Text Semantic Embeddings (35% weight) to understand semantic descriptions, (2) Visual Feature Embeddings (35% weight) for color and shape similarity, (3) Spatial Proximity Trees (15% weight) to score building and floor closeness, and (4) Temporal Decay Curves (15% weight) reflecting date and time elapsed.",
    highlight: "Composite compatibility scores range from 0% to 100%.",
  },
  {
    id: "mat-2",
    category: "matching",
    question: "What score triggers an automated match notification?",
    answer:
      "When a candidate match scores 75% or higher, the system automatically dispatches an in-app alert and high-priority notification to the reporting student, presenting the matched item along with safe claiming options.",
  },

  // 4. Claims & OTP Handover
  {
    id: "clm-1",
    category: "claims",
    question: "How do I prove ownership to claim a found item?",
    answer:
      "Click 'Claim This Item' from the catalog or match alert. You will be prompted to provide proof of ownership (e.g., photo of original bill, IMEI number, serial number, or exact description of confidential characteristics). A campus security officer will review your evidence before granting approval.",
  },
  {
    id: "clm-2",
    category: "claims",
    question: "How does the Anti-Fraud Dynamic QR Handover work?",
    answer:
      "Once your claim is approved, the portal generates a secure pickup pass featuring a time-sensitive, cryptographically signed QR code and a 6-digit OTP (valid for 15 minutes). When you visit the security desk, the officer scans your QR code or inputs your OTP. Upon confirmation, the physical item is handed over and the registry updates to 'Returned'.",
    highlight: "Prevents fraudulent claims, theft, and unauthorized collection.",
  },
  {
    id: "clm-3",
    category: "claims",
    question: "What if I lose internet connectivity in the campus basement?",
    answer:
      "Your approved pickup pass and 6-digit handover OTP remain accessible offline in your browser session. If network access drops, present your saved offline pass and physical college ID card directly to the officer at the Central Library or Central Block desk for manual override verification.",
  },

  // 5. Accounts & Policies
  {
    id: "acc-1",
    category: "accounts",
    question: "Why is registration restricted to @heritageit.edu email addresses?",
    answer:
      "To safeguard campus assets and prevent impersonation, only students and faculty with verified college email credentials (@heritageit.edu) are eligible to register. This ensures complete traceability and community trust.",
  },
  {
    id: "acc-2",
    category: "accounts",
    question: "Who holds staff custody clearance?",
    answer:
      "Staff console privileges are strictly allocated to verified Campus Security Personnel, Proctorial Board Members, and Departmental Administrative Custodians. Student accounts are barred from staff consoles to safeguard audit integrity.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Questions", icon: HelpCircle },
  { key: "reporting", label: "Reporting", icon: Inbox },
  { key: "custody", label: "Custody & Desks", icon: Building2 },
  { key: "matching", label: "AI Matching", icon: Sparkles },
  { key: "claims", label: "Claims & QR", icon: QrCode },
  { key: "accounts", label: "Accounts & Policy", icon: UserCheck },
] as const;

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "rep-1": true, "cus-1": true });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        (faq.highlight && faq.highlight.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Home</span>
      </Link>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8">
        
        {/* Header Badge & Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & Support</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed mb-8">
          Everything you need to know about campus lost and found policies, multi-signal AI matching, physical custody bins, and secure QR-verified handovers.
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. secret details, custody bin, QR code, matching score)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        {filteredFAQs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">No matching questions found</h3>
            <p className="text-xs text-slate-500 mb-4">
              We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Try another term or contact campus security.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-blue-200 bg-blue-50/20 shadow-xs"
                      : "border-slate-200/90 bg-white hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/60">
                      <p>{faq.answer}</p>
                      {faq.highlight && (
                        <div className="mt-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-blue-800 text-xs font-medium flex items-center space-x-2">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Still Need Assistance Callout Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1E3A5F] via-[#234E70] to-[#0F172A] p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block mb-1">
            Need Direct Help?
          </span>
          <h3 className="text-xl font-extrabold text-white mb-1.5">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-md leading-relaxed">
            Our campus security team and custody officers are available at Central Block Vault (Room 101) or via the online inquiry form.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Contact Desk</span>
          </Link>

          <Link
            href="/safety"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Safety Guidelines</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
