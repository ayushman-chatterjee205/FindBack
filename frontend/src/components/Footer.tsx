"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer on full-screen centered pages (login / register / signed-out / error)
  if (pathname === "/login" || pathname === "/register" || pathname === "/signed-out" || pathname === "/error") {
    return null;
  }

  return (
    <footer className="w-full bg-[#F4F7FB] border-t border-slate-200/80 text-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 md:pb-12">
        {/* Three Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Column 1: FindBack Brand & Info */}
          <div className="flex flex-col">
            <Link href="/" className="inline-flex items-center space-x-2.5 group mb-2">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs group-hover:border-slate-300 transition-all">
                <Image
                  src="/logo.png"
                  alt="FindBack Logo"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
              <span className="font-black text-xl tracking-wider text-slate-900 leading-none">
                FINDBACK
              </span>
            </Link>

            <p className="italic text-xs sm:text-sm text-slate-500 mb-4 max-w-xs leading-relaxed">
              Helping campus belongings find their way home.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Meet the Creator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Help & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Help & Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/faqs"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/report-problem"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Report a Problem
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Divider & Copyright Notice */}
        <div className="border-t border-slate-200/90 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <p className="text-xs text-slate-500 font-medium">
            &copy; 2026 FindBack. Built to bring lost belongings back home.
          </p>
          <p className="text-[11px] text-slate-400">
            Heritage Institute of Technology Campus Edition
          </p>
        </div>
      </div>
    </footer>
  );
};
