import { z } from "zod";

// ── Wishlist Schemas ──

export const wishlistItemSchema = z.object({
    productId: z.string().min(1, "ID produk wajib"),
});

export const mergeWishlistSchema = z
    .array(z.string().min(1))
    .max(200, "Maksimal 200 item");

export type WishlistItemInput = z.infer<typeof wishlistItemSchema>;
export type MergeWishlistInput = z.infer<typeof mergeWishlistSchema>;
