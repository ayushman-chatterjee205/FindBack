"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Package, ArrowRight, Shield, Inbox, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ItemCard } from "@/components/ItemCard";
import { CampusHotspots } from "@/components/CampusHotspots";
import { SplitHero } from "@/components/SplitHero";
import { CustodyCrateLoader } from "@/components/CustodyCrateLoader";
import { SignInRequiredModal } from "@/components/SignInRequiredModal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ItemCategory, ItemStatus, FoundItem, LostItem } from "@/types";
import { api } from "@/lib/api";

interface RecentItem {
  id: string;
  title: string;
  category: ItemCategory;
  locationName: string;
  date: string;
  status: ItemStatus;
  imageUrl?: string;
}

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInModalConfig, setSignInModalConfig] = useState({
    title: "Sign In Required",
    description: "Accessing this feature requires campus authentication.",
    redirectUrl: "/",
  });

  const promptSignIn = (title: string, description: string, redirectUrl: string) => {
    setSignInModalConfig({ title, description, redirectUrl });
    setIsSignInModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRecent = async (silent = false) => {
      if (!silent) setIsLoading(true);
      try {
        const [foundRes, lostRes] = await Promise.allSettled([
          api.get<FoundItem[]>("/found-items"),
          api.get<LostItem[]>("/lost-items"),
        ]);

        if (!isMounted) return;
        const combined: RecentItem[] = [];

        if (foundRes.status === "fulfilled" && Array.isArray(foundRes.value)) {
          foundRes.value.forEach((item) => {
            combined.push({
              id: item.id,
              title: item.title,
              category: item.category,
              locationName: item.location_name || "Campus Custody Desk",
              date: item.found_timestamp,
              status: item.status || "IN_CUSTODY",
              imageUrl: item.primary_image_url,
            });
          });
        }

        if (lostRes.status === "fulfilled" && Array.isArray(lostRes.value)) {
          lostRes.value.forEach((item) => {
            combined.push({
              id: item.id,
              title: item.title,
              category: item.category,
              locationName: item.location_name || "Campus Zone",
              date: item.lost_timestamp,
              status: item.status || "LOST",
              imageUrl: item.image_url,
            });
          });
        }

        combined.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentItems(combined.slice(0, 4));
      } catch {
        if (isMounted) setRecentItems([]);
      } finally {
        if (isMounted && !silent) {
          setIsLoading(false);
        }
      }
    };

    fetchRecent();
    const interval = setInterval(() => {
      fetchRecent(true);
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Dynamic greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <CustodyCrateLoader
          size="md"
          label="Entering FindBack Campus Portal..."
          subtext="Authenticating student session & checking campus notifications..."
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Split Hero Section (Matching Altitude-Style Design) */}
      <SplitHero userFullName={user?.full_name} isStaff={user?.role === "staff"} />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Friendly User Status Bar */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-findback-border/70 gap-2">
            <div className="flex items-center space-x-2.5 text-sm text-findback-muted font-medium">
              <span className="text-base">{greeting} 👋</span>
              {user ? (
                <>
                  <span className="text-findback-text font-bold">
                    {user.full_name}
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-findback-sand text-findback-primary font-mono font-semibold border border-findback-border">
                    {user.role === "staff" ? "🛡️ Security Staff Desk" : "🎓 Campus Student Account"}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-findback-text font-bold">Campus Guest</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold border border-slate-200">
                    👁️ Public Catalog View
                  </span>
                </>
              )}
            </div>

            <div className="text-xs text-findback-muted flex items-center space-x-2">
              <span>Visit:</span>
              {user ? (
                <Link href="/my-reports" className="font-semibold text-findback-primary hover:underline">
                  My Reports
                </Link>
              ) : (
                <button
                  onClick={() =>
                    promptSignIn(
                      "Sign In to View Reports",
                      "Please sign in to track and view your active lost & found reports.",
                      "/my-reports"
                    )
                  }
                  className="font-semibold text-findback-primary hover:underline"
                >
                  My Reports
                </button>
              )}
              <span>·</span>
              <Link href="/browse" className="font-semibold text-findback-primary hover:underline">
                Search Items
              </Link>
              <span>·</span>
              <Link href="/browse?tab=returned" className="font-semibold text-emerald-700 hover:underline">
                Returned Archive
              </Link>
              {!user && (
                <>
                  <span>·</span>
                  <Link href="/login" className="font-semibold text-findback-primary hover:underline">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Two BIG Action Buttons */}
        <ScrollReveal delayMs={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-8">
          {/* I LOST SOMETHING */}
          <button
            onClick={() => {
              if (!user) {
                promptSignIn(
                  "Sign In to Report Lost Item",
                  "Filing a lost property report and receiving real-time AI matches requires signing into your campus account.",
                  "/report-lost"
                );
              } else {
                router.push("/report-lost");
              }
            }}
            className="text-left bg-white rounded-2xl p-6 sm:p-8 border-2 border-findback-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 shadow-card card-hover flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100 group-hover:scale-105 flex items-center justify-center mb-4 transition-all">
                <Search className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-orange-600 block mb-1">
                File a Lost Report
              </span>
              <h2 className="text-2xl font-bold text-findback-text group-hover:text-orange-600 transition-colors">
                I Lost Something
              </h2>
              <p className="text-xs sm:text-sm text-findback-muted mt-2 leading-relaxed">
                Tell us what is missing. Our campus matching engine compares descriptions, locations, and photos to find your item.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-findback-border flex items-center justify-between text-xs font-semibold text-orange-600 group-hover:text-orange-700">
              <span>Start lost report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* I FOUND SOMETHING */}
          <button
            onClick={() => {
              if (!user) {
                promptSignIn(
                  "Sign In to Register Found Item",
                  "Registering found property into campus custody bins requires signing into your campus account.",
                  "/report-found"
                );
              } else {
                router.push("/report-found");
              }
            }}
            className="text-left bg-white rounded-2xl p-6 sm:p-8 border-2 border-findback-border hover:border-findback-accent shadow-card card-hover flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-findback-accent flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <Package className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-findback-accent block mb-1">
                Campus Drop-off or Registry
              </span>
              <h2 className="text-2xl font-bold text-findback-text group-hover:text-findback-accent transition-colors">
                I Found Something
              </h2>
              <p className="text-xs sm:text-sm text-findback-muted mt-2 leading-relaxed">
                Found an item on campus? Log it quickly or turn it into the nearest security desk to help it reach its owner.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-findback-border flex items-center justify-between text-xs font-semibold text-findback-accent">
              <span>Register found item</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
        </ScrollReveal>

        {/* Underneath Sub-actions */}
        <ScrollReveal delayMs={150}>
          <div className="text-center py-2 text-xs sm:text-sm text-findback-muted flex items-center justify-center space-x-2">
            {user ? (
              <Link
                href="/my-reports"
                className="font-medium text-findback-primary hover:underline"
              >
                Track a report
              </Link>
            ) : (
              <button
                onClick={() =>
                  promptSignIn(
                    "Sign In to Track Reports",
                    "Please sign in to track your submissions, view verified matches, and obtain handover pins.",
                    "/my-reports"
                  )
                }
                className="font-medium text-findback-primary hover:underline"
              >
                Track a report
              </button>
            )}
            <span>·</span>
            <Link
              href="/browse"
              className="font-medium text-findback-primary hover:underline"
            >
              Browse found items
            </Link>
            <span>·</span>
            <Link
              href="/#hotspots"
              className="font-medium text-findback-primary hover:underline"
            >
              Campus hotspots
            </Link>
          </div>
        </ScrollReveal>

        {/* Human Philosophy Banner */}
        <ScrollReveal delayMs={100}>
          <div className="my-10 p-5 rounded-2xl bg-white border border-findback-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-findback-sand flex items-center justify-center text-findback-accent shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-findback-text">
                  Zero Guesswork. Anti-Fraud Custody Verification.
                </h4>
                <p className="text-xs text-findback-muted mt-0.5">
                  Distinguishing marks are kept confidential. Owners prove identity before dynamic QR handovers.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-findback-accent shrink-0 italic">
              &ldquo;One less thing to worry about.&rdquo;
            </span>
          </div>
        </ScrollReveal>

        {/* Recent Activity Feed */}
        <ScrollReveal delayMs={100}>
          <section className="my-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-findback-muted block mb-1">
                  Live Campus Updates
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-findback-text">
                  Recent Activity
                </h2>
              </div>
              {user ? (
                <Link
                  href="/browse"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-findback-primary hover:text-findback-primary-hover group"
                >
                  <span>View all items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    promptSignIn(
                      "Sign In to View All Updates",
                      "Viewing campus-wide live activity updates and recovered items requires signing into your campus account.",
                      "/browse"
                    )
                  }
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-findback-primary hover:text-findback-primary-hover group"
                >
                  <span>View all items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              {/* Content (Texts inside cards blurred when !user) */}
              <div>
                {recentItems.length === 0 ? (
                  !user ? (
                    /* Sample cards with blurred text for guests */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: "Calculus Notebook", cat: "Notebooks" as ItemCategory, loc: "Central Library 2F", date: "2026-10-24" },
                        { title: "Blue Water Bottle", cat: "Other" as ItemCategory, loc: "Canteen Annex", date: "2026-10-24" },
                        { title: "HP Laptop Charger", cat: "Electronics" as ItemCategory, loc: "ICT Lab 204", date: "2026-10-24" },
                        { title: "Campus ID Card", cat: "IDs" as ItemCategory, loc: "CME Block 1F", date: "2026-10-24" },
                      ].map((item, idx) => (
                        <ItemCard
                          key={idx}
                          id={`preview-${idx}`}
                          title={item.title}
                          category={item.cat}
                          locationName={item.loc}
                          date={item.date}
                          status="IN_CUSTODY"
                          isCensored={true}
                          onCensoredClick={() =>
                            promptSignIn(
                              "Sign In to View Live Updates",
                              "Campus item activity feeds and recovery notifications are reserved for verified campus students and staff.",
                              "/browse"
                            )
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-findback-border p-8 text-center">
                      <div className="w-12 h-12 rounded-xl bg-findback-sand flex items-center justify-center text-findback-muted mx-auto mb-3">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-findback-text mb-1">
                        No recent activity yet
                      </h3>
                      <p className="text-xs text-findback-muted max-w-md mx-auto">
                        Newly reported lost items and items registered into custody will appear here in real time.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        category={item.category}
                        locationName={item.locationName}
                        date={item.date}
                        status={item.status}
                        imageUrl={item.imageUrl}
                        isCensored={!user}
                        onCensoredClick={() =>
                          promptSignIn(
                            "Sign In to View Live Updates",
                            "Campus item activity feeds and recovery notifications are reserved for verified campus students and staff.",
                            "/browse"
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Campus Hotspots Topology */}
        <ScrollReveal delayMs={100}>
          <CampusHotspots
            isCensored={!user}
            onRequireAuth={() =>
              promptSignIn(
                "Sign In to Access Hotspots",
                "Campus map topology, building cluster density, and custody lockers are restricted to verified campus students and staff.",
                "/#hotspots"
              )
            }
          />
        </ScrollReveal>
      </div>

      {/* Sign In Required Modal */}
      <SignInRequiredModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        title={signInModalConfig.title}
        description={signInModalConfig.description}
        redirectUrl={signInModalConfig.redirectUrl}
      />
    </div>
  );
}
