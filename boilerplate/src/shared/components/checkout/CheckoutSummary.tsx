import Image from "next/image";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Package, MapPin, Truck, CreditCard, Tag } from "lucide-react";
import type { CartItem, Address, ShippingOption, PaymentMethod } from "./types";
import type { Coupon } from "@/shared/types/coupon";
import { formatPrice } from "@/shared/lib/utils/format";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  address?: Address | null;
  shippingMethod?: ShippingOption | null;
  paymentMethod?: PaymentMethod | null;
  showDetails?: boolean;
  couponDiscount?: number;
  appliedCoupon?: Coupon | null;
}

export function CheckoutSummary({
  items,
  subtotal,
  shippingCost,
  total,
  address,
  shippingMethod,
  paymentMethod,
  showDetails = false,
  couponDiscount = 0,
  appliedCoupon,
}: CheckoutSummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Ringkasan Pesanan</h3>

      {/* Items count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Package className="w-4 h-4" />
        <span>{items.length} produk ({items.reduce((sum, i) => sum + i.quantity, 0)} item)</span>
      </div>

      {/* Items list (if showDetails) */}
      {showDetails && items.length > 0 && (
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {item.plant?.image_url ? (
                  <Image src={item.plant.image_url} alt={item.plant.name} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.plant?.name || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity}x @ IDR {formatPrice(item.plant?.price || 0)}
                </p>
              </div>
              <p className="text-sm font-medium">
                IDR {formatPrice((item.plant?.price || 0) * item.quantity)}
              </p>
            </div>
          ))}
          <Separator />
        </div>
      )}

      {/* Price breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>IDR {formatPrice(subtotal)}</span>
        </div>

        {/* Coupon discount */}
        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex justify-between text-primary">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Diskon ({appliedCoupon.code})
            </span>
            <span>- IDR {formatPrice(couponDiscount)}</span>
          </div>
        )}

        {appliedCoupon?.type === "free_shipping" && (
          <div className="flex justify-between text-primary">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {appliedCoupon.code}
            </span>
            <span>Gratis Ongkir</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Ongkos Kirim</span>
          {appliedCoupon?.type === "free_shipping" ? (
            <span className="line-through text-muted-foreground">
              IDR {formatPrice(shippingCost)}
            </span>
          ) : shippingCost > 0 ? (
            <span>IDR {formatPrice(shippingCost)}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span className="text-primary">IDR {formatPrice(total)}</span>
      </div>

      {/* Savings callout */}
      {couponDiscount > 0 && (
        <p className="text-xs text-primary mt-2 text-right">
          Anda hemat IDR {formatPrice(couponDiscount)}! 🎉
        </p>
      )}

      {/* Shipping Address */}
      {address && (
        <>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Alamat Pengiriman
            </div>
            <div className="text-sm p-3 bg-muted rounded-lg">
              <p className="font-medium">{address.label}</p>
              <p className="text-muted-foreground">
                {address.recipient_name} • {address.phone}
              </p>
              <p className="text-muted-foreground mt-1">
                {address.address_line_1}
                {address.address_line_2 && `, ${address.address_line_2}`}
              </p>
              <p className="text-muted-foreground">
                {address.city}, {address.province} {address.postal_code}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Shipping Method */}
      {shippingMethod && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Truck className="w-4 h-4" />
            Pengiriman
          </div>
          <div className="text-sm p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{shippingMethod.name}</span>
              <Badge variant="secondary" className="text-xs">
                {shippingMethod.estimatedDays}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs mt-1">{shippingMethod.description}</p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CreditCard className="w-4 h-4" />
            Pembayaran
          </div>
          <div className="text-sm p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">{paymentMethod.icon}</span>
              <span className="font-medium">{paymentMethod.name}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
