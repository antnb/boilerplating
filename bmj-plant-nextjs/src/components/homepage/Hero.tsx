import Link from "next/link";
import Image from "next/image";
/* ═══════════════════════════════════════════════════════════
   Hero — Unified responsive hero (Server Component, 0 JS)

   Phone (≤767px): fullscreen vertical layout, trust pills inline
   Desktop (≥768px): 2-col grid, featured specimen card, trending tags

   Replaces: MobileHero + HeroBento (merged into one component)
   CSS: hero.css (dedicated responsive stylesheet)
   ═══════════════════════════════════════════════════════════ */

import type { HeroBentoData } from "@/lib/schemas/homepage-sections";
import type { TrustStripData } from "@/lib/schemas/homepage-sections";

import "@/hero.css";

type Props = {
    data?: HeroBentoData;
    trustStripData?: TrustStripData;
    children?: React.ReactNode;
    className?: string;
};

const defaultTrustPills = [
    { icon: "verified", label: "Keaslian Terjamin", subtitle: "Sertifikat keaslian setiap spesimen" },
    { icon: "local_shipping", label: "Pengiriman Aman", subtitle: "Packaging khusus tanaman hidup" },
    { icon: "support_agent", label: "Dukungan Ahli 7 Hari", subtitle: "Konsultasi perawatan pasca pembelian" },
    { icon: "workspace_premium", label: "Kualitas Premium", subtitle: "Dipilih oleh ahli hortikultural" },
    { icon: "autorenew", label: "Garansi Tanaman Hidup", subtitle: "Kami ganti jika tidak survive perjalanan" },
];

export function Hero({ data, trustStripData, children, className }: Props) {
    const heading = data?.heading ?? "Bumi Mekarsari Jaya";
    const badge = data?.badge ?? "Spesialis Tanaman Hias Langka";
    const description =
        data?.description ??
        "Spesimen tanaman hias langka berkualitas ekspor — untuk kolektor pribadi maupun kebutuhan proyek lansekap komersial.";
    const backgroundImage =
        data?.backgroundImage ?? "/images/homepage/hero-greenhouse.jpg";
    const trendingTags = data?.trendingTags ?? ["Variegated", "Large Form", "Rare Aroids"];
    const ctaPrimaryLabel = data?.ctaPrimaryLabel ?? "Jelajahi Koleksi";
    const ctaPrimaryHref = data?.ctaPrimaryHref ?? "/product";
    const ctaSecondaryLabel = data?.ctaSecondaryLabel ?? "Untuk Bisnis/Grosir";
    const ctaSecondaryHref = data?.ctaSecondaryHref ?? "/layanan";

    const trustPills = trustStripData?.pills ?? defaultTrustPills;

    // Split heading into words for mobile line-break display
    const headingWords = heading.split(" ");

    return (
        <section id="hero" aria-label="Hero" className={className}>
            {/* ── Background ── */}
            <div className="hero__bg">
                <Image
                    src={(backgroundImage as any)?.src || backgroundImage}
                    alt="BMJ Greenhouse"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </div>
            <div className="hero__overlay" />

            {/* ── Body: wraps all z-content above overlay ──
                 Phone: flex column, copy centered, bottom anchored
                 Desktop: grid 2-col layout ── */}
            <div className="hero__body">

                {/* ── Copy block: badge + heading + desc ── */}
                <div className="hero__copy">
                    <div className="hero__copy-inner">
                        <span className="hero__badge">
                            <span className="material-symbols-outlined hero__badge-icon">eco</span>
                            {badge}
                        </span>

                        <h1 className="hero__heading">
                            {/* Phone: word-per-line with br */}
                            <span className="hero__heading-mobile">
                                {headingWords.map((word, i) => (
                                    <span key={i}>
                                        {word}
                                        {i < headingWords.length - 1 ? <br /> : "."}
                                    </span>
                                ))}
                            </span>
                            {/* Desktop: single line */}
                            <span className="hero__heading-desktop">{heading}</span>
                        </h1>

                        <p className="hero__desc">{description}</p>
                    </div>

                    {/* Trending tags — desktop only (inside copy for grid layout) */}
                    <div className="hero__trending">
                        <span className="hero__trending-label">TRENDING:</span>
                        {trendingTags.map((tag, i) => (
                            <span key={tag}>
                                {i > 0 && <span className="hero__trending-sep">, </span>}
                                <a href="#" className="hero__trending-tag">{tag}</a>
                            </span>
                        ))}
                    </div>
                </div>


                {/* ── Bottom: CTA buttons + Trust (phone only) ──
                     On phone: anchored to bottom of body
                     On desktop: CTAs are inline inside copy column ── */}
                <div className="hero__bottom">
                    <div className="hero__cta">
                        <Link href={ctaPrimaryHref} className="hero__btn-primary">
                            <span className="material-symbols-outlined hero__btn-icon">eco</span>
                            {ctaPrimaryLabel}
                            <span className="material-symbols-outlined hero__btn-arrow">trending_flat</span>
                        </Link>
                        <Link href={ctaSecondaryHref} className="hero__btn-secondary">
                            {ctaSecondaryLabel}
                        </Link>
                    </div>

                    {/* Phone Trust Pills — glassmorphism bar */}
                    <div className="hero__trust-mobile">
                        {trustPills.map((pill) => (
                            <div key={pill.icon} className="hero__trust-item">
                                <span className="material-symbols-outlined hero__trust-icon">
                                    {pill.icon}
                                </span>
                                <span className="hero__trust-label">
                                    {pill.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Desktop Trust Strip — injected as children ── */}
            {children}
        </section>
    );
}
