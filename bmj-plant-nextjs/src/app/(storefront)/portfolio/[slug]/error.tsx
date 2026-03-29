"use client";

import { ErrorBoundaryUI, type RouteErrorProps } from "@/components/error/ErrorBoundaryUI";
import { FolderOpen } from "lucide-react";

/** Catches errors loading a portfolio project detail page */
export default function PortfolioDetailError({ error, reset }: RouteErrorProps) {
    return (
        <ErrorBoundaryUI
            error={error}
            reset={reset}
            title="Proyek Tidak Dapat Dimuat"
            description="Terjadi kesalahan saat memuat detail proyek. Silakan coba lagi atau lihat portfolio lainnya."
            fallbackLabel="Lihat Portfolio"
            fallbackHref="/portfolio"
            fallbackIcon={FolderOpen}
            category="portfolio-detail"
        />
    );
}
