import type { CartItem } from "@/components/checkout/types";

export function getCartSubtotal(items: CartItem[]): number {
    return items.reduce(
        (sum, item) => sum + (item.plant?.price || 0) * item.quantity,
        0
    );
}

export function getCartItemCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}
