"use client";

import { ErrorBoundaryUI, type RouteErrorProps } from "@/components/error/ErrorBoundaryUI";
import { Home } from "lucide-react";

/** Catches errors in storefront pages (product listing, knowledge, portfolio, etc.) */
export default function StorefrontError({ error, reset }: RouteErrorProps) {
    return (
        <ErrorBoundaryUI
            error={error}
            reset={reset}
            title="Halaman Tidak Dapat Dimuat"
            description="Terjadi kesalahan saat memuat halaman toko. Silakan coba lagi atau kembali ke beranda."
            fallbackLabel="Ke Beranda"
            fallbackHref="/"
            fallbackIcon={Home}
            category="storefront"
        />
    );
}
