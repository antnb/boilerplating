"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * SearchStrip — Premium search hero for plant e-commerce
 *
 * Redesigned as the primary product discovery entry point.
 * Features: rich visual treatment, category quick-filters,
 * popular search suggestions, and result count context.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import searchBg from "@/assets/images/search-strip-bg.webp";

const POPULAR_SEARCHES = [
    { label: "Monstera", icon: "eco", href: "/product?q=monstera" },
    { label: "Philodendron", icon: "nest_eco_leaf", href: "/product?q=philodendron" },
    { label: "Alocasia", icon: "spa", href: "/product?q=alocasia" },
    { label: "Variegated", icon: "auto_awesome", href: "/product?q=variegated" },
    { label: "Rare Aroids", icon: "diamond", href: "/product?q=rare+aroids" },
];

const QUICK_CATEGORIES = [
    { label: "🌿 Indoor", href: "/product?q=indoor" },
    { label: "🌳 Outdoor", href: "/product?q=outdoor" },
    { label: "✨ Variegated", href: "/product?q=variegated" },
    { label: "🏆 Koleksi Langka", href: "/product?q=rare" },
    { label: "🎁 Gift Ready", href: "/product?q=gift" },
];

interface SearchStripProps {
    defaultValue?: string;
    totalCount?: number;
}

export default function SearchStrip({ defaultValue = "", totalCount }: SearchStripProps) {
    const router = useRouter();
    const [query, setQuery] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setQuery(defaultValue);
    }, [defaultValue]);

    const handleClear = () => {
        setQuery("");
        router.push("/product");
        inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/product?q=${encodeURIComponent(query.trim())}`);
            inputRef.current?.blur();
        }
    };

    return (
        <section id="search-strip" aria-label="Cari tanaman hias">
            {/* Background image */}
            <Image src={(searchBg as any).src || searchBg} alt="" className="search-strip__bg-img" aria-hidden fill sizes="100vw" priority />
            {/* Dark overlay for readability */}
            <div className="search-strip__bg-overlay" aria-hidden="true" />
            {/* Decorative accent glow */}
            <div className="search-strip__bg-pattern" aria-hidden="true" />

            <div className="search-strip__inner">
                {/* Headline */}
                <div className="search-strip__headline">
                    <h2 className="search-strip__title">
                        Temukan Tanaman <span className="search-strip__title-accent">Impian</span> Anda
                    </h2>
                    <p className="search-strip__subtitle">
                        {totalCount
                            ? `Jelajahi ${totalCount}+ spesimen pilihan dari kebun Cipanas`
                            : "Koleksi tanaman hias langka & premium dari petani terpercaya"
                        }
                    </p>
                </div>

                {/* Search Input */}
                <form className="search-strip__form" role="search" onSubmit={handleSubmit}>
                    <div className={`search-strip__input-wrap ${isFocused ? "search-strip__input-wrap--focused" : ""}`}>
                        <span className="material-symbols-outlined search-strip__search-icon">search</span>
                        <input
                            ref={inputRef}
                            className="search-strip__input"
                            type="text"
                            name="q"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Cari nama tanaman, genus, atau kategori..."
                            aria-label="Cari tanaman"
                            autoComplete="off"
                        />
                        <AnimatePresence>
                            {query && (
                                <motion.button
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={handleClear}
                                    className="search-strip__clear-btn"
                                    aria-label="Hapus pencarian"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <button type="submit" className="search-strip__btn" aria-label="Cari">
                            <span className="material-symbols-outlined text-lg">search</span>
                            <span className="search-strip__btn-label">Cari</span>
                        </button>
                    </div>
                </form>

                {/* Active search indicator */}
                {defaultValue && (
                    <motion.div
                        className="search-strip__active-search"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="material-symbols-outlined text-sm">filter_alt</span>
                        <span>Menampilkan hasil untuk <strong>"{defaultValue}"</strong></span>
                        <button onClick={handleClear} className="search-strip__active-clear">
                            <span className="material-symbols-outlined text-xs">close</span>
                            Reset
                        </button>
                    </motion.div>
                )}

                {/* Quick Category Pills */}
                {!defaultValue && (
                    <div className="search-strip__categories">
                        {QUICK_CATEGORIES.map((cat) => (
                            <Link key={cat.label} href={cat.href} className="search-strip__cat-pill">
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Popular Searches */}
                {!defaultValue && (
                    <div className="search-strip__popular">
                        <span className="search-strip__popular-label">
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            Populer
                        </span>
                        {POPULAR_SEARCHES.map((s) => (
                            <Link key={s.label} href={s.href} className="search-strip__popular-tag">
                                <span className="material-symbols-outlined text-xs">{s.icon}</span>
                                {s.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
