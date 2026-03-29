"use client";

import { useEffect, useState, useCallback } from "react";
import type { OverviewStickyNavData } from "@/lib/schemas/overview-sections";

type Props = { data?: OverviewStickyNavData };

const DEFAULT_NAV = [
    { id: "tentang", label: "Beranda" },
    { id: "tentang-kami", label: "Overview" },
    { id: "jaringan", label: "Jaringan" },
    { id: "galeri", label: "Galeri" },
    { id: "logistik", label: "Logistik" },
    { id: "kontak", label: "Kontak" },
];

export function OverviewStickyNav({ data }: Props) {
    const NAV_ITEMS = data?.items ?? DEFAULT_NAV;
    const [activeId, setActiveId] = useState<string>("tentang");

    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY + 160;
        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
            const el = document.getElementById(NAV_ITEMS[i].id);
            if (el && el.offsetTop <= scrollY) {
                setActiveId(NAV_ITEMS[i].id);
                return;
            }
        }
        setActiveId(NAV_ITEMS[0].id);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    return (
        <nav
            className="border-y border-border bg-gradient-to-b from-card to-card/80 backdrop-blur-sm"
            aria-label="Navigasi halaman overview"
        >
            <div className="w-full max-w-[var(--content-max-w)] mx-auto px-[var(--content-pad-x)]">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 touch-pan-x lg:justify-center lg:gap-3" style={{ WebkitOverflowScrolling: "touch" }}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs lg:text-sm font-medium border transition-all duration-200 ${
                                activeId === item.id
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                            }`}
                            aria-current={activeId === item.id ? "true" : undefined}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
