"use server";

import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import {
  getAllReviewsForAdmin,
  deleteReviewInDb,
  toggleReviewVerified,
} from "@/shared/lib/data/reviews";

// ══════════════════════════════════════
// Admin Review Server Actions
// ══════════════════════════════════════
// Bridge: StaffDashboard "Reviews" tab → Server Action → DAL → Prisma

export async function fetchAdminReviews() {
  await requireAdmin();
  const reviews = await getAllReviewsForAdmin();
  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    photos: (r.photos as string[] | null) ?? [],
    isVerified: r.isVerified,
    customerName: r.user?.name || "Anonim",
    customerEmail: r.user?.email || "",
    productName: r.product?.name || "",
    productSlug: r.product?.slug || "",
    date: r.createdAt.toISOString(),
  }));
}

export async function deleteReviewAction(reviewId: string) {
  await requireAdmin();
  const result = await deleteReviewInDb(reviewId);
  if (!result) return { success: false, error: "Ulasan tidak ditemukan" };
  revalidateTag("reviews");
  return { success: true };
}

export async function toggleReviewVerifiedAction(reviewId: string) {
  await requireAdmin();
  const result = await toggleReviewVerified(reviewId);
  if (!result) return { success: false, error: "Ulasan tidak ditemukan" };
  revalidateTag("reviews");
  return { success: true, isVerified: result.isVerified };
}
