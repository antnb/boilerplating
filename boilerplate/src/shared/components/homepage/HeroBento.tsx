import Link from "next/link";
import Image from "next/image";
import type { HeroBentoData } from "@/shared/lib/schemas/homepage-sections";

type Props = { data?: HeroBentoData; children?: React.ReactNode; className?: string };

/* ═══════════════════════════════════════════════════════════
   Hero Section — Full-bleed layout with Featured Specimen

   Desktop: full-width greenhouse bg, 2-col content (copy + card)
   Mobile: stacked — copy on top, card below
   Children slot: used to inject TrustStrip inside this section
   ═══════════════════════════════════════════════════════════ */

export function HeroBento({ data, children, className }: Props) {
    const heading = data?.heading ?? "Bumi Mekarsari Jaya";
    const badge = data?.badge ?? "Spesialis Tanaman Hias Langka";
    const description = data?.description ?? "Sourcing rare botanical specimens for discerning collectors and architectural landscapes worldwide.";
    const backgroundImage = data?.backgroundImage ?? "/images/homepage/hero-greenhouse.jpg";
    const trendingTags = data?.trendingTags ?? ["Variegated", "Large Form", "Rare Aroids"];
    const ctaPrimaryLabel = data?.ctaPrimaryLabel ?? "Jelajahi Koleksi";
    const ctaPrimaryHref = data?.ctaPrimaryHref ?? "/product";
    const ctaSecondaryLabel = data?.ctaSecondaryLabel ?? "Untuk Bisnis/Grosir";
    const ctaSecondaryHref = data?.ctaSecondaryHref ?? "/layanan";
    const featuredPlantName = data?.featuredPlantName ?? "Monstera Albo";
    const featuredPlantPrice = data?.featuredPlantPrice ?? "IDR 3.8jt";
    const featuredPlantImage = data?.featuredPlantImage ?? "/images/plants/IMG-20250703-WA0007.jpg";
    const featuredPlantHref = data?.featuredPlantHref ?? "/product";

    return (
        <section id="hero-bento" aria-label="Hero" className={className}>
            {/* ── Full-bleed Background ── */}
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

            {/* ── Content: 2-col layout ── */}
            <div className="hero__content">
                {/* Left: Copy + CTA */}
                <div className="hero__left">
                    <span className="hero__badge">
                        <span className="material-symbols-outlined hero__badge-icon">eco</span>
                        {badge}
                    </span>
                    <h1 className="hero__heading">{heading}</h1>
                    <p className="hero__description">{description}</p>

                    <div className="hero__cta">
                        <Link href={ctaPrimaryHref} className="hero__btn-primary">
                            <span className="material-symbols-outlined">eco</span>
                            {ctaPrimaryLabel}
                        </Link>
                        <Link href={ctaSecondaryHref} className="hero__btn-secondary">
                            {ctaSecondaryLabel}
                        </Link>
                    </div>

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

                {/* Right: Featured Specimen Card */}
                <div className="hero__right">
                    <div className="featured-card">
                        <p className="featured-card__label">Featured Specimen</p>
                        <div className="featured-card__image">
                            <Image
                                src={(featuredPlantImage as any)?.src || featuredPlantImage}
                                alt={featuredPlantName}
                                fill
                                className="object-cover"
                                sizes="200px"
                            />
                        </div>
                        <Link href={featuredPlantHref} className="featured-card__shop-btn">
                            Shop Now
                        </Link>
                        <div className="featured-card__footer">
                            <span className="featured-card__name">{featuredPlantName}</span>
                            <span className="featured-card__price">{featuredPlantPrice}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Trust Strip (injected as children) ── */}
            {children}
        </section>
    );
}
