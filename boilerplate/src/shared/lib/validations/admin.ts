import { z } from "zod";

// ── Admin Schemas ──

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const updateOrderStatusSchema = z.object({
    orderNumber: z.string().min(1, "Nomor pesanan wajib"),
    newStatus: z.enum(ORDER_STATUSES, { errorMap: () => ({ message: "Status tidak valid" }) }),
});

export const toggleCouponSchema = z.object({
    id: z.string().min(1, "ID kupon wajib"),
});

export const searchQuerySchema = z.object({
    query: z.string().max(200, "Query terlalu panjang").transform(v => v.trim()),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ToggleCouponInput = z.infer<typeof toggleCouponSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
