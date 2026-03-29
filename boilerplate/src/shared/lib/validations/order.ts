import { z } from "zod";

// ── Order Schema ──

export const createOrderSchema = z.object({
    addressId: z.string().min(1, "Pilih alamat pengiriman"),
    paymentMethod: z.string().min(1, "Pilih metode pembayaran"),
    shippingMethod: z.string().optional(),
    shippingCost: z.number().min(0).optional(),
    note: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
    notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
    couponCode: z.string().max(50).optional(),
    discount: z.number().min(0).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
