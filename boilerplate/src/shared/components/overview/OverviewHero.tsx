import Image from "next/image";
import type { OverviewHeroData } from '@/shared/lib/schemas/overview-sections';
import "@/shared/hero.css";

type Props = { data?: OverviewHeroData };

export function OverviewHero({ data }: Props) {
    const nibBadge = data?.nibBadge ?? 'NIB: 0712240010385';
    const headingPrefix = data?.headingPrefix ?? 'PT Bumi Mekarsari Jaya:';
    const headingAccent = data?.headingAccent ?? 'Jaringan Supplier';
    const headingSuffix = data?.headingSuffix ?? 'Tanaman Nusantara';
    const trustBadge1 = data?.trustBadge1 ?? 'Legalitas Resmi';
    const trustBadge2 = data?.trustBadge2 ?? 'Bibit Unggul';
    const heroImage = data?.heroImage ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9l2EcOIrirbeRTMe9Yo7yCOcFNMf-tVCC_qhtN20lqVpjw0kkyhBCoqMOhFtxJzoDa0hGpB5VUtmd0GMjES6h5Id4drUj0HhBNl4_dzWzDOO5ZoWgZZklhHyAZ3UliFpm42zFrsAgkzOAWDJ-voto9moh4-PCXt3bFWCfzhrLaIInEbV10SasoCJgYcyDMSigJUf-fLsY1v3tz5GWbIOss6B0ifnWbhbAXavqVPrnR4vW978jSTz1dcMbtx7rflkE57S1Muszg10';
    const heroImageAlt = data?.heroImageAlt ?? 'Nursery tanaman hias PT Bumi Mekarsari Jaya di Cipanas';
    const heroQuote = data?.heroQuote ?? '"Mitra Tumbuh Bersama Alam"';

    return (
        <section id="hero" aria-label="Overview Hero" style={{ minHeight: "auto" }}>
            {/* ── Background ── */}
            <div className="hero__bg" aria-hidden="true">
                <Image
                    src={heroImage}
                    alt={heroImageAlt}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </div>
            <div className="hero__overlay" />

            {/* ── Body ── */}
            <div className="hero__body" style={{ paddingBottom: 48 }}>
                <div className="hero__copy">
                    <div className="hero__copy-inner">
                        {/* NIB Badge */}
                        <span className="hero__badge">
                            <span className="material-symbols-outlined hero__badge-icon">verified</span>
                            {nibBadge}
                        </span>

                        {/* Heading */}
                        <h1 className="hero__heading">
                            <span className="hero__heading-mobile">
                                {headingPrefix}<br />
                                <span className="text-[var(--color-brand-accent)] italic">{headingAccent}</span><br />
                                {headingSuffix}
                            </span>
                            <span className="hero__heading-desktop">
                                {headingPrefix}{' '}
                                <span className="text-[var(--color-brand-accent)] italic">{headingAccent}</span>{' '}
                                {headingSuffix}
                            </span>
                        </h1>

                        {/* Quote */}
                        <p className="hero__desc italic font-serif text-base md:text-lg">
                            {heroQuote}
                        </p>
                    </div>
                </div>

                {/* Trust badges at bottom */}
                <div className="flex items-center gap-6 text-white/60 text-xs">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[var(--color-brand-accent)] text-sm">verified</span>
                        {trustBadge1}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[var(--color-brand-accent)] text-sm">spa</span>
                        {trustBadge2}
                    </span>
                </div>
            </div>
        </section>
    );
}
