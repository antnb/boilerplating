"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export interface RouteErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

interface ErrorBoundaryUIProps extends RouteErrorProps {
    /** Heading text shown to user */
    title?: string;
    /** Description text explaining what went wrong */
    description?: string;
    /** Label for the fallback navigation button */
    fallbackLabel?: string;
    /** URL for the fallback navigation */
    fallbackHref?: string;
    /** Icon component for the fallback button */
    fallbackIcon?: typeof Home;
    /** Error category for logging — helps identify which boundary caught it */
    category?: string;
}

/**
 * Shared error boundary UI component.
 * Used by all route-segment error.tsx files to avoid code duplication.
 *
 * Architecture: Each route-segment error.tsx is a thin wrapper that passes
 * route-specific props (title, description, fallback link) to this component.
 * This ensures consistent error UX across the app while keeping each
 * error.tsx file minimal and focused on its route context.
 */
export function ErrorBoundaryUI({
    error,
    reset,
    title = "Terjadi Kesalahan",
    description = "Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.",
    fallbackLabel = "Ke Beranda",
    fallbackHref = "/",
    fallbackIcon: FallbackIcon = Home,
    category = "unknown",
}: ErrorBoundaryUIProps) {
    useEffect(() => {
        // TODO: Replace with real error reporting (Sentry, etc.)
        console.error(`[${category}] Error boundary caught:`, error);
    }, [error, category]);

    return (
        <div className="container-page py-20 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <h2 className="font-serif text-xl font-bold mb-2">{title}</h2>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {description}
                </p>
                {error.digest && (
                    <p className="text-xs text-muted-foreground/50 mb-4 font-mono">
                        Ref: {error.digest}
                    </p>
                )}
                <div className="flex gap-3 justify-center">
                    <Button onClick={reset} size="sm">
                        <RefreshCw className="w-4 h-4 mr-1.5" />
                        Coba Lagi
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link href={fallbackHref}>
                            <FallbackIcon className="w-4 h-4 mr-1.5" />
                            {fallbackLabel}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
