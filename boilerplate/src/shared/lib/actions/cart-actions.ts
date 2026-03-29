"use server";

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import {
    getCartItems,
    getCartItemCount,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    mergeCartItems,
    getCartItemsForCheckout,
} from "@/shared/lib/data/cart";
import {
    addToCartSchema,
    updateCartQuantitySchema,
    removeFromCartSchema,
    mergeCartSchema,
} from "@/shared/lib/validations/cart";
import type { ActionState } from "./types";

// ── READS ──

/** Get cart items with product details for display */
export async function fetchCart() {
    const user = await getCurrentUser();
    if (!user) return { items: [], count: 0, subtotal: 0 };

    const items = await getCartItems(user.id);

    const mappedItems = items.map((item) => ({
        id: item.id,
        plantId: item.productId,
        quantity: item.quantity,
        plant: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            stock: item.product.stock,
            images: item.product.images.map((img) => ({ src: img.url })),
        },
    }));

    const count = mappedItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = mappedItems.reduce(
        (sum, i) => sum + i.plant.price * i.quantity,
        0
    );

    return { items: mappedItems, count, subtotal };
}

/** Get item count only (for badge) */
export async function fetchCartCount(): Promise<number> {
    const user = await getCurrentUser();
    if (!user) return 0;
    return getCartItemCount(user.id);
}

// ── MUTATIONS ──

/** Add or increment item in cart */
export async function addToCart(
    plantId: string,
    quantity: number = 1
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user)
        return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = addToCartSchema.safeParse({ productId: plantId, quantity });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const result = await addCartItem(user.id, parsed.data.productId, parsed.data.quantity);
    if (!result) return { success: false, error: "Produk tidak ditemukan" };

    revalidateTag("cart");
    return { success: true };
}

/** Update quantity of existing cart item */
export async function updateCartQuantity(
    itemId: string,
    quantity: number
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user)
        return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = updateCartQuantitySchema.safeParse({ itemId, quantity });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await updateCartItemQuantity(user.id, parsed.data.itemId, parsed.data.quantity);
    revalidateTag("cart");
    return { success: true };
}

/** Remove item from cart */
export async function removeFromCart(itemId: string): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user)
        return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = removeFromCartSchema.safeParse({ itemId });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await removeCartItem(user.id, parsed.data.itemId);
    revalidateTag("cart");
    return { success: true };
}

/** Clear entire cart */
export async function clearCartAction(): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user)
        return { success: false, error: "Anda harus login terlebih dahulu" };

    await clearCart(user.id);
    revalidateTag("cart");
    return { success: true };
}

/** Merge localStorage cart into DB cart (called on login) */
export async function mergeLocalCartToDb(
    items: Array<{ productId: string; quantity: number }>
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const parsed = mergeCartSchema.safeParse(items);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await mergeCartItems(user.id, parsed.data);
    revalidateTag("cart");
    return { success: true };
}

/**
 * Get verified cart items for checkout — SERVER-SIDE TRUTH.
 * Prices come from DB, not from client localStorage.
 */
export async function getCheckoutCart() {
    const user = await getCurrentUser();
    if (!user) return null;

    const items = await getCartItemsForCheckout(user.id);

    // Filter out inactive products or zero-stock items
    const validItems = items.filter(
        (item) => item.product.isActive && item.product.stock > 0
    );

    const mappedItems = validItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: Math.min(item.quantity, item.product.stock), // Cap at stock
        unitPrice: Number(item.product.price),
        image: item.product.images[0]?.url || null,
    }));

    const subtotal = mappedItems.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0
    );

    return { items: mappedItems, subtotal };
}
