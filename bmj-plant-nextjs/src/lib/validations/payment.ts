import { z } from "zod";

// ── Payment Schemas ──

export const submitPaymentProofSchema = z.object({
    orderId: z.string().min(1, "ID pesanan wajib"),
    proofUrl: z.string().min(1, "URL bukti pembayaran wajib").startsWith("/uploads/", "URL bukti pembayaran tidak valid"),
});

export const confirmPaymentSchema = z.object({
    orderId: z.string().min(1, "ID pesanan wajib"),
});

export const rejectPaymentSchema = z.object({
    orderId: z.string().min(1, "ID pesanan wajib"),
    reason: z.string().min(1, "Alasan wajib diisi").max(500, "Alasan maksimal 500 karakter"),
});

export type SubmitPaymentProofInput = z.infer<typeof submitPaymentProofSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type RejectPaymentInput = z.infer<typeof rejectPaymentSchema>;
