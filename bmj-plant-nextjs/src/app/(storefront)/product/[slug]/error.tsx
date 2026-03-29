"use client";

import { ErrorBoundaryUI, type RouteErrorProps } from "@/components/error/ErrorBoundaryUI";
import { Search } from "lucide-react";

/** Catches errors loading an individual product detail page */
export default function ProductDetailError({ error, reset }: RouteErrorProps) {
    return (
        <ErrorBoundaryUI
            error={error}
            reset={reset}
            title="Produk Tidak Dapat Dimuat"
            description="Terjadi kesalahan saat memuat detail produk. Silakan coba lagi atau jelajahi katalog kami."
            fallbackLabel="Lihat Katalog"
            fallbackHref="/product"
            fallbackIcon={Search}
            category="product-detail"
        />
    );
}
