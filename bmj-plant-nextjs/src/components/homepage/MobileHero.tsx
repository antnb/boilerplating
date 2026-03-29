import Link from "next/link";
import Image from "next/image";
/* ═══════════════════════════════════════════════════════════
   MobileHero — Independent phone-only hero component

   Rendered at ≤767px (md:hidden), hidden at ≥768px.
   Completely independent from HeroBento — own HTML structure,
   own CSS (mobile-hero.css), own data rendering.

   Data: reuses HeroBentoData + TrustStripData schemas.
   Nav: NOT included — global navbar (Navbar.tsx) handles it.
   ═══════════════════════════════════════════════════════════ */

import type { HeroBentoData } from "@/lib/schemas/homepage-sections";
import type { TrustStripData } from "@/lib/schemas/homepage-sections";

import "@/mobile-hero.css";

interface MobileHeroProps {
    data?: HeroBentoData;
    trustStripData?: TrustStripData;
    className?: string;
}

const defaultTrustPills = [
    { icon: "verified", label: "Keaslian Terjamin" },
    { icon: "local_shipping", label: "Pengiriman Aman" },
    { icon: "support_agent", label: "Dukungan Ahli 7 Hari" },
    { icon: "workspace_premium", label: "Kualitas Premium" },
    { icon: "autorenew", label: "Garansi Tanaman Hidup" },
];

export function MobileHero({ data, trustStripData, className }: MobileHeroProps) {
    const heading = data?.heading ?? "Bumi Mekarsari Jaya";
    const badge = data?.badge ?? "Spesialis Tanaman Hias Langka";
    const description =
        data?.description ??
        "Sourcing rare botanical specimens for discerning collectors and architectural landscapes.";
    const backgroundImage =
        data?.backgroundImage ?? "/images/homepage/hero-greenhouse.jpg";
    const ctaPrimaryLabel = data?.ctaPrimaryLabel ?? "Jelajahi Koleksi";
    const ctaPrimaryHref = data?.ctaPrimaryHref ?? "/product";
    const ctaSecondaryLabel = data?.ctaSecondaryLabel ?? "Untuk Bisnis/Grosir";
    const ctaSecondaryHref = data?.ctaSecondaryHref ?? "/layanan";

    const trustPills = trustStripData?.pills ?? defaultTrustPills;

    // Split heading into lines for mobile display (Bumi / Mekarsari / Jaya.)
    const headingWords = heading.split(" ");

    return (
        <section id="mobile-hero" className={className} aria-label="Hero">
            {/* ── Background ── */}
            <div className="mhero__bg">
                <Image
                    src={backgroundImage}
                    alt="BMJ Greenhouse"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </div>
            <div className="mhero__overlay" />

            {/* ── Body ── */}
            <div className="mhero__body">
                {/* Copy block — optically centered */}
                <div className="mhero__copy">
                    <div className="mhero__copy-inner">
                        <span className="mhero__badge">{badge}</span>
                        <h1 className="mhero__heading">
                            {headingWords.map((word, i) => (
                                <span key={i}>
                                    {word}
                                    {i < headingWords.length - 1 ? (
                                        <>
                                            <br />
                                        </>
                                    ) : (
                                        "."
                                    )}
                                </span>
                            ))}
                        </h1>
                        <p className="mhero__desc">{description}</p>
                    </div>
                </div>

                {/* Bottom: CTA + Trust */}
                <div className="mhero__bottom">
                    <div className="mhero__cta">
                        <Link href={ctaPrimaryHref} className="mhero__btn-primary">
                            {ctaPrimaryLabel}
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 16 }}
                            >
                                trending_flat
                            </span>
                        </Link>
                        <Link href={ctaSecondaryHref} className="mhero__btn-secondary">
                            {ctaSecondaryLabel}
                        </Link>
                    </div>
                    <div className="mhero__trust">
                        {trustPills.map((pill) => (
                            <div key={pill.icon} className="mhero__trust-item">
                                <span className="material-symbols-outlined mhero__trust-icon">
                                    {pill.icon}
                                </span>
                                <span className="mhero__trust-label">
                                    {pill.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
