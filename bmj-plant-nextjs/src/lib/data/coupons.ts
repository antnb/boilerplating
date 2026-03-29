import 'server-only';
import { prisma } from "@/lib/prisma";

// ══════════════════════════════════════
// Coupon Data Access Layer
// ══════════════════════════════════════
// Replaces mock-coupons.ts validateCoupon logic with real DB queries.

/** Validate a coupon code against the database */
export async function validateCouponInDb(code: string, orderAmount: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
    select: {
      id: true, code: true, description: true, type: true,
      value: true, minOrderAmount: true, maxDiscount: true,
      usageCount: true, usageLimit: true, isActive: true,
      validUntil: true,
    },
  });

  if (!coupon) return { valid: false as const, error: "Kode kupon tidak ditemukan" };
  if (!coupon.isActive) return { valid: false as const, error: "Kupon sudah tidak aktif" };
  if (new Date() > coupon.validUntil) return { valid: false as const, error: "Kupon sudah kedaluwarsa" };
  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false as const, error: "Kupon sudah mencapai batas penggunaan" };
  }
  if (orderAmount < Number(coupon.minOrderAmount)) {
    return {
      valid: false as const,
      error: `Minimal belanja Rp ${Number(coupon.minOrderAmount).toLocaleString("id-ID")}`,
    };
  }

  // Calculate discount
  let discount = 0;
  const couponValue = Number(coupon.value);
  if (coupon.type === "percentage") {
    discount = Math.round(orderAmount * couponValue / 100);
    if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
      discount = Number(coupon.maxDiscount);
    }
  } else if (coupon.type === "fixed") {
    discount = couponValue;
  }
  // free_shipping: discount stays 0, caller handles shipping logic

  return {
    valid: true as const,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: couponValue,
      discount,
    },
  };
}

/** Increment coupon usage after order placed */
export async function incrementCouponUsage(code: string) {
  return prisma.coupon.update({
    where: { code },
    data: { usageCount: { increment: 1 } },
  });
}

/** Admin: list all coupons */
export async function getAllCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, code: true, description: true, type: true,
      value: true, minOrderAmount: true, maxDiscount: true,
      usageCount: true, usageLimit: true, isActive: true,
      validUntil: true,
    },
  });
}

/** Admin: toggle coupon isActive status — Rule #2: all Prisma calls in /lib/data/ */
export async function toggleCouponActiveInDb(id: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!coupon) return null;

  await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });

  return { toggled: true };
}
