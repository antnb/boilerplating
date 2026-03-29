"use client";

import { ErrorBoundaryUI, type RouteErrorProps } from "@/components/error/ErrorBoundaryUI";
import { BookOpen } from "lucide-react";

/** Catches errors loading a knowledge article detail page */
export default function KnowledgeArticleError({ error, reset }: RouteErrorProps) {
    return (
        <ErrorBoundaryUI
            error={error}
            reset={reset}
            title="Artikel Tidak Dapat Dimuat"
            description="Terjadi kesalahan saat memuat artikel. Silakan coba lagi atau lihat artikel lainnya."
            fallbackLabel="Lihat Jurnal"
            fallbackHref="/knowledge"
            fallbackIcon={BookOpen}
            category="knowledge-detail"
        />
    );
}
