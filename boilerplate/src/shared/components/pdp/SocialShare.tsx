"use client";

import MaterialIcon from "./MaterialIcon";
import { useState } from "react";

export default function SocialShare() {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = "Lihat koleksi tanaman premium ini! 🌿";

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <aside className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative" aria-label="Bagikan produk">
            <div className="h-1 bg-gradient-to-r from-primary via-accent/50 to-transparent" />
            <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <MaterialIcon name="share" className="text-primary" size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            Komunitas
                        </span>
                        <h3 className="text-[15px] font-bold text-foreground mt-0.5">Bagikan Koleksi Ini</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto" role="group" aria-label="Opsi berbagi">
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <MaterialIcon name="chat" size={16} />
                        WhatsApp
                    </a>
                    <button
                        onClick={handleCopy}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${copied ? "bg-primary/10 text-primary border-primary/30" : "bg-background text-foreground border-border hover:border-primary/30 hover:shadow-sm"}`}
                        aria-live="polite"
                    >
                        <MaterialIcon name={copied ? "check" : "content_copy"} className={copied ? "text-primary" : ""} size={16} />
                        {copied ? "Tersalin!" : "Salin Link"}
                    </button>
                </div>
            </div>
        </aside>
    );
}
