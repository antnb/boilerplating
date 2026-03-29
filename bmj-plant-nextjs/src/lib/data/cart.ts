import 'server-only';
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ══════════════════════════════════════
// Cart Data Access Layer
// ══════════════════════════════════════
// Rule #2:  All Prisma calls live here.
// Rule #3:  Every query uses explicit `select`.
// Rule #13: Handle P2002 (unique constraint) for upsert-like behavior.
// Rule #14: `findUnique` for userId+productId composite key.

// ── READS ──

/** Get all cart items for a user, with product details for display */
export async function getCartItems(userId: string) {
    return prisma.cartItem.findMany({
        where: { userId },
        select: {
            id: true,
            quantity: true,
            createdAt: true,
            productId: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    stock: true,
                    isActive: true,
                    images: {
                        select: { url: true, alt: true },
                        orderBy: { sortOrder: "asc" },
                        take: 1,
                    },
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

/** Get cart item count for badge display */
export async function getCartItemCount(userId: string): Promise<number> {
    const result = await prisma.cartItem.aggregate({
        where: { userId },
        _sum: { quantity: true },
    });
    return result._sum.quantity ?? 0;
}

// ── WRITES ──

/** Add item to cart or increment quantity if already exists */
export async function addCartItem(
    userId: string,
    productId: string,
    quantity: number = 1
) {
    try {
        // Upsert: if item exists, increment quantity; otherwise create
        return await prisma.cartItem.upsert({
            where: {
                userId_productId: { userId, productId },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                userId,
                productId,
                quantity,
            },
            select: { id: true, quantity: true, productId: true },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
        ) {
            // Foreign key constraint — product doesn't exist
            return null;
        }
        throw error;
    }
}

/** Set exact quantity for a cart item */
export async function updateCartItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
) {
    return prisma.cartItem.updateMany({
        where: { id: itemId, userId }, // userId ensures ownership
        data: { quantity },
    });
}

/** Remove a single item from cart */
export async function removeCartItem(userId: string, itemId: string) {
    return prisma.cartItem.deleteMany({
        where: { id: itemId, userId }, // userId ensures ownership
    });
}

/** Clear all items from user's cart */
export async function clearCart(userId: string) {
    return prisma.cartItem.deleteMany({
        where: { userId },
    });
}

/**
 * Merge localStorage cart items into DB cart (used on login).
 * Uses transaction for atomicity. Existing items get quantity incremented.
 */
export async function mergeCartItems(
    userId: string,
    items: Array<{ productId: string; quantity: number }>
) {
    if (items.length === 0) return;

    await prisma.$transaction(async (tx) => {
        for (const item of items) {
            await tx.cartItem.upsert({
                where: {
                    userId_productId: { userId, productId: item.productId },
                },
                update: {
                    quantity: { increment: item.quantity },
                },
                create: {
                    userId,
                    productId: item.productId,
                    quantity: item.quantity,
                },
            });
        }
    });
}

/**
 * Get cart items for order creation — includes verified prices from DB.
 * This is the SERVER-SIDE TRUTH for checkout. Never trust client prices.
 */
export async function getCartItemsForCheckout(userId: string) {
    return prisma.cartItem.findMany({
        where: { userId },
        select: {
            id: true,
            quantity: true,
            productId: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    sku: true,
                    price: true,
                    stock: true,
                    isActive: true,
                    images: {
                        select: { url: true },
                        orderBy: { sortOrder: "asc" },
                        take: 1,
                    },
                },
            },
        },
    });
}
