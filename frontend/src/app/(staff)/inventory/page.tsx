"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Package, MapPin, Archive, Plus, Inbox, RefreshCw } from "lucide-react";
import { FoundItem } from "@/types";
import { api } from "@/lib/api";

export default function StaffInventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<FoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInventory = useCallback(async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const data = await api.get<FoundItem[]>("/found-items");
      if (Array.isArray(data)) {
        setInventoryItems(data);
      }
    } catch {
      setInventoryItems([]);
    } finally {
      setIsLoading(false);
      if (showSpin) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(() => {
      fetchInventory(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchInventory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-findback-accent block">
              Custody Vault
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Auto-Sync Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-findback-text">
            Storage Locker Inventory
          </h1>
          <p className="text-xs sm:text-sm text-findback-muted mt-1">
            Track and locate all items currently safeguarded in campus custody bins.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchInventory(true)}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-findback-border bg-white text-xs font-semibold text-findback-muted hover:text-findback-text hover:bg-findback-bg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-findback-primary" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/report-found"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Found Item</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-findback-border p-8 shadow-card">
          <div className="w-8 h-8 border-2 border-findback-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-findback-muted">Synchronizing custody inventory...</p>
        </div>
      ) : inventoryItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-findback-border p-12 text-center shadow-card max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-findback-sand flex items-center justify-center text-findback-primary mx-auto mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-findback-text mb-1">
            No items currently in custody
          </h3>
          <p className="text-xs text-findback-muted leading-relaxed mb-6">
            Locker storage bins and custody shelves are currently clear. When an item is turned into the desk, register it here.
          </p>
          <Link
            href="/report-found"
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-findback-primary text-white hover:bg-findback-primary-hover shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Found Item</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inventoryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-findback-border p-5 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {item.storage_locker_bin || "Custody Bin"}
                  </span>
                  <span className="text-[11px] text-findback-muted font-medium">
                    {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-findback-text mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-findback-muted mb-3 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-findback-primary shrink-0" />
                  <span>Found at {item.location_name || "Campus Desk"}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-findback-border flex items-center justify-between text-xs">
                <span className="text-findback-muted">Status: In Custody</span>
                <Link
                  href={`/verify?item=${item.id}`}
                  className="font-semibold text-findback-primary hover:underline"
                >
                  Review Claims →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
