"use client";

import Link from "next/link";
import Image from "next/image";
import nurseryMainImport from "@/shared/assets/images/nursery-main.webp";

const nurseryMain = (nurseryMainImport as any).src || nurseryMainImport;

export type ProductHeroData = {
    badge: string;
    heading: string;
    description: string;
    searchPlaceholder: string;
    ctaText: string;
    trendingLabel: string;
    trendingLinks: { label: string; href: string }[];
    backgroundImage: string;
};

/**
 * ShopHero — V5 Final (Single Background, HeroBento-style)
 *
 * Full-bleed background image + dark overlay + centered content.
 * Follows HeroBento pattern exactly: hero__bg → hero__overlay → hero__content.
 * Root wrapper preserved: div.w-full.bg-brand-bg.container-page
 */

type Props = { data?: Record<string, unknown> };

const DEFAULTS: ProductHeroData = {
    badge: "Edisi Kolektor 2026",
    heading: "Eksplorasi Botani Premium",
    description: "Katalog eksklusif Philodendron, Monstera, dan Aroid langka. Dirawat pakar untuk memastikan genetik terbaik.",
    searchPlaceholder: "Cari koleksi tanaman...",
    ctaText: "Cari",
    trendingLabel: "Pencarian Populer:",
    trendingLinks: [
        { label: "Monstera Albo", href: "/product?q=monstera+albo" },
        { label: "Philodendron SS", href: "/product?q=philodendron+ss" },
        { label: "Daun Langka", href: "/product?q=daun+langka" },
        { label: "Terarium", href: "/product?q=terarium" },
        { label: "Tanaman Hias", href: "/product?q=tanaman+hias" },
    ],
    backgroundImage: nurseryMain,
};

export default function ShopHero({ data }: Props) {
    const d = { ...DEFAULTS, ...data } as ProductHeroData;

    return (
        <div className="w-full bg-brand-bg container-page">
            <section id="product-hero" aria-labelledby="product-hero-title">
                {/* ── Full-bleed Background (HeroBento pattern) ── */}
                <div className="hero__bg" aria-hidden="true">
                    <Image
                        src={(d.backgroundImage as any).src || d.backgroundImage}
                        alt="Botanical Catalog"
                        fill
                        className="object-cover object-center"
                        priority
                        sizes="100vw"
                    />
                </div>
                <div className="hero__overlay" />

                {/* ── Content ── */}
                <div className="hero__content">
                    {/* Badge */}
                    <span className="hero__badge">
                        <span className="material-symbols-outlined text-sm">eco</span>
                        {d.badge}
                    </span>

                    {/* H1 */}
                    <h1 id="product-hero-title" className="hero__heading">
                        {d.heading}
                    </h1>

                    {/* Description */}
                    <p className="hero__desc">{d.description}</p>

                    {/* Search Bar */}
                    <form className="hero__search" role="search" action="/product">
                        <input
                            type="search"
                            name="q"
                            className="hero__search-input"
                            placeholder={d.searchPlaceholder}
                            aria-label="Cari tanaman"
                        />
                        <button type="submit" className="hero__search-cta">
                            <span className="material-symbols-outlined text-xl">search</span>
                            {d.ctaText}
                        </button>
                    </form>

                    {/* Trending Links */}
                    <div className="hero__trending">
                        <span className="hero__trending-label">{d.trendingLabel}</span>
                        {d.trendingLinks.map((link: { label: string; href: string }, i: number) => (
                            <span key={link.label} className="hero__trending-item">
                                {i > 0 && <span className="hero__trending-sep">·</span>}
                                <Link href={link.href} className="hero__trending-link">
                                    {link.label}
                                </Link>
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
