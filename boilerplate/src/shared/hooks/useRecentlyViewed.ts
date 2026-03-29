"use client";

// Recently viewed plants — localStorage-backed

const STORAGE_KEY = "bmj-recently-viewed";
const MAX_ITEMS = 12;

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  viewedAt: number;
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: Omit<RecentlyViewedItem, "viewedAt">) {
  const items = getRecentlyViewed().filter((i) => i.id !== item.id);
  items.unshift({ ...item, viewedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function clearRecentlyViewed() {
  localStorage.removeItem(STORAGE_KEY);
}
