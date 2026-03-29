import 'server-only';
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ══════════════════════════════════════
// Review Data Access Layer
// ══════════════════════════════════════
// Rule #13: Handles P2002 (duplicate user+product review).

// ── READS ──

/** Get reviews for a product */
export async function getReviewsByProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, rating: true, title: true, comment: true,
      photos: true, isVerified: true, createdAt: true,
      user: { select: { name: true } },
    },
  });
}

/** Get average rating and count — uses Prisma aggregate */
export async function getAverageRating(productId: string) {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: result._avg.rating ?? 0,
    count: result._count.rating,
  };
}

// ── WRITES ──

/** Create a review — returns null if user already reviewed this product (P2002) */
export async function createReviewInDb(data: {
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  photos?: string[];
}) {
  try {
    return await prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        photos: data.photos && data.photos.length > 0 ? data.photos : undefined,
      },
      select: { id: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null; // Already reviewed — caller handles messaging
    }
    throw error;
  }
}

// ── ADMIN ──

/** Get all reviews for admin moderation — includes product and user info */
export async function getAllReviewsForAdmin() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      photos: true,
      isVerified: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
  });
}

/** Delete review by ID — admin moderation */
export async function deleteReviewInDb(reviewId: string) {
  try {
    await prisma.review.delete({ where: { id: reviewId } });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return false;
    }
    throw error;
  }
}

/** Toggle review verified status */
export async function toggleReviewVerified(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { isVerified: true },
  });
  if (!review) return null;

  return prisma.review.update({
    where: { id: reviewId },
    data: { isVerified: !review.isVerified },
    select: { id: true, isVerified: true },
  });
}
