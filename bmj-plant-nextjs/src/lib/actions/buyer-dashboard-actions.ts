"use server";

import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserProfile } from "@/lib/data/users";
import { getOrdersByUser } from "@/lib/data/orders";
import { getAddressesByUser } from "@/lib/data/addresses";
import { getCachedProducts } from "@/lib/data/products";
import type { OrderStatus } from "@/types/order";

// ══════════════════════════════════════
// Buyer Dashboard Server Actions
// ══════════════════════════════════════
// Bridge: "use client" BuyerDashboardPage → Server Action → DAL
// Session-gated: all actions require authenticated user.

// ── Types ──
type BuyerOrder = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; qty: number; price: number; image: string }[];
  tracking: { courier: string; resi: string; lastUpdate: string } | null;
};

// ── Profile ──

export async function fetchBuyerProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getUserProfile(user.id);
  if (!profile) return null;

  // Compute tier from order history
  const orders = await getOrdersByUser(user.id);
  const totalSpent = orders.reduce((sum, o) => {
    if (o.status === "cancelled") return sum;
    return sum + Number(o.total);
  }, 0);

  let tier = "Bronze";
  if (totalSpent >= 30000000) tier = "Platinum";
  else if (totalSpent >= 10000000) tier = "Gold";
  else if (totalSpent >= 3000000) tier = "Silver";

  // Points: rough 1 point per 10k spent
  const points = Math.floor(totalSpent / 10000);

  return {
    id: profile.id,
    name: profile.name ?? "Customer",
    email: profile.email,
    phone: profile.phone ?? "",
    memberSince: profile.createdAt.toISOString(),
    tier,
    points,
  };
}

// ── Orders ──

export async function fetchBuyerOrders(): Promise<BuyerOrder[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const orders = await getOrdersByUser(user.id);
  return orders.map((o) => ({
    id: o.orderNumber,
    date: o.createdAt.toISOString(),
    status: o.status as OrderStatus,
    total: Number(o.total),
    items: o.items.map((item) => ({
      name: item.productName,
      qty: item.quantity,
      price: Number(item.unitPrice) * item.quantity,
      image: item.image ?? "/placeholder.svg",
    })),
    tracking: null, // Tracking data not in getOrdersByUser select — keep null for list view
  }));
}

// ── Addresses ──

export async function fetchBuyerAddresses() {
  const user = await getCurrentUser();
  if (!user) return [];

  const addresses = await getAddressesByUser(user.id);
  return addresses.map((a) => ({
    id: a.id,
    label: a.label,
    recipient: a.recipientName,
    phone: a.phone,
    address: a.streetAddress,
    city: a.city,
    province: a.province,
    postal: a.postalCode,
    isDefault: a.isDefault,
  }));
}

// ── Recommendations ──

export async function fetchRecommendations() {
  const products = await getCachedProducts({ take: 6 });
  // Pick top 3 as "recommendations"
  return products.slice(0, 3).map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    image: p.images[0]?.url ?? "/placeholder.svg",
    slug: p.slug,
    reason: "Populer minggu ini",
  }));
}
