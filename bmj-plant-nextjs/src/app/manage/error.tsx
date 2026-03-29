"use client";

import { ErrorBoundaryUI, type RouteErrorProps } from "@/components/error/ErrorBoundaryUI";
import { RefreshCw } from "lucide-react";

/** Admin/staff panel error boundary */
export default function ManageError({ error, reset }: RouteErrorProps) {
    return (
        <ErrorBoundaryUI
            error={error}
            reset={reset}
            title="Panel Admin Bermasalah"
            description="Terjadi kesalahan pada panel administrasi. Silakan muat ulang atau hubungi tim teknis jika masalah berlanjut."
            fallbackLabel="Muat Ulang Panel"
            fallbackHref="/manage"
            fallbackIcon={RefreshCw}
            category="admin-panel"
        />
    );
}
