"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Tag, Inbox, Calendar, ShieldCheck, ArrowRight, X, Clock, HelpCircle, RefreshCw, CheckCircle2, User, UserCheck, Shield, Sparkles, Building2 } from "lucide-react";
import { ItemCard } from "@/components/ItemCard";
import { CustodyCrateLoader } from "@/components/CustodyCrateLoader";
import { ItemCategory, ItemStatus, FoundItem, LostItem, ReturnedItem } from "@/types";
import { api } from "@/lib/api";
import { formatDate, getCategoryEmoji, getStatusDetails } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { SignInRequiredModal } from "@/components/SignInRequiredModal";

interface CatalogItem {
  id: string;
  type: "found" | "lost";
  title: string;
  category: ItemCategory;
  locationName: string;
  date: string;
  status: ItemStatus;
  description: string;
  imageUrl?: string;
  storageLockerBin?: string;
}

function BrowseContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");
  const tabParam = searchParams.get("tab");
  const idParam = searchParams.get("id");

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [returnedItems, setReturnedItems] = useState<ReturnedItem[]>([]);
  const [claimedTitles, setClaimedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(locationParam || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "found" | "lost" | "returned">(
    tabParam === "returned" ? "returned" : "all"
  );
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [selectedReturnedItem, setSelectedReturnedItem] = useState<ReturnedItem | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInModalConfig, setSignInModalConfig] = useState({
    title: "Sign In Required",
    description: "Please sign in to proceed with claiming or reporting items.",
    redirectUrl: "/browse",
  });

  useEffect(() => {
    if (locationParam) {
      setSearchQuery(locationParam);
    }
  }, [locationParam]);

  useEffect(() => {
    if (tabParam === "returned") {
      setTypeFilter("returned");
    }
  }, [tabParam]);

  const loadCatalogItems = useCallback(async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const [foundRes, lostRes, returnedRes] = await Promise.allSettled([
        api.get<FoundItem[]>("/found-items"),
        api.get<LostItem[]>("/lost-items"),
        api.get<ReturnedItem[]>("/found-items/returned"),
      ]);

      const combined: CatalogItem[] = [];

      if (foundRes.status === "fulfilled" && Array.isArray(foundRes.value)) {
        foundRes.value.forEach((item) => {
          combined.push({
            id: item.id,
            type: "found",
            title: item.title,
            category: item.category,
            locationName: item.location_name || "Campus Custody Desk",
            date: item.found_timestamp,
            status: item.status || "IN_CUSTODY",
            description: item.description,
            imageUrl: item.primary_image_url,
            storageLockerBin: item.storage_locker_bin,
          });
        });
      }

      if (lostRes.status === "fulfilled" && Array.isArray(lostRes.value)) {
        lostRes.value.forEach((item) => {
          combined.push({
            id: item.id,
            type: "lost",
            title: item.title,
            category: item.category,
            locationName: item.location_name || "Campus Zone",
            date: item.lost_timestamp,
            status: item.status || "LOST",
            description: item.description,
            imageUrl: item.image_url,
          });
        });
      }

      // Sort latest first
      combined.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setItems(combined);

      if (returnedRes.status === "fulfilled" && Array.isArray(returnedRes.value)) {
        setReturnedItems(returnedRes.value);
      }

      if (user) {
        try {
          const myClaims = await api.get<any[]>("/claims/my");
          if (Array.isArray(myClaims)) {
            setClaimedTitles(myClaims.map((c) => c.item_title).filter(Boolean));
          }
        } catch {
          // Ignore
        }
      }
    } catch (err) {
      console.error("Failed to load catalog items:", err);
    } finally {
      setIsLoading(false);
      if (showSpin) setIsRefreshing(false);
    }
  }, [user]);

  // Initial load and auto-sync every 5 seconds
  useEffect(() => {
    loadCatalogItems(false);
    const interval = setInterval(() => {
      loadCatalogItems(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [loadCatalogItems]);

  // Dynamically compute all categories from real items in database + defaults
  const dynamicCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    const sourceList = typeFilter === "returned" ? returnedItems : items;
    sourceList.forEach((item) => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });

    const baseList = [
      "Electronics",
      "IDs & Cards",
      "Keys",
      "Bags & Wallets",
      "Accessories",
      "Books & Notes",
      "Clothing",
      "Other",
    ];

    const allNames = Array.from(new Set([...baseList, ...Object.keys(counts)]));

    // Sort categories: categories with active items first, then alphabetically
    allNames.sort((a, b) => {
      const cA = counts[a] || 0;
      const cB = counts[b] || 0;
      if (cB !== cA) return cB - cA;
      return a.localeCompare(b);
    });

    return [
      { name: "All", count: sourceList.length },
      ...allNames.map((name) => ({ name, count: counts[name] || 0 })),
    ];
  }, [items, returnedItems, typeFilter]);

  const foundCount = items.filter((i) => i.type === "found").length;
  const lostCount = items.filter((i) => i.type === "lost").length;
  const returnedCount = returnedItems.length;

  const filteredItems = items.filter((item) => {
    // Type tab filter
    if (typeFilter === "found" && item.type !== "found") return false;
    if (typeFilter === "lost" && item.type !== "lost") return false;

    // Category filter
    if (selectedCategory !== "All" && item.category !== selectedCategory)
      return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.locationName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      return matchTitle || matchLoc || matchDesc || matchCat;
    }

    return true;
  });

  const filteredReturnedItems = useMemo(() => {
    return returnedItems.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchOwner = item.owner_name?.toLowerCase().includes(q);
        const matchRoll = item.owner_roll?.toLowerCase().includes(q);
        const matchLoc = item.location_name?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchCat = item.category?.toLowerCase().includes(q);
        const matchOfficer = item.handed_over_by?.toLowerCase().includes(q);
        return matchTitle || matchOwner || matchRoll || matchLoc || matchDesc || matchCat || matchOfficer;
      }
      return true;
    });
  }, [returnedItems, selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-findback-primary block">
              Campus Lost & Found Registry
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Auto-Sync Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-findback-text">
            All Lost & Found Items
          </h1>
          <p className="text-xs sm:text-sm text-findback-muted mt-1">
            Unified live campus directory of items reported missing and items safeguarded in campus custody.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => loadCatalogItems(true)}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-findback-border bg-white text-xs font-semibold text-findback-muted hover:text-findback-text hover:bg-findback-bg transition-all disabled:opacity-50"
            title="Refresh catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-findback-primary" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/report-lost"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
          >
            <span>Report Lost</span>
          </Link>
          <Link
            href="/report-found"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-findback-border bg-white text-findback-text hover:bg-findback-bg shadow-sm transition-all"
          >
            <span>I Found Something</span>
          </Link>
        </div>
      </div>

      {/* Type Toggle Tabs */}
      <div className="flex border-b border-findback-border space-x-4 sm:space-x-6 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setTypeFilter("all")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
            typeFilter === "all"
              ? "text-findback-primary border-b-2 border-findback-primary"
              : "text-findback-muted hover:text-findback-text"
          }`}
        >
          All Items ({items.length})
        </button>
        <button
          onClick={() => setTypeFilter("found")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center space-x-1.5 whitespace-nowrap ${
            typeFilter === "found"
              ? "text-findback-primary border-b-2 border-findback-primary"
              : "text-findback-muted hover:text-findback-text"
          }`}
        >
          <span>Found (In Custody)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {foundCount}
          </span>
        </button>
        <button
          onClick={() => setTypeFilter("lost")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center space-x-1.5 whitespace-nowrap ${
            typeFilter === "lost"
              ? "text-findback-primary border-b-2 border-findback-primary"
              : "text-findback-muted hover:text-findback-text"
          }`}
        >
          <span>Reported Lost</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-orange-100 text-orange-800 font-bold">
            {lostCount}
          </span>
        </button>
        <button
          onClick={() => setTypeFilter("returned")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center space-x-1.5 whitespace-nowrap ${
            typeFilter === "returned"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "text-findback-muted hover:text-findback-text"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Returned to Owners</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {returnedCount}
          </span>
        </button>
      </div>

      {/* Returned Items Showcase Banner */}
      {typeFilter === "returned" && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-emerald-950">
                  Verified Returned Items Archive
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                  Live Audit Trail
                </span>
              </div>
              <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                Official institutional log of belongings verified and successfully returned to verified students and campus members, featuring verified owner name, handover date, and release timing.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-900 shrink-0 shadow-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{returnedItems.length} Successfully Reconnected</span>
          </div>
        </div>
      )}

      {/* Search Bar & Dynamic Category Filters */}
      <div className="space-y-4 mb-8">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-findback-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={
              typeFilter === "returned"
                ? "Search returned items by title, owner name, student roll/ID, or location..."
                : "Search by keyword, item title, or campus building (e.g. calculator, ICT Block, library, keys)..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-findback-border bg-white text-sm text-findback-text placeholder:text-findback-muted shadow-subtle outline-none focus:border-findback-primary focus:ring-1 focus:ring-findback-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3 text-findback-muted hover:text-findback-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dynamic Category Pills with live item counts */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                selectedCategory === cat.name
                  ? "bg-findback-primary text-white shadow-sm"
                  : "bg-white border border-findback-border text-findback-muted hover:text-findback-text hover:border-gray-300"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.name
                    ? "bg-white/20 text-white"
                    : "bg-findback-sand text-findback-primary"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-findback-muted mb-4 pb-2 border-b border-findback-border">
        <span>
          Showing <strong className="text-findback-text">
            {typeFilter === "returned" ? filteredReturnedItems.length : filteredItems.length}
          </strong> items
          {typeFilter === "found" && " in Found Custody"}
          {typeFilter === "lost" && " in Reported Lost"}
          {typeFilter === "returned" && " in Returned to Owners (Showing Owner Name, Date & Timing)"}
          {selectedCategory !== "All" && ` · ${selectedCategory}`}
        </span>
        <span className="italic text-[11px]">Real-time campus database</span>
      </div>

      {/* Grid of Items */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-findback-border p-8 shadow-card flex items-center justify-center">
          <CustodyCrateLoader
            size="md"
            label="Synchronizing Campus Catalog..."
            subtext="Fetching active custody bins and verified items from database..."
          />
        </div>
      ) : typeFilter === "returned" ? (
        filteredReturnedItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-findback-border p-8 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-findback-text mb-1">
              No returned items recorded yet
            </h3>
            <p className="text-xs text-findback-muted max-w-md mx-auto mb-4 leading-relaxed">
              When custody items are verified and returned to their owners at the custody desk, their official verification stamps with owner name, date, and exact timing will be displayed here.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setTypeFilter("all");
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
            >
              <span>Browse Active Registry</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReturnedItems.map((retItem) => (
              <div
                key={retItem.id}
                onClick={() => setSelectedReturnedItem(retItem)}
                className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-card hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Status badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Returned to Owner</span>
                    </span>
                    <span className="text-[11px] font-semibold text-findback-muted px-2 py-0.5 rounded-md bg-findback-sand border border-findback-border">
                      {retItem.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-findback-text group-hover:text-emerald-900 transition-colors line-clamp-1 mb-1">
                    {retItem.title}
                  </h3>
                  {retItem.description && (
                    <p className="text-xs text-findback-muted line-clamp-2 leading-relaxed mb-4">
                      {retItem.description}
                    </p>
                  )}

                  {/* Owner Badge Box */}
                  <div className="p-3 rounded-xl bg-findback-sand/60 border border-findback-border/70 space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-findback-muted flex items-center gap-1 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Owner Name:</span>
                      </span>
                      <strong className="text-findback-text font-bold text-xs">{retItem.owner_name}</strong>
                    </div>
                    {retItem.owner_roll && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-findback-muted font-medium">Student Roll/ID:</span>
                        <span className="font-mono text-[11px] font-semibold text-findback-primary">{retItem.owner_roll}</span>
                      </div>
                    )}
                  </div>

                  {/* Date & Timing Information Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1 mb-0.5">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>Date</span>
                      </span>
                      <span className="font-semibold text-findback-text text-xs">{retItem.returned_date}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1 mb-0.5">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>Timing</span>
                      </span>
                      <span className="font-semibold text-findback-text text-xs">{retItem.returned_time}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Custody info */}
                <div className="pt-2 border-t border-findback-border/50 flex items-center justify-between text-[11px] text-findback-muted">
                  <span className="flex items-center gap-1 truncate max-w-[170px]" title={retItem.location_name}>
                    <MapPin className="w-3 h-3 text-findback-primary shrink-0" />
                    <span className="truncate">{retItem.location_name || "Campus Custody Vault"}</span>
                  </span>
                  {retItem.handed_over_by && (
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Handed by {retItem.handed_over_by.split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-findback-border p-8 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-findback-sand flex items-center justify-center text-findback-muted mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-findback-text mb-1">
            No matching items found
          </h3>
          <p className="text-xs text-findback-muted max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, selecting another category, or submit a new report.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setTypeFilter("all");
              }}
              className="text-xs font-semibold text-findback-primary hover:underline"
            >
              Clear filters
            </button>
            <span className="text-findback-border">|</span>
            <Link
              href="/report-lost"
              className="text-xs font-semibold text-findback-primary hover:underline"
            >
              Report a Lost Item →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
              <ItemCard
                id={item.id}
                title={item.title}
                category={item.category}
                locationName={item.locationName}
                date={item.date}
                status={item.status}
                imageUrl={item.imageUrl}
                isClickable={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Item Details Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-findback-border space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border mb-2 ${
                  selectedItem.type === "found"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-orange-50 text-orange-800 border-orange-200"
                }`}>
                  {selectedItem.type === "found" ? "FOUND IN CUSTODY" : "REPORTED LOST"}
                </span>
                <h2 className="text-xl font-bold text-findback-text leading-snug">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-findback-muted hover:text-findback-text p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo / Emoji Box */}
            <div className="w-full h-48 rounded-xl bg-findback-sand/50 border border-findback-border flex items-center justify-center overflow-hidden">
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-findback-muted">
                  <span className="text-5xl block mb-2">
                    {getCategoryEmoji(selectedItem.category)}
                  </span>
                  <span className="text-xs font-semibold">{selectedItem.category}</span>
                </div>
              )}
            </div>

            {/* Metadata Info */}
            <div className="space-y-2.5 text-xs text-findback-text">
              <div className="flex items-center space-x-2 text-findback-muted">
                <MapPin className="w-4 h-4 text-findback-primary shrink-0" />
                <span>
                  <strong className="text-findback-text">Location:</strong>{" "}
                  {selectedItem.locationName}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-findback-muted">
                <Calendar className="w-4 h-4 text-findback-primary shrink-0" />
                <span>
                  <strong className="text-findback-text">
                    {selectedItem.type === "found" ? "Found on:" : "Reported lost on:"}
                  </strong>{" "}
                  {formatDate(selectedItem.date)}
                </span>
              </div>
              {selectedItem.storageLockerBin && (
                <div className="flex items-center space-x-2 text-findback-muted">
                  <ShieldCheck className="w-4 h-4 text-findback-accent shrink-0" />
                  <span>
                    <strong className="text-findback-text">Custody Location:</strong>{" "}
                    {selectedItem.storageLockerBin}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-findback-bg/60 border border-findback-border/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-findback-muted block mb-1">
                Public Description
              </span>
              <p className="text-xs text-findback-text leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-findback-muted hover:text-findback-text transition-colors"
              >
                Close
              </button>

              {selectedItem.type === "found" ? (
                selectedItem.status === "RETURNED" ? (
                  <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Item Returned to Owner ✓</span>
                  </span>
                ) : selectedItem.status === "VERIFIED" ? (
                  <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Under Handover Collection</span>
                  </span>
                ) : claimedTitles.includes(selectedItem.title) ? (
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Claim Submitted</span>
                    </span>
                    <Link
                      href="/my-reports"
                      className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
                    >
                      <span>Track Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        setSignInModalConfig({
                          title: "Sign In to Claim Item",
                          description: "To submit an ownership verification claim and obtain a security handover token, please sign in with your campus account.",
                          redirectUrl: `/claim/${selectedItem.id}`,
                        });
                        setIsSignInModalOpen(true);
                      } else {
                        window.location.href = `/claim/${selectedItem.id}`;
                      }
                    }}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
                  >
                    <span>Claim This Item</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      setSignInModalConfig({
                        title: "Sign In to Register Item",
                        description: "Registering a found item into campus custody requires signing into your campus account.",
                        redirectUrl: `/report-found?title=${encodeURIComponent(selectedItem.title)}`,
                      });
                      setIsSignInModalOpen(true);
                    } else {
                      window.location.href = `/report-found?title=${encodeURIComponent(selectedItem.title)}`;
                    }
                  }}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-accent text-white hover:bg-findback-accent-hover shadow-sm transition-all"
                >
                  <span>I Found This Item!</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Returned Item Details Preview Modal */}
      {selectedReturnedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SUCCESSFULLY RETURNED TO OWNER</span>
                </span>
                <h2 className="text-xl font-bold text-findback-text leading-snug">
                  {selectedReturnedItem.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedReturnedItem(null)}
                className="text-findback-muted hover:text-findback-text p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo / Emoji Box */}
            <div className="w-full h-44 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-center overflow-hidden">
              {selectedReturnedItem.image_url ? (
                <img
                  src={selectedReturnedItem.image_url}
                  alt={selectedReturnedItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-findback-muted">
                  <span className="text-5xl block mb-2">
                    {getCategoryEmoji(selectedReturnedItem.category)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">{selectedReturnedItem.category}</span>
                </div>
              )}
            </div>

            {/* Verified Owner Showcase Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-950 font-bold text-xs">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified Campus Owner</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-[10px] text-findback-muted uppercase tracking-wider block font-medium">Full Name</span>
                  <span className="font-bold text-findback-text text-sm">{selectedReturnedItem.owner_name}</span>
                </div>
                {selectedReturnedItem.owner_roll && (
                  <div>
                    <span className="text-[10px] text-findback-muted uppercase tracking-wider block font-medium">Roll Number / ID</span>
                    <span className="font-mono font-bold text-findback-primary text-sm">{selectedReturnedItem.owner_roll}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Date & Timing Information */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-findback-border flex items-start space-x-2.5">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-findback-muted uppercase tracking-wider block font-medium">Handover Date</span>
                  <span className="font-bold text-findback-text text-xs">{selectedReturnedItem.returned_date}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-findback-border flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-findback-muted uppercase tracking-wider block font-medium">Release Timing</span>
                  <span className="font-bold text-findback-text text-xs">{selectedReturnedItem.returned_time}</span>
                </div>
              </div>
            </div>

            {/* Custody Handover Verification Details */}
            <div className="p-3.5 rounded-xl bg-findback-bg/70 border border-findback-border text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-findback-muted font-medium">Handover Desk Officer:</span>
                <span className="font-semibold text-findback-text">{selectedReturnedItem.handed_over_by || "Campus Security Officer"}</span>
              </div>
              {selectedReturnedItem.storage_locker_bin && (
                <div className="flex items-center justify-between">
                  <span className="text-findback-muted font-medium">Vacated Storage Locker:</span>
                  <span className="font-semibold text-findback-text">{selectedReturnedItem.storage_locker_bin}</span>
                </div>
              )}
              {selectedReturnedItem.location_name && (
                <div className="flex items-center justify-between">
                  <span className="text-findback-muted font-medium">Campus Location:</span>
                  <span className="font-semibold text-findback-text">{selectedReturnedItem.location_name}</span>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-1 flex items-center justify-end">
              <button
                onClick={() => setSelectedReturnedItem(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
              >
                Close Archive Record
              </button>
            </div>
          </div>
        </div>
      )}

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

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
          <CustodyCrateLoader
            size="md"
            label="Loading Campus Catalog..."
            subtext="Accessing campus custody items & verified registries..."
          />
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
