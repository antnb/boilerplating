"use server";

import { validateCouponInDb } from "@/lib/data/coupons";
import { validateCouponSchema } from "@/lib/validations/coupon";

/**
 * Server action for coupon validation — replaces mock-coupons.ts validateCoupon.
 */
export async function validateCouponAction(code: string, orderAmount: number) {
    const parsed = validateCouponSchema.safeParse({ code, orderAmount });
    if (!parsed.success) {
        return { valid: false as const, error: parsed.error.issues[0].message };
    }

    return validateCouponInDb(parsed.data.code, parsed.data.orderAmount);
}
