"use client";

import { ErrorBoundaryUI, type RouteErrorProps } from "@/components/error/ErrorBoundaryUI";
import { RefreshCw } from "lucide-react";

/** Buyer dashboard error boundary — suggests refreshing as primary recovery */
export default function DashboardError({ error, reset }: RouteErrorProps) {
    return (
        <ErrorBoundaryUI
            error={error}
            reset={reset}
            title="Dashboard Tidak Dapat Dimuat"
            description="Terjadi kesalahan saat memuat dashboard Anda. Silakan muat ulang halaman atau coba beberapa saat lagi."
            fallbackLabel="Muat Ulang"
            fallbackHref="/dashboard"
            fallbackIcon={RefreshCw}
            category="buyer-dashboard"
        />
    );
}
