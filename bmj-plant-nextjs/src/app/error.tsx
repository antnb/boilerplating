"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // TODO: Log to error reporting service (Sentry, etc.)
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-3">
                    Terjadi Kesalahan
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    Maaf, terjadi kesalahan saat memuat halaman ini.
                    Silakan coba lagi atau kembali ke beranda.
                </p>
                {error.digest && (
                    <p className="text-xs text-muted-foreground/60 mb-4 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button onClick={reset} size="lg">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Coba Lagi
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Ke Beranda
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
