"use client";

import { useState, useCallback, useEffect } from "react";
import { searchProductsAction } from "@/shared/lib/actions/search-actions";

const RECENT_KEY = "bmj-recent-searches";
const MAX_RECENT = 5;

// Read/write recent searches from localStorage
function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeRecent(items: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
}

export interface SearchSuggestion {
  type: "product" | "category" | "recent";
  label: string;
  slug?: string;
  price?: string;
  image?: string;
}

const CATEGORIES = [
  { label: "Monstera", query: "monstera" },
  { label: "Philodendron", query: "philodendron" },
  { label: "Alocasia", query: "alocasia" },
  { label: "Anthurium", query: "anthurium" },
  { label: "Syngonium", query: "syngonium" },
  { label: "Calathea", query: "calathea" },
];

export function useSearchSuggestions() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(readRecent);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  // Debounced search via server action
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results: SearchSuggestion[] = [];

      try {
        // Fetch product matches from server
        const matchedProducts = await searchProductsAction(q);
        matchedProducts.forEach((p) => {
          results.push({
            type: "product",
            label: p.name,
            slug: p.slug,
            price: `Rp ${new Intl.NumberFormat("id-ID").format(p.price)}`,
            image: p.image || undefined,
          });
        });
      } catch {
        // Silently fail — show category matches only
      }

      // Match categories (local, no server call needed)
      const matchedCats = CATEGORIES.filter((c) =>
        c.label.toLowerCase().includes(q)
      ).slice(0, 2);

      matchedCats.forEach((c) => {
        results.push({ type: "category", label: c.label });
      });

      setSuggestions(results);
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const addRecentSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, MAX_RECENT);
      writeRecent(next);
      return next;
    });
  }, []);

  const removeRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== term);
      writeRecent(next);
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    writeRecent([]);
  }, []);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, onSelect: (value: string, slug?: string) => void) => {
      const total = suggestions.length;
      if (!total) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % total);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + total) % total);
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const s = suggestions[activeIndex];
        onSelect(s.label, s.slug);
      }
    },
    [suggestions, activeIndex]
  );

  return {
    query,
    setQuery,
    suggestions,
    recentSearches,
    activeIndex,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    handleKeyDown,
  };
}
