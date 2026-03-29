import { z } from "zod";

// ── Review Schema ──

export const submitReviewSchema = z.object({
    productId: z.string().min(1, "ID produk wajib"),
    rating: z.number().int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
    title: z.string().max(200, "Judul maksimal 200 karakter").optional().default(""),
    comment: z.string().min(1, "Komentar wajib diisi").max(2000, "Komentar maksimal 2000 karakter"),
    photos: z.array(z.string().url().or(z.string().startsWith("/uploads/")))
      .max(3, "Maksimal 3 foto")
      .optional()
      .default([]),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
