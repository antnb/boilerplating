"use client";

import { useCallback, useState, useEffect, useRef, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import {
    addToWishlist,
    removeFromWishlist,
} from "@/shared/lib/actions/wishlist-actions";

// ══════════════════════════════════════════════════════════════
// GUEST MODE — localStorage (unchanged from original)
// ══════════════════════════════════════════════════════════════

const STORAGE_KEY = "bmj-wishlist";

function readStorage(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function writeStorage(items: string[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("wishlist-change"));
}

let snapshot: string[] = typeof window !== "undefined" ? readStorage() : [];
const SERVER_SNAPSHOT: string[] = [];
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
    listeners.add(cb);
    const onWishlistChange = () => { snapshot = readStorage(); cb(); };
    const onStorageEvent = (e: StorageEvent) => { if (e.key === STORAGE_KEY) onWishlistChange(); };
    if (typeof window !== "undefined") {
        window.addEventListener("wishlist-change", onWishlistChange);
        window.addEventListener("storage", onStorageEvent);
    }
    return () => {
        listeners.delete(cb);
        if (typeof window !== "undefined") {
            window.removeEventListener("wishlist-change", onWishlistChange);
            window.removeEventListener("storage", onStorageEvent);
        }
    };
}

function getServerSnapshot() { return SERVER_SNAPSHOT; }
function getSnapshot() { return snapshot; }

function updateGuestStore(items: string[]) {
    snapshot = items;
    writeStorage(items);
    listeners.forEach((cb) => cb());
}

// ══════════════════════════════════════════════════════════════
// HOOK — Hybrid (guest: localStorage, logged-in: DB)
// ══════════════════════════════════════════════════════════════

export function useWishlist() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated" && !!session?.user;

    // Guest state
    const guestItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Authenticated state — store as productId array (same shape as guest)
    const [dbItems, setDbItems] = useState<string[]>([]);
    const hasFetched = useRef(false);

    // Fetch DB wishlist when authenticated
    useEffect(() => {
        if (isAuthenticated && !hasFetched.current) {
            hasFetched.current = true;
            // We don't need to fetch full wishlist here — just the IDs
            // WishlistSection fetches full data via getWishlist() server action directly
            // This hook only tracks IDs for the heart icon toggle
            import("@/shared/lib/actions/wishlist-actions").then(({ getWishlist }) => {
                getWishlist().then((items) => {
                    setDbItems(items.map((i: { plantId: string }) => i.plantId));
                });
            });
        }
        if (!isAuthenticated) {
            hasFetched.current = false;
            setDbItems([]);
        }
    }, [isAuthenticated]);

    const items = isAuthenticated ? dbItems : guestItems;

    const isWishlisted = useCallback(
        (plantId: string) => items.includes(plantId),
        [items]
    );

    const toggleWishlist = useCallback(async (plantId: string) => {
        if (isAuthenticated) {
            const current = dbItems.includes(plantId);
            // Optimistic update
            if (current) {
                setDbItems((prev) => prev.filter((id) => id !== plantId));
                await removeFromWishlist(plantId);
            } else {
                setDbItems((prev) => [...prev, plantId]);
                await addToWishlist(plantId);
            }
        } else {
            const current = getSnapshot();
            if (current.includes(plantId)) {
                updateGuestStore(current.filter((id) => id !== plantId));
            } else {
                updateGuestStore([...current, plantId]);
            }
        }
    }, [isAuthenticated, dbItems]);

    const removeFromWishlistHook = useCallback(async (plantId: string) => {
        if (isAuthenticated) {
            setDbItems((prev) => prev.filter((id) => id !== plantId));
            await removeFromWishlist(plantId);
        } else {
            updateGuestStore(getSnapshot().filter((id) => id !== plantId));
        }
    }, [isAuthenticated]);

    const clearWishlist = useCallback(async () => {
        if (isAuthenticated) {
            setDbItems([]);
            const { clearWishlistAction } = await import("@/shared/lib/actions/wishlist-actions");
            await clearWishlistAction();
        } else {
            updateGuestStore([]);
        }
    }, [isAuthenticated]);

    return {
        items,
        count: items.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist: removeFromWishlistHook,
        clearWishlist,
    };
}
