"use client";

import { useEffect, useRef, useState } from "react";
import type { KnowledgeCategoryNavData } from "@/lib/schemas/knowledge-sections";

type Props = { data?: KnowledgeCategoryNavData };

const defaultCategories = [
    { id: "mengenal", label: "Mengenal", icon: "psychiatry" },
    { id: "memilih", label: "Memilih", icon: "check_circle" },
    { id: "merawat", label: "Merawat", icon: "water_drop" },
    { id: "menggunakan", label: "Menggunakan", icon: "landscape" },
    { id: "tren", label: "Tren", icon: "trending_up" },
];

export function CategoryNav({ data }: Props) {
    const raw = data?.categories;
    const categories = raw
        ? raw.map((c: any) => ({
              id: c.id,
              label: c.title || c.label,
              icon: c.icon,
              count: c.count,
          }))
        : defaultCategories;

    const navRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = navRef.current;
        if (!el) return;

        // Small initial delay so animation is always visible even if already in viewport
        const timeout = setTimeout(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(el);

            // If already in viewport on mount, trigger after the delay
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setVisible(true);
                observer.disconnect();
            }

            return () => observer.disconnect();
        }, 300);

        return () => clearTimeout(timeout);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
            const navHeight = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    const BASE_DELAY = 0.15; // stagger start
    const STAGGER = 0.1;    // gap between each item

    return (
        <nav
            ref={navRef}
            className="border-y border-border bg-gradient-to-b from-card to-card/80 backdrop-blur-sm"
            aria-label="Knowledge categories"
        >
            <div className="w-full max-w-[var(--content-max-w)] mx-auto px-[var(--content-pad-x)]">
                {/* Desktop: full row with dividers */}
                <div className="hidden md:grid md:grid-cols-5 divide-x divide-border">
                    {categories.map((cat: any, i: number) => (
                        <a
                            key={cat.id}
                            href={`#${cat.id}`}
                            onClick={(e) => handleClick(e, cat.id)}
                            className="group flex flex-col items-center gap-1.5 py-5 px-4 hover:bg-accent/5 relative"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
                                transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${BASE_DELAY + i * STAGGER}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${BASE_DELAY + i * STAGGER}s`,
                            }}
                        >
                            <span className="material-symbols-outlined text-[22px] text-primary/70 group-hover:text-primary transition-colors">
                                {cat.icon}
                            </span>
                            <span className="text-sm font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                                {cat.label}
                            </span>
                            {cat.count != null && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {cat.count} artikel
                                </span>
                            )}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-2/3 bg-primary/60 rounded-full transition-all duration-300" />
                        </a>
                    ))}
                </div>

                {/* Mobile: horizontal scroll pills */}
                <div className="flex md:hidden items-center gap-2 overflow-x-auto scrollbar-hide py-3 -mx-1 px-1 touch-pan-x" style={{ WebkitOverflowScrolling: "touch" }}>
                    {categories.map((cat: any, i: number) => (
                        <a
                            key={cat.id}
                            href={`#${cat.id}`}
                            onClick={(e) => handleClick(e, cat.id)}
                            className="flex items-center gap-1.5 whitespace-nowrap pl-3 pr-4 py-2.5 rounded-full border border-border bg-card text-foreground text-sm shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-accent/5 shrink-0 group"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateX(0) scale(1)" : "translateX(24px) scale(0.9)",
                                transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${BASE_DELAY + i * STAGGER}s, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${BASE_DELAY + i * STAGGER}s`,
                            }}
                        >
                            <span className="material-symbols-outlined text-base text-primary/60 group-hover:text-primary transition-colors">
                                {cat.icon}
                            </span>
                            <span className="font-medium">{cat.label}</span>
                            {cat.count != null && (
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 ml-0.5">
                                    {cat.count}
                                </span>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}
