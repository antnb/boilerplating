import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

// ══════════════════════════════════════
// Wishlist Data Access Layer
// ══════════════════════════════════════

// ── READS ──

/** Get all wishlist items for a user, with product details */
export async function getWishlistItems(userId: string) {
    return prisma.wishlistItem.findMany({
        where: { userId },
        select: {
            id: true,
            createdAt: true,
            productId: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    scientificName: true,
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
        orderBy: { createdAt: "desc" },
    });
}

/** Get wishlist item count for badge display */
export async function getWishlistItemCount(userId: string): Promise<number> {
    return prisma.wishlistItem.count({
        where: { userId },
    });
}

/** Check if a specific product is in user's wishlist */
export async function isProductWishlisted(
    userId: string,
    productId: string
): Promise<boolean> {
    const item = await prisma.wishlistItem.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
        select: { id: true },
    });
    return item !== null;
}

// ── WRITES ──

/** Add product to wishlist (idempotent — ignores if already exists) */
export async function addWishlistItem(userId: string, productId: string) {
    try {
        return await prisma.wishlistItem.create({
            data: { userId, productId },
            select: { id: true, productId: true },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            // Already in wishlist — return existing silently
            return prisma.wishlistItem.findUnique({
                where: { userId_productId: { userId, productId } },
                select: { id: true, productId: true },
            });
        }
        throw error;
    }
}

/** Remove product from wishlist */
export async function removeWishlistItem(userId: string, productId: string) {
    return prisma.wishlistItem.deleteMany({
        where: { userId, productId },
    });
}

/** Clear entire wishlist */
export async function clearWishlist(userId: string) {
    return prisma.wishlistItem.deleteMany({
        where: { userId },
    });
}

/**
 * Merge localStorage wishlist into DB (used on login).
 * Silently skips items that already exist (P2002).
 */
export async function mergeWishlistItems(
    userId: string,
    productIds: string[]
) {
    if (productIds.length === 0) return;

    await prisma.$transaction(async (tx) => {
        for (const productId of productIds) {
            try {
                await tx.wishlistItem.create({
                    data: { userId, productId },
                });
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    continue; // Already exists — skip
                }
                throw error;
            }
        }
    });
}
