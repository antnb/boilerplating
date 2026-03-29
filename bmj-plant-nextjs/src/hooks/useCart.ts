"use client";

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { resolveProductAction } from "@/lib/actions/product-actions";
import {
    fetchCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCartAction,
} from "@/lib/actions/cart-actions";

// ── Types ──

interface CartPlant {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images: { src: string }[];
}

interface CartItemWithPlant {
    id: string;
    plantId: string;
    quantity: number;
    plant: CartPlant;
}

// ══════════════════════════════════════════════════════════════
// GUEST MODE — localStorage (unchanged from original)
// ══════════════════════════════════════════════════════════════

const STORAGE_KEY = "bmj-cart";

function readStorage(): CartItemWithPlant[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeStorage(items: CartItemWithPlant[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-change"));
}

// External store for cross-component sync (guest only)
let snapshot: CartItemWithPlant[] =
    typeof window !== "undefined" ? readStorage() : [];
const SERVER_SNAPSHOT: CartItemWithPlant[] = [];
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
    listeners.add(cb);
    const onCartChange = () => { snapshot = readStorage(); cb(); };
    const onStorageEvent = (e: StorageEvent) => { if (e.key === STORAGE_KEY) onCartChange(); };
    if (typeof window !== "undefined") {
        window.addEventListener("cart-change", onCartChange);
        window.addEventListener("storage", onStorageEvent);
    }
    return () => {
        listeners.delete(cb);
        if (typeof window !== "undefined") {
            window.removeEventListener("cart-change", onCartChange);
            window.removeEventListener("storage", onStorageEvent);
        }
    };
}

function getServerSnapshot() { return SERVER_SNAPSHOT; }
function getSnapshot() { return snapshot; }

function updateGuestStore(items: CartItemWithPlant[]) {
    snapshot = items;
    writeStorage(items);
    listeners.forEach((cb) => cb());
}

async function resolvePlantFromDB(plantId: string): Promise<CartPlant> {
    try {
        const resolved = await resolveProductAction(plantId);
        if (resolved) {
            return {
                id: resolved.id, name: resolved.name, slug: resolved.slug,
                price: resolved.price, stock: resolved.stock,
                images: resolved.images.map((img) => ({ src: img.src })),
            };
        }
    } catch { /* fallback below */ }
    return {
        id: plantId, name: "Unknown Plant", slug: "unknown-plant",
        price: 0, stock: 0,
        images: [{ src: "https://placehold.co/400x400/1C2D22/e1ebd8?text=Plant" }],
    };
}

// ══════════════════════════════════════════════════════════════
// HOOK — Hybrid (guest: localStorage, logged-in: DB)
// ══════════════════════════════════════════════════════════════

export function useCart() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated" && !!session?.user;
    const isSessionLoading = status === "loading";

    // Guest state via useSyncExternalStore
    const guestItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Authenticated state
    const [dbItems, setDbItems] = useState<CartItemWithPlant[]>([]);
    const [dbLoading, setDbLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const hasFetched = useRef(false);

    // Fetch DB cart when authenticated
    useEffect(() => {
        if (isAuthenticated && !hasFetched.current) {
            hasFetched.current = true;
            setDbLoading(true);
            fetchCart()
                .then((result) => {
                    setDbItems(result.items as CartItemWithPlant[]);
                })
                .finally(() => setDbLoading(false));
        }
        if (!isAuthenticated) {
            hasFetched.current = false;
            setDbItems([]);
            setDbLoading(false);
        }
    }, [isAuthenticated]);

    // Choose source based on auth state
    const items = isAuthenticated ? dbItems : guestItems;
    const isLoading = isSessionLoading || (isAuthenticated && dbLoading);

    // Refresh from server
    const refreshDbCart = useCallback(async () => {
        if (!isAuthenticated) return;
        const result = await fetchCart();
        setDbItems(result.items as CartItemWithPlant[]);
    }, [isAuthenticated]);

    // ── ADD ──
    const addItem = useCallback(async (plantId: string, quantity = 1) => {
        setIsUpdating(true);
        try {
            if (isAuthenticated) {
                await addToCart(plantId, quantity);
                await refreshDbCart();
            } else {
                // Guest: localStorage
                const current = getSnapshot();
                const existing = current.find((i) => i.plantId === plantId);
                if (existing) {
                    updateGuestStore(
                        current.map((i) =>
                            i.plantId === plantId ? { ...i, quantity: i.quantity + quantity } : i
                        )
                    );
                } else {
                    const plant = await resolvePlantFromDB(plantId);
                    updateGuestStore([
                        ...current,
                        {
                            id: crypto.randomUUID?.() || Math.random().toString(36),
                            plantId, quantity, plant,
                        },
                    ]);
                }
            }
        } finally {
            setTimeout(() => setIsUpdating(false), 150);
        }
    }, [isAuthenticated, refreshDbCart]);

    // ── UPDATE QUANTITY ──
    const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
        setIsUpdating(true);
        try {
            if (isAuthenticated) {
                if (quantity <= 0) {
                    await removeFromCart(itemId);
                } else {
                    await updateCartQuantity(itemId, quantity);
                }
                await refreshDbCart();
            } else {
                const current = getSnapshot();
                if (quantity <= 0) {
                    updateGuestStore(current.filter((i) => i.id !== itemId));
                } else {
                    updateGuestStore(current.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
                }
            }
        } finally {
            setTimeout(() => setIsUpdating(false), 150);
        }
    }, [isAuthenticated, refreshDbCart]);

    // ── REMOVE ──
    const removeItem = useCallback(async (itemId: string) => {
        setIsUpdating(true);
        try {
            if (isAuthenticated) {
                await removeFromCart(itemId);
                await refreshDbCart();
            } else {
                updateGuestStore(getSnapshot().filter((i) => i.id !== itemId));
            }
        } finally {
            setTimeout(() => setIsUpdating(false), 150);
        }
    }, [isAuthenticated, refreshDbCart]);

    // ── CLEAR ──
    const clearCart = useCallback(async () => {
        setIsUpdating(true);
        try {
            if (isAuthenticated) {
                await clearCartAction();
                setDbItems([]);
            } else {
                updateGuestStore([]);
            }
        } finally {
            setTimeout(() => setIsUpdating(false), 150);
        }
    }, [isAuthenticated]);

    // ── REFRESH ──
    const refresh = useCallback(async () => {
        if (isAuthenticated) {
            await refreshDbCart();
        } else {
            snapshot = readStorage();
            listeners.forEach((cb) => cb());
        }
    }, [isAuthenticated, refreshDbCart]);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + (i.plant?.price || 0) * i.quantity, 0);

    return {
        items,
        isLoading,
        isUpdating,
        isRemoving: isUpdating,
        itemCount,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refresh,
    };
}
