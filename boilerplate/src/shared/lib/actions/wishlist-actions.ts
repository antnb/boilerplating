"use server";

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import {
    getWishlistItems,
    getWishlistItemCount,
    isProductWishlisted,
    addWishlistItem,
    removeWishlistItem,
    clearWishlist,
    mergeWishlistItems,
} from "@/shared/lib/data/wishlist";
import { wishlistItemSchema, mergeWishlistSchema } from "@/shared/lib/validations/wishlist";
import type { ActionState } from "./types";

// ── READS ──

/** Get wishlist items with product details */
export async function getWishlist() {
    const user = await getCurrentUser();
    if (!user) return [];

    const items = await getWishlistItems(user.id);

    return items.map((item) => ({
        id: item.id,
        plantId: item.productId,
        plant: {
            id: item.product.id,
            slug: item.product.slug,
            name: item.product.name,
            scientificName: item.product.scientificName,
            price: Number(item.product.price),
            stock: item.product.stock,
            stockStatus: item.product.stock > 0 ? "in_stock" : "out_of_stock",
            images: item.product.images.map((img) => ({ src: img.url })),
            plantType: null, // Not available in current schema
        },
    }));
}

/** Get wishlist count for badge */
export async function fetchWishlistCount(): Promise<number> {
    const user = await getCurrentUser();
    if (!user) return 0;
    return getWishlistItemCount(user.id);
}

/** Check if specific product is wishlisted */
export async function checkIsWishlisted(productId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;
    return isProductWishlisted(user.id, productId);
}

// ── MUTATIONS ──

/** Add product to wishlist */
export async function addToWishlist(plantId: string): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user)
        return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = wishlistItemSchema.safeParse({ productId: plantId });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await addWishlistItem(user.id, parsed.data.productId);
    revalidateTag("wishlist");
    return { success: true };
}

/** Remove product from wishlist */
export async function removeFromWishlist(
    plantId: string
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user)
        return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = wishlistItemSchema.safeParse({ productId: plantId });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await removeWishlistItem(user.id, parsed.data.productId);
    revalidateTag("wishlist");
    return { success: true };
}

/** Toggle wishlist (add if not present, remove if present) */
export async function toggleWishlistAction(
    plantId: string
): Promise<ActionState & { wishlisted: boolean }> {
    const user = await getCurrentUser();
    if (!user)
        return {
            success: false,
            error: "Anda harus login terlebih dahulu",
            wishlisted: false,
        };

    const parsed = wishlistItemSchema.safeParse({ productId: plantId });
    if (!parsed.success)
        return {
            success: false,
            error: parsed.error.issues[0].message,
            wishlisted: false,
        };

    const validId = parsed.data.productId;
    const isCurrently = await isProductWishlisted(user.id, validId);

    if (isCurrently) {
        await removeWishlistItem(user.id, validId);
        revalidateTag("wishlist");
        return { success: true, wishlisted: false };
    } else {
        await addWishlistItem(user.id, validId);
        revalidateTag("wishlist");
        return { success: true, wishlisted: true };
    }
}

/** Clear entire wishlist */
export async function clearWishlistAction(): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user)
        return { success: false, error: "Anda harus login terlebih dahulu" };

    await clearWishlist(user.id);
    revalidateTag("wishlist");
    return { success: true };
}

/** Merge localStorage wishlist into DB (called on login) */
export async function mergeLocalWishlistToDb(
    productIds: string[]
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const parsed = mergeWishlistSchema.safeParse(productIds);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await mergeWishlistItems(user.id, parsed.data);
    revalidateTag("wishlist");
    return { success: true };
}
