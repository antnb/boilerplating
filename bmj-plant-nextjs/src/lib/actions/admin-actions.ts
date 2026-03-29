"use server";

import {
  getAdminDashboardStats,
  getTopProducts,
  getInventoryList,
  getCustomerList,
  getAdminArticles,
  getAdminOrderDetail,
  getOrderIdByNumber,
} from "@/lib/data/admin-stats";
import { getAdminOrders, updateOrderStatus } from "@/lib/data/orders";
import { getAllCoupons, toggleCouponActiveInDb } from "@/lib/data/coupons";
import { requireAdmin } from "@/lib/auth-helpers";
import { updateOrderStatusSchema, toggleCouponSchema } from "@/lib/validations/admin";
import type { AdminOrderDetail, OrderStatus } from "@/types/order";
import type { AdminCoupon } from "@/types/coupon";

// ══════════════════════════════════════
// Admin Server Actions
// ══════════════════════════════════════
// Bridge: "use client" Component → Server Action → DAL → Prisma → MySQL
// All return values are JSON-serializable (no Date objects, no Decimal).

// ── Dashboard Stats ──

export async function fetchDashboardStats() {
  await requireAdmin();
  return getAdminDashboardStats();
}

// ── Top Products ──

export async function fetchTopProducts() {
  await requireAdmin();
  return getTopProducts();
}

// ── Admin Orders ──

/** Returns admin order list mapped to the shape expected by StaffDashboardPage */
export async function fetchAdminOrders(opts?: { status?: string }) {
  await requireAdmin();
  const orders = await getAdminOrders(opts);
  return orders.map((o) => ({
    id: o.orderNumber,
    customer: o.user.name ?? "Tanpa Nama",
    date: o.createdAt.toISOString(),
    status: o.status as OrderStatus,
    total: Number(o.total),
    items: o.items.reduce((sum, item) => sum + item.quantity, 0),
  }));
}

// ── Inventory ──

export async function fetchInventory() {
  await requireAdmin();
  return getInventoryList();
}

// ── Customers ──

export async function fetchCustomers() {
  await requireAdmin();
  return getCustomerList();
}

// ── Articles ──

export async function fetchArticles() {
  await requireAdmin();
  return getAdminArticles();
}

// ── Order Detail (for OrderSlideOver) ──

/** Fetch order detail by orderNumber, returning AdminOrderDetail shape */
export async function fetchOrderDetail(
  orderNumber: string
): Promise<AdminOrderDetail | null> {
  await requireAdmin();
  const orderId = await getOrderIdByNumber(orderNumber);
  if (!orderId) return null;

  const order = await getAdminOrderDetail(orderId);
  if (!order) return null;

  // Parse addressSnapshot from JSON
  const addr = order.addressSnapshot as Record<string, string> | null;

  return {
    id: order.orderNumber,
    customer: order.user.name ?? "Tanpa Nama",
    email: order.user.email,
    phone: order.user.phone ?? "",
    date: order.createdAt.toISOString(),
    status: order.status as OrderStatus,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    discount: Number(order.discount),
    items: order.items.map((item) => ({
      name: item.productName,
      sku: item.sku ?? "",
      qty: item.quantity,
      price: Number(item.unitPrice),
      image: item.image ?? "/placeholder.svg",
    })),
    address: {
      recipient: addr?.recipientName ?? addr?.recipient ?? "",
      address: addr?.streetAddress ?? addr?.address ?? "",
      city: addr?.city ?? "",
      province: addr?.province ?? "",
      postal: addr?.postalCode ?? addr?.postal ?? "",
    },
    tracking: order.trackingNumber
      ? {
          courier: order.trackingCourier ?? "",
          resi: order.trackingNumber,
          lastUpdate: order.trackingLastUpdate ?? "",
        }
      : null,
    notes: order.notes ?? "",
    paymentMethod: order.paymentMethod ?? "",
    paymentProof: order.paymentProof ?? null,
    timeline: order.timeline.map((t) => ({
      status: t.status,
      date: t.createdAt.toISOString(),
      note: t.note ?? "",
    })),
  };
}

// ── Coupon Actions ──

/** Fetch all coupons mapped to AdminCoupon shape */
export async function fetchCoupons(): Promise<AdminCoupon[]> {
  await requireAdmin();
  const coupons = await getAllCoupons();
  return coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type as AdminCoupon["type"],
    value: Number(c.value),
    minOrder: Number(c.minOrderAmount),
    maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
    usageCount: c.usageCount,
    usageLimit: c.usageLimit,
    expiresAt: c.validUntil.toISOString(),
    isActive: c.isActive,
  }));
}

/** Toggle coupon isActive status — delegates to DAL per Rule #2 */
export async function toggleCouponActive(id: string) {
  await requireAdmin();

  const parsed = toggleCouponSchema.safeParse({ id });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const result = await toggleCouponActiveInDb(parsed.data.id);
  if (!result) return { success: false, error: "Kupon tidak ditemukan" };
  return { success: true };
}

// ── Order Status Update ──

/** Update order status by orderNumber + create timeline entry */
export async function updateAdminOrderStatus(
  orderNumber: string,
  newStatus: OrderStatus
) {
  await requireAdmin();

  const parsed = updateOrderStatusSchema.safeParse({ orderNumber, newStatus });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const orderId = await getOrderIdByNumber(parsed.data.orderNumber);
  if (!orderId) return { success: false, error: "Pesanan tidak ditemukan" };

  const statusNotes: Record<OrderStatus, string> = {
    pending: "Status diubah ke Menunggu",
    processing: "Pembayaran dikonfirmasi, pesanan diproses",
    shipped: "Pesanan dikirim",
    delivered: "Pesanan diterima",
    cancelled: "Pesanan dibatalkan",
  };

  await updateOrderStatus(orderId, parsed.data.newStatus as OrderStatus, statusNotes[parsed.data.newStatus as OrderStatus]);
  return { success: true };
}

// ── Product Form Data ──

import { getCachedCategories } from "@/lib/data/categories";
import { getStaffProfiles, getProductForEdit } from "@/lib/data/products";

/** Load dropdown data needed by ProductForm: categories + staff profiles */
export async function fetchProductFormData() {
  await requireAdmin();
  const [categories, staffProfiles] = await Promise.all([
    getCachedCategories(),
    getStaffProfiles(),
  ]);
  return { categories, experts: staffProfiles }; // Keep 'experts' key for UI compatibility
}

/** Load a single product for editing (all fields) */
export async function fetchProductForEdit(id: string) {
  await requireAdmin();
  const product = await getProductForEdit(id);
  if (!product) return null;
  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  };
}
