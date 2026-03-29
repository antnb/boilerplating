"use server";

import { revalidateTag } from "next/cache";
import { getCurrentUser, requireAdmin } from "@/shared/lib/auth-helpers";
import {
    uploadPaymentProof,
    confirmPayment,
    rejectPayment,
} from "@/shared/lib/data/payments";
import {
    submitPaymentProofSchema,
    confirmPaymentSchema,
    rejectPaymentSchema,
} from "@/shared/lib/validations/payment";
import type { ActionState } from "./types";

// ══════════════════════════════════════
// Payment Server Actions
// ══════════════════════════════════════
// Pattern: auth → validate → mutate → revalidate

/**
 * Buyer: Submit payment proof for an order they own.
 * Order must be in "pending" status.
 */
export async function submitPaymentProofAction(
    _prev: ActionState<string>,
    formData: FormData
): Promise<ActionState<string>> {
    // ── Auth ──
    const user = await getCurrentUser();
    if (!user?.id) {
        return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    // ── Validate ──
    const parsed = submitPaymentProofSchema.safeParse({
        orderId: formData.get("orderId"),
        proofUrl: formData.get("proofUrl"),
    });
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0]?.message || "Data tidak valid" };
    }

    // ── Mutate ──
    const result = await uploadPaymentProof(
        parsed.data.orderId,
        user.id,
        parsed.data.proofUrl
    );

    if (!result) {
        return { success: false, error: "Pesanan tidak ditemukan atau sudah diproses" };
    }

    // ── Revalidate ──
    revalidateTag("orders");
    return { success: true, data: "Bukti pembayaran berhasil dikirim" };
}

/**
 * Admin: Confirm payment — moves order from pending to processing.
 */
export async function adminConfirmPaymentAction(
    _prev: ActionState<string>,
    formData: FormData
): Promise<ActionState<string>> {
    // ── Auth (admin only) ──
    try {
        await requireAdmin();
    } catch {
        return { success: false, error: "Anda tidak memiliki akses" };
    }

    // ── Validate ──
    const parsed = confirmPaymentSchema.safeParse({
        orderId: formData.get("orderId"),
    });
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0]?.message || "Data tidak valid" };
    }

    // ── Mutate ──
    const result = await confirmPayment(parsed.data.orderId);
    if (!result) {
        return { success: false, error: "Pesanan tidak ditemukan atau sudah diproses" };
    }

    // ── Revalidate ──
    revalidateTag("orders");
    revalidateTag("admin-orders");
    return { success: true, data: "Pembayaran berhasil dikonfirmasi" };
}

/**
 * Admin: Reject payment — clears proof so buyer can re-upload.
 */
export async function adminRejectPaymentAction(
    _prev: ActionState<string>,
    formData: FormData
): Promise<ActionState<string>> {
    // ── Auth (admin only) ──
    try {
        await requireAdmin();
    } catch {
        return { success: false, error: "Anda tidak memiliki akses" };
    }

    // ── Validate ──
    const parsed = rejectPaymentSchema.safeParse({
        orderId: formData.get("orderId"),
        reason: formData.get("reason"),
    });
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0]?.message || "Data tidak valid" };
    }

    // ── Mutate ──
    const result = await rejectPayment(parsed.data.orderId, parsed.data.reason);
    if (!result) {
        return { success: false, error: "Pesanan tidak ditemukan atau sudah diproses" };
    }

    // ── Revalidate ──
    revalidateTag("orders");
    revalidateTag("admin-orders");
    return { success: true, data: "Bukti pembayaran ditolak" };
}
