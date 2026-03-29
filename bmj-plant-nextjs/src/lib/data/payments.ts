import 'server-only';
import { prisma } from "@/lib/prisma";

// ══════════════════════════════════════
// Payment Data Access Layer
// ══════════════════════════════════════

/**
 * Upload payment proof for an order.
 * Validates that the order belongs to the user and is in "pending" status.
 */
export async function uploadPaymentProof(
    orderId: string,
    userId: string,
    proofUrl: string
) {
    // Verify ownership + status in single query
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId, status: "pending" },
        select: { id: true },
    });

    if (!order) return null;

    return prisma.$transaction([
        prisma.order.update({
            where: { id: orderId },
            data: { paymentProof: proofUrl },
        }),
        prisma.orderTimeline.create({
            data: {
                orderId,
                status: "pending",
                note: "Bukti pembayaran diupload",
            },
        }),
    ]);
}

/**
 * Admin: Get orders awaiting payment confirmation.
 * Returns orders that have a paymentProof but are still "pending".
 */
export async function getOrdersAwaitingPayment() {
    return prisma.order.findMany({
        where: {
            status: "pending",
            paymentProof: { not: null },
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            orderNumber: true,
            total: true,
            paymentMethod: true,
            paymentProof: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
        },
    });
}

/**
 * Admin: Confirm payment — move order from pending to processing.
 */
export async function confirmPayment(orderId: string) {
    const order = await prisma.order.findFirst({
        where: { id: orderId, status: "pending" },
        select: { id: true },
    });

    if (!order) return null;

    return prisma.$transaction([
        prisma.order.update({
            where: { id: orderId },
            data: { status: "processing" },
        }),
        prisma.orderTimeline.create({
            data: {
                orderId,
                status: "processing",
                note: "Pembayaran dikonfirmasi oleh admin",
            },
        }),
    ]);
}

/**
 * Admin: Reject payment — add timeline note without changing status.
 * Order stays pending so buyer can re-upload.
 */
export async function rejectPayment(orderId: string, reason: string) {
    const order = await prisma.order.findFirst({
        where: { id: orderId, status: "pending" },
        select: { id: true },
    });

    if (!order) return null;

    return prisma.$transaction([
        // Clear the proof so buyer can re-upload
        prisma.order.update({
            where: { id: orderId },
            data: { paymentProof: null },
        }),
        prisma.orderTimeline.create({
            data: {
                orderId,
                status: "pending",
                note: `Bukti pembayaran ditolak: ${reason}`,
            },
        }),
    ]);
}
