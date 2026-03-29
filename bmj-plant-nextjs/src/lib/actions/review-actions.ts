"use server";

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getReviewsByProduct, getAverageRating as getAvgRating, createReviewInDb } from "@/lib/data/reviews";
import { hasUserPurchasedProduct } from "@/lib/data/orders";
import { submitReviewSchema } from "@/lib/validations/review";
import type { ActionState } from "./types";

// ── READS ──

export async function getReviewsByPlantId(plantId: string) {
    if (!plantId) return [];

    const reviews = await getReviewsByProduct(plantId);
    return reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        photos: (r.photos as string[] | null) ?? [],
        isVerified: r.isVerified,
        customerName: r.user?.name || "Anonim",
        createdAt: r.createdAt.toISOString(),
    }));
}

export async function getAverageRating(plantId: string) {
    if (!plantId) return { average: 0, count: 0 };
    return getAvgRating(plantId);
}

/** Check if current user has purchased this product — used by PDP server component */
export async function checkPurchaseStatus(productId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;
    return hasUserPurchasedProduct(user.id, productId);
}

// ── MUTATIONS ──

export async function submitReview(
    plantId: string,
    data: { rating: number; title: string; comment: string; photos?: string[] }
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };

    // ── Purchase verification gate (defense-in-depth layer 2) ──
    const hasPurchased = await hasUserPurchasedProduct(user.id, plantId);
    if (!hasPurchased) {
        return { success: false, error: "Hanya pelanggan yang sudah membeli dan menerima produk ini yang dapat memberikan ulasan" };
    }

    const parsed = submitReviewSchema.safeParse({
        productId: plantId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        photos: data.photos ?? [],
    });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // ── Photo URL validation (only our upload bucket) ──
    const validPrefix = "/uploads/review-photos/";
    if (parsed.data.photos.some(url => !url.startsWith(validPrefix))) {
        return { success: false, error: "URL foto tidak valid" };
    }

    const result = await createReviewInDb({
        productId: parsed.data.productId,
        userId: user.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        comment: parsed.data.comment,
        photos: parsed.data.photos,
    });

    if (!result) {
        return { success: false, error: "Anda sudah memberikan ulasan untuk produk ini" };
    }

    revalidateTag("reviews");
    return { success: true };
}
