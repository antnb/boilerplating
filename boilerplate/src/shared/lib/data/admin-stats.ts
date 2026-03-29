import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import { ROLE_IDS } from "@/shared/lib/constants/roles";

// ══════════════════════════════════════
// Admin Dashboard Stats — Data Access Layer
// ══════════════════════════════════════
// Rule #2:  All Prisma calls live here.
// Rule #3:  Every query uses explicit `select`.
// Rule #4:  Promise.all() for independent reads.
// Rule #9:  Decimal converted to Number before return.

// ── Dashboard Overview Stats ──

/** Aggregated dashboard metrics: revenue, order count, customer count, avg order value */
export async function getAdminDashboardStats() {
  const [orderAgg, customerCount] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      _avg: { total: true },
    }),
    prisma.user.count({ where: { roleId: ROLE_IDS.CUSTOMER } }),
  ]);

  return {
    revenue: {
      value: Number(orderAgg._sum.total ?? 0),
      change: 0, // Historical comparison requires time-series — placeholder
      period: "Total",
    },
    orders: {
      value: orderAgg._count,
      change: 0,
      period: "Total",
    },
    customers: {
      value: customerCount,
      change: 0,
      period: "Total aktif",
    },
    avgOrderValue: {
      value: Math.round(Number(orderAgg._avg.total ?? 0)),
      change: 0,
      period: "Rata-rata",
    },
  };
}

// ── Top Products by Sales ──

/** Top selling products by quantity and revenue */
export async function getTopProducts(take = 5) {
  const topItems = await prisma.orderItem.groupBy({
    by: ["productName"],
    _sum: {
      quantity: true,
      unitPrice: true,
    },
    _count: true,
    orderBy: { _count: { quantity: "desc" } },
    take,
  });

  return topItems.map((item) => ({
    name: item.productName,
    sold: item._sum.quantity ?? 0,
    revenue: Number(item._sum.unitPrice ?? 0) * (item._sum.quantity ?? 0),
  }));
}

// ── Inventory List ──

/** All products with stock status for inventory management */
export async function getInventoryList() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      price: true,
      isActive: true,
      category: { select: { name: true } },
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku ?? "",
    stock: p.stock,
    price: Number(p.price),
    category: p.category.name,
    status: p.stock === 0
      ? ("out_of_stock" as const)
      : p.stock <= 3
        ? ("low_stock" as const)
        : ("active" as const),
  }));
}

// ── Customer List ──

/** All customers with order aggregations and computed tier */
export async function getCustomerList() {
  const customers = await prisma.user.findMany({
    where: { roleId: ROLE_IDS.CUSTOMER },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      orders: {
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return customers.map((c) => {
    const orderCount = c.orders.length;
    const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.total), 0);
    const lastOrder = c.orders[0]?.createdAt ?? c.createdAt;

    // Tier computation based on total spend
    let tier = "Bronze";
    if (totalSpent >= 30000000) tier = "Platinum";
    else if (totalSpent >= 10000000) tier = "Gold";
    else if (totalSpent >= 3000000) tier = "Silver";

    return {
      id: c.id,
      name: c.name ?? "Tanpa Nama",
      email: c.email,
      orders: orderCount,
      totalSpent,
      lastOrder: lastOrder.toISOString(),
      tier,
    };
  });
}

// ── Admin Articles List ──

/** Articles for admin dashboard listing */
export async function getAdminArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      author: true,
      isPublished: true,
      createdAt: true,
    },
  });

  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    author: a.author,
    status: a.isPublished ? ("published" as const) : ("draft" as const),
    date: a.createdAt.toISOString(),
    views: 0, // No views column in schema — placeholder
  }));
}

// ── Admin Order Detail (by ID) ──

/** Full order detail for OrderSlideOver — admin view (no userId filter) */
export async function getAdminOrderDetail(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      subtotal: true,
      discount: true,
      shippingCost: true,
      total: true,
      addressSnapshot: true,
      paymentMethod: true,
      paymentProof: true,
      notes: true,
      trackingCourier: true,
      trackingNumber: true,
      trackingLastUpdate: true,
      createdAt: true,
      user: {
        select: { name: true, email: true, phone: true },
      },
      items: {
        select: {
          id: true,
          productName: true,
          sku: true,
          quantity: true,
          unitPrice: true,
          image: true,
        },
      },
      timeline: {
        select: { status: true, note: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/** Find order by orderNumber — returns the order ID for detail lookup */
export async function getOrderIdByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true },
  });
  return order?.id ?? null;
}
