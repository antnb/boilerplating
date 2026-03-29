"use client";

/**
 * Global Error Boundary — catches errors in the ROOT layout itself.
 * Must provide its own <html> and <body> since root layout may be broken.
 * Uses inline styles only (CSS may not be available).
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="id">
            <body style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, backgroundColor: "#fafafa" }}>
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        textAlign: "center",
                    }}
                >
                    <div style={{ maxWidth: "28rem" }}>
                        <div
                            style={{
                                width: "4rem",
                                height: "4rem",
                                margin: "0 auto 1.5rem",
                                borderRadius: "50%",
                                backgroundColor: "#fef2f2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.5rem",
                            }}
                        >
                            ⚠️
                        </div>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem", color: "#111" }}>
                            Terjadi Kesalahan Sistem
                        </h1>
                        <p style={{ color: "#666", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                            Mohon maaf, terjadi kesalahan yang tidak terduga pada aplikasi.
                            Silakan muat ulang halaman.
                        </p>
                        {error.digest && (
                            <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "1rem", fontFamily: "monospace" }}>
                                Error ID: {error.digest}
                            </p>
                        )}
                        <button
                            onClick={reset}
                            style={{
                                padding: "0.75rem 2rem",
                                backgroundColor: "#16a34a",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: 600,
                            }}
                        >
                            Muat Ulang
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
