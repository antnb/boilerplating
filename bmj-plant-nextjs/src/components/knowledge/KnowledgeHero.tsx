import Image from "next/image";
import type { KnowledgeHeroData } from "@/lib/schemas/knowledge-sections";
import greenhouseImg from "@/assets/images/greenhouse-interior.webp";
import "@/hero.css";

type Props = { data?: KnowledgeHeroData };

export function KnowledgeHero({ data }: Props) {
    const badge1 = data?.badge1 ?? "BMJ Authority Index";
    const badge2 = data?.badge2 ?? "Verified by Experts";
    const headingLine1 = data?.headingLine1 ?? "Pusat Otoritas";
    const headingLine2 = data?.headingLine2 ?? "Botani Cipanas";
    const description = data?.description ?? "Panduan lengkap perawatan, identifikasi spesies, dan teknik budidaya dari ahli hortikultura bersertifikat.";
    const heroImage = data?.heroImage ?? greenhouseImg;
    const heroImageAlt = data?.heroImageAlt ?? "Interior greenhouse profesional BMJ Nursery di dataran tinggi Cipanas";
    const searchPlaceholder = data?.searchPlaceholder ?? "Cari panduan...";
    const statNumber = data?.statNumber ?? "2.4k+";
    const statLabel = data?.statLabel ?? "Artikel Terkurasi";

    return (
        <section id="hero" aria-label="Knowledge Hero" style={{ minHeight: "auto" }}>
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
                        {/* Badges */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="hero__badge">
                                <span className="material-symbols-outlined hero__badge-icon">menu_book</span>
                                {badge1}
                            </span>
                            <span className="hero__badge hidden md:inline-flex">
                                <span className="material-symbols-outlined hero__badge-icon">verified</span>
                                {badge2}
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="hero__heading">
                            <span className="hero__heading-mobile">
                                {headingLine1}<br />{headingLine2}
                            </span>
                            <span className="hero__heading-desktop">
                                {headingLine1} {headingLine2}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="hero__desc">{description}</p>
                    </div>
                </div>

                {/* Bottom: Search + Stat */}
                <div className="hero__bottom">
                    {/* Search bar */}
                    <form className="relative w-full max-w-md" role="search" action="/knowledge">
                        <input
                            type="search"
                            name="q"
                            placeholder={searchPlaceholder}
                            className="w-full bg-white/10 border border-white/20 rounded-full h-[48px] pl-5 pr-12 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[var(--color-brand-accent)] focus:ring-1 focus:ring-[var(--color-brand-accent)] transition-all backdrop-blur-sm"
                            aria-label="Cari panduan di Knowledge Hub"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1.5 w-9 h-9 flex items-center justify-center bg-[var(--color-brand-accent)] rounded-full text-[var(--color-brand-dark)]"
                            aria-label="Cari"
                        >
                            <span className="material-symbols-outlined text-lg">search</span>
                        </button>
                    </form>

                    {/* Stat pill */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[var(--color-brand-accent)] text-lg">menu_book</span>
                        </div>
                        <div>
                            <p className="text-xl font-serif font-bold text-white leading-none">{statNumber}</p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-white/45 font-bold mt-0.5">{statLabel}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
