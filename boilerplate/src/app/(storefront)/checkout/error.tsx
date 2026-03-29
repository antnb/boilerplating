"use client";

import { ErrorBoundaryUI, type RouteErrorProps } from "@/shared/components/error/ErrorBoundaryUI";
import { ShoppingCart } from "lucide-react";

/**
 * Checkout error boundary — extra careful messaging about payment safety.
 * Users in checkout are in a sensitive state (about to pay).
 * Reassure them that no payment has been processed.
 */
export default function CheckoutError({ error, reset }: RouteErrorProps) {
    return (
        <ErrorBoundaryUI
            error={error}
            reset={reset}
            title="Checkout Bermasalah"
            description="Terjadi kesalahan pada proses checkout. Jangan khawatir — tidak ada pembayaran yang diproses. Data keranjang Anda tetap aman. Silakan coba lagi."
            fallbackLabel="Kembali ke Keranjang"
            fallbackHref="/checkout"
            fallbackIcon={ShoppingCart}
            category="checkout"
        />
    );
}
