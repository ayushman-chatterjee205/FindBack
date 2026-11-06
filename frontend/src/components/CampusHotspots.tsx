"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Building2,
  BookOpen,
  Coffee,
  Inbox,
  Clock,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import { ItemCategory, ItemStatus, FoundItem, LostItem } from "@/types";
import { formatDate, getCategoryEmoji } from "@/lib/utils";

interface HotspotItem {
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

interface CampusBuildingConfig {
  id: string;
  name: string;
  category: string;
  floorsCount: number;
  floorDetails: string;
  keywords: string[];
  icon: React.ElementType;
}

const BUILDINGS_CONFIG: CampusBuildingConfig[] = [
  {
    id: "ict-block",
    name: "ICT Block",
    category: "Information & Tech Labs",
    floorsCount: 6,
    floorDetails: "6 Floors (Floor 1 to Floor 6: Labs, Classrooms & Tech Wings)",
    keywords: ["ict", "information", "lab 10", "lab 20", "lab 30"],
    icon: Building2,
  },
  {
    id: "cme-block",
    name: "CME Block",
    category: "Civil & Mechanical Engineering",
    floorsCount: 6,
    floorDetails: "6 Floors (Floor 1 to Floor 6: Workshops, CAD Labs & Lecture Theatres)",
    keywords: ["cme", "civil", "mechanical", "workshop", "cad"],
    icon: Building2,
  },
  {
    id: "central-block",
    name: "Central Block",
    category: "Administration & Main Auditorium",
    floorsCount: 6,
    floorDetails: "6 Floors (Floor 1 to Floor 6: Main Security Vault, Deans & Grand Hall)",
    keywords: ["central block", "admin", "senate", "registrar", "directorate"],
    icon: Building2,
  },
  {
    id: "library",
    name: "Central Library",
    category: "Reading Hall & Book Stacks (Basement)",
    floorsCount: 1,
    floorDetails: "Basement (Single Central Library Level: Reading Hall & Book Stacks)",
    keywords: ["library", "reading hall", "book stacks", "circulation"],
    icon: BookOpen,
  },
  {
    id: "canteen",
    name: "Campus Canteen",
    category: "Food Court & Student Commons",
    floorsCount: 2,
    floorDetails: "Ground Floor & Mezzanine Seating (Indoor Food Court & Cafe)",
    keywords: ["canteen", "food court", "cafe", "dining", "mezzanine"],
    icon: Coffee,
  },
];

interface CampusHotspotsProps {
  isCensored?: boolean;
  onRequireAuth?: () => void;
}

export const CampusHotspots: React.FC<CampusHotspotsProps> = ({
  isCensored = false,
  onRequireAuth,
}) => {
  const [items, setItems] = useState<HotspotItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("ict-block");

  // Fetch live lost and found reports from database
  useEffect(() => {
    let isMounted = true;

    const loadItems = async (silent = false) => {
      if (!silent) setIsLoading(true);
      try {
        const [foundRes, lostRes] = await Promise.allSettled([
          api.get<FoundItem[]>("/found-items"),
          api.get<LostItem[]>("/lost-items"),
        ]);

        if (!isMounted) return;
        const combined: HotspotItem[] = [];

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
      } catch (err) {
        console.error("Failed to load items for hotspots:", err);
      } finally {
        if (isMounted && !silent) {
          setIsLoading(false);
        }
      }
    };

    loadItems();
    const interval = setInterval(() => {
      loadItems(true);
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Helper to match items to a building
  const getItemsForBuilding = (building: CampusBuildingConfig): HotspotItem[] => {
    return items.filter((item) => {
      const loc = (item.locationName || "").toLowerCase();
      return (
        loc.includes(building.name.toLowerCase()) ||
        building.keywords.some((kw) => loc.includes(kw.toLowerCase()))
      );
    });
  };

  const selectedBuilding =
    BUILDINGS_CONFIG.find((b) => b.id === selectedBuildingId) || BUILDINGS_CONFIG[0];
  const selectedItems = getItemsForBuilding(selectedBuilding);
  const selectedFoundCount = selectedItems.filter((i) => i.type === "found").length;
  const selectedLostCount = selectedItems.filter((i) => i.type === "lost").length;

  return (
    <section id="hotspots" className="my-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-findback-accent mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus Activity & Zones</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-findback-text">
            Campus Activity Hotspots
          </h2>
          <p className="text-sm text-findback-muted mt-1">
            Live campus topology showing all reported lost belongings and items safeguarded in custody across campus buildings.
          </p>
        </div>

        {isCensored ? (
          <button
            type="button"
            onClick={onRequireAuth}
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1 text-xs font-semibold text-findback-primary hover:text-findback-primary-hover group"
          >
            <span>View complete registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            href="/browse"
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1 text-xs font-semibold text-findback-primary hover:text-findback-primary-hover group"
          >
            <span>View complete registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Buildings Grid */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {BUILDINGS_CONFIG.map((building) => {
            const Icon = building.icon;
            const isSelected = selectedBuilding.id === building.id;
            const buildingItems = getItemsForBuilding(building);
            const totalCount = buildingItems.length;
            const foundCount = buildingItems.filter((i) => i.type === "found").length;
            const lostCount = buildingItems.filter((i) => i.type === "lost").length;

            return (
              <button
                key={building.id}
                type="button"
                onClick={() => {
                  if (isCensored && onRequireAuth) {
                    onRequireAuth();
                    return;
                  }
                  setSelectedBuildingId(building.id);
                }}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-findback-primary shadow-card ring-1 ring-findback-primary"
                    : "bg-white/80 border-findback-border hover:bg-white hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-findback-primary text-white"
                            : "bg-findback-sand text-findback-primary"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-findback-text leading-tight">
                          {building.name}
                        </h4>
                        <p className={`text-[11px] text-findback-muted leading-tight mt-0.5 ${
                          isCensored ? "filter blur-[4px] select-none" : ""
                        }`}>
                          {building.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                        totalCount > 0
                          ? "bg-findback-sand text-findback-primary"
                          : "bg-gray-100 text-gray-500"
                      } ${isCensored ? "filter blur-[4px] select-none" : ""}`}
                    >
                      {totalCount}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-findback-border/50 text-[11px] flex items-center justify-between text-findback-muted">
                  <div className="flex items-center space-x-1.5">
                    {totalCount > 0 ? (
                      <>
                        {foundCount > 0 && (
                          <span className={`text-amber-800 font-semibold ${isCensored ? "filter blur-[4px] select-none" : ""}`}>
                            {foundCount} found
                          </span>
                        )}
                        {foundCount > 0 && lostCount > 0 && <span>•</span>}
                        {lostCount > 0 && (
                          <span className={`text-orange-800 font-semibold ${isCensored ? "filter blur-[4px] select-none" : ""}`}>
                            {lostCount} lost
                          </span>
                        )}
                      </>
                    ) : (
                      <span className={isCensored ? "filter blur-[4px] select-none" : ""}>
                        {isCensored ? "3 items registered" : "No active reports"}
                      </span>
                    )}
                  </div>

                  <span className="text-findback-accent font-medium ml-2 shrink-0">
                    View zone →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Zone Deep Dive Panel */}
        <div className="md:col-span-5 bg-white rounded-xl border border-findback-border p-5 shadow-card flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-findback-muted uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-findback-accent" />
                <span>Zone Activity Details</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-findback-sand text-findback-primary ${
                isCensored ? "filter blur-[4px] select-none" : ""
              }`}>
                {isCensored ? "4 active in zone" : `${selectedItems.length} active in zone`}
              </span>
            </div>

            <h3 className="text-lg font-bold text-findback-text mb-0.5">
              {selectedBuilding.name}
            </h3>
            <p className={`text-xs text-findback-muted mb-3 ${
              isCensored ? "filter blur-[4px] select-none" : ""
            }`}>
              {selectedBuilding.floorDetails}
            </p>

            {/* Quick Status Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5">
                <span className="text-[10px] uppercase font-bold text-amber-900 block mb-0.5">
                  Found in Custody
                </span>
                <span className={`text-base font-bold text-amber-950 ${
                  isCensored ? "filter blur-[5px] select-none" : ""
                }`}>
                  {isCensored ? "2 items" : `${selectedFoundCount} items`}
                </span>
              </div>
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-lg p-2.5">
                <span className="text-[10px] uppercase font-bold text-orange-900 block mb-0.5">
                  Reported Lost
                </span>
                <span className={`text-base font-bold text-orange-950 ${
                  isCensored ? "filter blur-[5px] select-none" : ""
                }`}>
                  {isCensored ? "2 items" : `${selectedLostCount} items`}
                </span>
              </div>
            </div>

            {/* Live Items List in this Zone */}
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-findback-muted block mb-2">
                Active Items in {selectedBuilding.name}
              </span>

              {isLoading ? (
                <div className="py-6 text-center text-xs text-findback-muted">
                  <div className="w-5 h-5 border-2 border-findback-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span>Checking campus registry...</span>
                </div>
              ) : selectedItems.length === 0 ? (
                isCensored ? (
                  /* Sample items for censored guest view */
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {[
                      { id: "sample-1", title: "Wireless Earbuds Case", loc: `${selectedBuilding.name} Floor 2`, date: "2026-10-24", type: "found" as const, cat: "Electronics" as ItemCategory },
                      { id: "sample-2", title: "Scientific Calculator", loc: `${selectedBuilding.name} Floor 3`, date: "2026-10-24", type: "lost" as const, cat: "Electronics" as ItemCategory },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={onRequireAuth}
                        className="w-full text-left p-2.5 rounded-lg border border-findback-border/70 hover:border-findback-primary bg-findback-bg/40 hover:bg-white transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="text-base shrink-0">
                            {getCategoryEmoji(item.cat)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-findback-text truncate group-hover:text-findback-primary transition-colors filter blur-[5px] select-none">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-findback-muted truncate filter blur-[4px] select-none">
                              {item.loc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right ml-2">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              item.type === "found"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-orange-50 text-orange-800 border-orange-200"
                            }`}
                          >
                            {item.type === "found" ? "In Custody" : "Lost"}
                          </span>
                          <span className="block text-[9px] text-findback-muted mt-0.5 filter blur-[4px] select-none">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-findback-border bg-findback-bg/30 text-center">
                    <Inbox className="w-5 h-5 text-findback-muted mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-findback-text">
                      All clear in {selectedBuilding.name}
                    </p>
                    <p className="text-[11px] text-findback-muted mt-0.5">
                      No items currently reported missing or held in custody lockers here.
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {selectedItems.map((item) =>
                    isCensored ? (
                      <button
                        key={item.id}
                        type="button"
                        onClick={onRequireAuth}
                        className="w-full text-left p-2.5 rounded-lg border border-findback-border/70 hover:border-findback-primary bg-findback-bg/40 hover:bg-white transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="text-base shrink-0">
                            {getCategoryEmoji(item.category)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-findback-text truncate group-hover:text-findback-primary transition-colors filter blur-[5px] select-none">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-findback-muted truncate filter blur-[4px] select-none">
                              {item.locationName}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right ml-2">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              item.type === "found"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-orange-50 text-orange-800 border-orange-200"
                            }`}
                          >
                            {item.type === "found" ? "In Custody" : "Lost"}
                          </span>
                          <span className="block text-[9px] text-findback-muted mt-0.5 filter blur-[4px] select-none">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </button>
                    ) : (
                      <Link
                        key={item.id}
                        href={`/browse?location=${encodeURIComponent(selectedBuilding.name)}`}
                        className="p-2.5 rounded-lg border border-findback-border/70 hover:border-findback-primary bg-findback-bg/40 hover:bg-white transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="text-base shrink-0">
                            {getCategoryEmoji(item.category)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-findback-text truncate group-hover:text-findback-primary transition-colors">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-findback-muted truncate">
                              {item.locationName}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right ml-2">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              item.type === "found"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-orange-50 text-orange-800 border-orange-200"
                            }`}
                          >
                            {item.type === "found" ? "In Custody" : "Lost"}
                          </span>
                          <span className="block text-[9px] text-findback-muted mt-0.5">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-findback-border flex items-center space-x-2">
            {isCensored ? (
              <>
                <button
                  type="button"
                  onClick={onRequireAuth}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all group"
                >
                  <span>Explore {selectedBuilding.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onRequireAuth}
                  className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold border border-findback-border bg-white text-findback-text hover:bg-findback-bg transition-colors"
                >
                  <span>+ Lost</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/browse?location=${encodeURIComponent(selectedBuilding.name)}`}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all group"
                >
                  <span>Explore {selectedBuilding.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/report-lost"
                  className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold border border-findback-border bg-white text-findback-text hover:bg-findback-bg transition-colors"
                >
                  <span>+ Lost</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
