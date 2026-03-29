"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, X, Check, Loader2, Percent, Truck } from "lucide-react";
import { validateCouponAction } from "@/lib/actions/coupon-actions";
import type { Coupon } from "@/types/coupon";
import { formatPrice } from "@/lib/utils/format";

interface CouponInputProps {
  subtotal: number;
  appliedCoupon: Coupon | null;
  discount: number;
  onApply: (coupon: Coupon, discount: number) => void;
  onRemove: () => void;
}

export function CouponInput({
  subtotal,
  appliedCoupon,
  discount,
  onApply,
  onRemove,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsValidating(true);
    setError(null);

    const result = await validateCouponAction(code, subtotal);
    setIsValidating(false);

    if (!result.valid) {
      setError(result.error || "Kode kupon tidak valid");
      return;
    }

    if (result.valid && result.coupon) {
      // Map server result to Coupon type expected by onApply
      const couponForApply: Coupon = {
        code: result.coupon.code,
        description: result.coupon.description,
        type: result.coupon.type as Coupon["type"],
        value: result.coupon.value,
        minOrderAmount: 0,
        maxDiscount: null,
        isActive: true,
        validUntil: "",
      };
      onApply(couponForApply, result.coupon.discount || 0);
      setCode("");
      setError(null);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              {appliedCoupon.type === "free_shipping" ? (
                <Truck className="w-4 h-4 text-emerald-600" />
              ) : (
                <Percent className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="font-mono text-xs bg-emerald-100 text-emerald-700"
                >
                  {appliedCoupon.code}
                </Badge>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                {appliedCoupon.type === "free_shipping"
                  ? "Gratis ongkos kirim"
                  : `Hemat IDR ${formatPrice(discount)}`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Masukkan kode kupon"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="pl-9 font-mono uppercase tracking-wider"
            disabled={isValidating}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={!code.trim() || isValidating}
          className="min-w-[90px]"
        >
          {isValidating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Pakai"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Coba: WELCOME10, HEMAT50K, GRATISONGKIR
      </p>
    </div>
  );
}
