"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface CategoryData {
  name: string;
  count: number;
  found_count?: number;
  lost_count?: number;
}

export const BASE_CATEGORIES: string[] = [
  "Electronics",
  "IDs & Cards",
  "Keys",
  "Bags & Wallets",
  "Accessories",
  "Books & Notes",
  "Clothing",
  "Other",
];

export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>(
    BASE_CATEGORIES.map((c) => ({ name: c, count: 0, found_count: 0, lost_count: 0 }))
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<CategoryData[]>("/categories");
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    } catch (err) {
      console.warn("Could not load dynamic categories from API:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    // Auto-sync categories every 10 seconds
    const interval = setInterval(() => {
      fetchCategories();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchCategories]);

  const categoryNames = categories.map((c) => c.name);

  return {
    categories,
    categoryNames,
    isLoading,
    refreshCategories: fetchCategories,
  };
}
