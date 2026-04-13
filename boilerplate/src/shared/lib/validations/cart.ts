import { z } from "zod";

// ── Cart Schemas ──

export const addToCartSchema = z.object({
    productId: z.string().min(1, "ID produk wajib"),
    quantity: z.number().int("Jumlah harus bilangan bulat").min(1, "Minimal 1").max(100, "Maksimal 100"),
});

export const updateCartQuantitySchema = z.object({
    itemId: z.string().min(1, "ID item wajib"),
    quantity: z.number().int("Jumlah harus bilangan bulat").min(1, "Minimal 1").max(100, "Maksimal 100"),
});

export const removeFromCartSchema = z.object({
    itemId: z.string().min(1, "ID item wajib"),
});

export const mergeCartSchema = z.array(
    z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(100),
    })
).max(100, "Maksimal 100 item");

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
export type MergeCartInput = z.infer<typeof mergeCartSchema>;
