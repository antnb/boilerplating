import { z } from "zod";

// ── Coupon Schema ──

export const validateCouponSchema = z.object({
    code: z.string().min(1, "Masukkan kode kupon").max(50).transform(v => v.trim().toUpperCase()),
    orderAmount: z.number().min(0, "Jumlah pesanan tidak valid"),
});

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
