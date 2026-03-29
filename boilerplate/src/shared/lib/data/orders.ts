import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import type { Prisma } from "@prisma/client";

// ══════════════════════════════════════
// Order Data Access Layer
// ══════════════════════════════════════
// Rule #5:  $transaction for multi-step writes.
// Rule #3:  Explicit select on all queries.
// Rule #9:  Decimal for money fields (handled by Prisma schema).

// ── WRITES ──

/** Create order atomically — Rule #5: $transaction */
export async function createOrderInDb(data: {
  userId: string;
  addressSnapshot: Prisma.InputJsonValue;
  items: Array<{
    productId: string;
    productName: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    image?: string;
  }>;
  subtotal: number;
  discount?: number;
  shippingCost?: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
  couponCode?: string;
}) {
  const orderNumber = `ORD-${Date.now()}`;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        addressSnapshot: data.addressSnapshot,
        subtotal: data.subtotal,
        discount: data.discount ?? 0,
        shippingCost: data.shippingCost ?? 0,
        total: data.total,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        couponCode: data.couponCode,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            image: item.image,
          })),
        },
        timeline: {
          create: {
            status: "pending",
            note: "Pesanan dibuat",
          },
        },
      },
      select: { id: true, orderNumber: true },
    });

    // Decrement stock for each item
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  });
}

// ── READS ──

/** Get orders for a user */
export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, orderNumber: true, status: true, total: true,
      createdAt: true,
      items: {
        select: {
          id: true, productName: true, quantity: true,
          unitPrice: true, image: true,
        },
      },
    },
  });
}

/** Get single order detail with full relations */
export async function getOrderDetail(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    select: {
      id: true, orderNumber: true, status: true,
      subtotal: true, discount: true, shippingCost: true, total: true,
      addressSnapshot: true, paymentMethod: true, paymentProof: true,
      notes: true, couponCode: true,
      trackingCourier: true, trackingNumber: true, trackingLastUpdate: true,
      createdAt: true,
      items: {
        select: {
          id: true, productName: true, sku: true,
          quantity: true, unitPrice: true, image: true,
        },
      },
      timeline: {
        select: { status: true, note: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/** Admin: Get all orders */
export async function getAdminOrders(opts?: { status?: string; take?: number }) {
  return prisma.order.findMany({
    where: opts?.status ? { status: opts.status } : undefined,
    take: opts?.take ?? 50,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, orderNumber: true, status: true, total: true,
      createdAt: true, paymentMethod: true,
      user: { select: { name: true, email: true } },
      items: { select: { productName: true, quantity: true } },
    },
  });
}

/** Admin: Update order status with timeline entry */
export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  return prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status },
    }),
    prisma.orderTimeline.create({
      data: { orderId, status, note },
    }),
  ]);
}

/**
 * Check if user has purchased a specific product.
 * Returns true only if there is a delivered order containing this product.
 * Used as authorization gate for reviews and review photo uploads.
 */
export async function hasUserPurchasedProduct(
  userId: string,
  productId: string
): Promise<boolean> {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: "delivered",
      items: {
        some: { productId },
      },
    },
    select: { id: true },
  });
  return order !== null;
}
