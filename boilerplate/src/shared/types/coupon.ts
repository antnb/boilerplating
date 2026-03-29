// Coupon types — extracted from mock-coupons.ts and mock-admin-extra.ts
// Used by: CouponInput, CheckoutSummary, CheckoutContent, CouponManager

export interface Coupon {
  code: string;
  description: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number; // percentage (0-100) or fixed amount in IDR
  minOrderAmount: number;
  maxDiscount: number | null; // null = unlimited
  isActive: boolean;
  validUntil: string;
}

// Admin view extends with usage tracking
export interface AdminCoupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageCount: number;
  usageLimit: number;
  expiresAt: string;
  isActive: boolean;
}
