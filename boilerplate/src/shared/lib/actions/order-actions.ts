"use server";

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { createOrderInDb, getOrdersByUser, getOrderDetail as getOrderDetailFromDb } from "@/shared/lib/data/orders";
import { getAddressesByUser } from "@/shared/lib/data/addresses";
import { getCartItemsForCheckout, clearCart } from "@/shared/lib/data/cart";
import { createOrderSchema } from "@/shared/lib/validations/order";
import { sendOrderConfirmationEmail } from "@/shared/lib/email/send";
import type { ActionState } from "./types";

// ── MUTATIONS ──

/**
 * Create an order from the user's DB cart.
 * SERVER-SIDE TRUTH: items and prices come from DB, never from client.
 * Clears the DB cart after successful order creation.
 */
export async function createOrder(data: {
    addressId: string;
    paymentMethod: string;
    shippingMethod?: string;
    shippingCost?: number;
    note?: string;
    notes?: string;
    couponCode?: string;
    discount?: number;
}): Promise<ActionState<{ orderId: string; orderNumber: string }> & { orderId?: string; orderNumber?: string }> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = createOrderSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    try {
        // Get address for snapshot
        const addresses = await getAddressesByUser(user.id);
        const selectedAddress = addresses.find(a => a.id === parsed.data.addressId);
        if (!selectedAddress) return { success: false, error: "Alamat tidak ditemukan" };

        // ── SERVER-SIDE CART TRUTH ──
        // Read items from DB cart — NEVER trust client-supplied prices
        const cartData = await getCartItemsForCheckout(user.id);
        if (!cartData || cartData.length === 0) {
            return { success: false, error: "Keranjang kosong" };
        }

        // Filter: active products with stock, cap quantity at stock
        const items = cartData
            .filter((item) => item.product.isActive && item.product.stock > 0)
            .map((item) => ({
                productId: item.product.id,
                productName: item.product.name,
                sku: item.product.sku ?? undefined,
                quantity: Math.min(item.quantity, item.product.stock),
                unitPrice: Number(item.product.price),
                image: item.product.images[0]?.url ?? undefined,
            }));

        if (items.length === 0) {
            return { success: false, error: "Tidak ada produk yang tersedia di keranjang" };
        }

        const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        const discount = parsed.data.discount || 0;
        const shippingCost = parsed.data.shippingCost || 0;
        const total = subtotal - discount + shippingCost;

        const order = await createOrderInDb({
            userId: user.id,
            addressSnapshot: selectedAddress as any,
            items,
            subtotal,
            discount,
            shippingCost,
            total,
            paymentMethod: parsed.data.paymentMethod,
            notes: parsed.data.notes || parsed.data.note,
            couponCode: parsed.data.couponCode,
        });

        // Clear the DB cart after successful order
        await clearCart(user.id);

        revalidateTag("orders");
        revalidateTag("cart");

        // Fire-and-forget: send order confirmation email
        // Email failure must NOT block order response
        if (user.email) {
            sendOrderConfirmationEmail({
                to: user.email,
                customerName: user.name || "Customer",
                orderNumber: order.orderNumber,
                items: items.map(i => ({
                    productName: i.productName,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                })),
                subtotal,
                shippingCost,
                discount,
                total,
                paymentMethod: parsed.data.paymentMethod,
            }).catch(() => { /* logged inside sendOrderConfirmationEmail */ });
        }

        const result = { orderId: order.id, orderNumber: order.orderNumber };
        return { success: true, data: result, ...result };
    } catch (error) {
        console.error("createOrder error:", error);
        return { success: false, error: "Gagal membuat pesanan. Silakan coba lagi." };
    }
}

// ── READS ──

export async function getOrders() {
    const user = await getCurrentUser();
    if (!user) return [];

    const orders = await getOrdersByUser(user.id);
    return orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        items: order.items.map(item => ({
            id: item.id,
            plantName: item.productName,
            quantity: item.quantity,
            price: Number(item.unitPrice),
            image: item.image,
        })),
    }));
}

export async function getOrderDetail(id: string) {
    if (!id) return null;
    const user = await getCurrentUser();
    if (!user) return null;

    const order = await getOrderDetailFromDb(id, user.id);
    if (!order) return null;

    return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shippingCost: Number(order.shippingCost),
        createdAt: order.createdAt.toISOString(),
        paymentStatus: order.paymentProof ? "paid" : "pending",
        paymentMethod: order.paymentMethod,
        notes: order.notes,
        couponCode: order.couponCode,
        trackingCourier: order.trackingCourier,
        trackingNumber: order.trackingNumber,
        shippingAddress: order.addressSnapshot as any,
        items: order.items.map(item => ({
            id: item.id,
            plantName: item.productName,
            sku: item.sku,
            quantity: item.quantity,
            price: Number(item.unitPrice),
            image: item.image,
        })),
        timeline: order.timeline.map(t => ({
            status: t.status,
            note: t.note,
            date: t.createdAt.toISOString(),
        })),
    };
}
