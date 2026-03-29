import Image from "next/image";
import "@/shared/hero.css";

type PortfolioStat = { value: string; label: string; icon: string };

type PortfolioHeroProps = {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    stats: PortfolioStat[];
};

export default function PortfolioHero({
    title,
    subtitle,
    description,
    backgroundImage,
    stats,
}: PortfolioHeroProps) {
    return (
        <section
            id="hero"
            aria-label="Portfolio Hero"
            style={{ minHeight: "auto" }}
        >
            {/* ── Background (hero.css pattern) ── */}
            <div className="hero__bg" aria-hidden="true">
                <Image
                    src={backgroundImage}
                    alt="BMJ Nursery landscape"
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
                        {/* Badge */}
                        <span className="hero__badge">
                            <span className="material-symbols-outlined hero__badge-icon">local_florist</span>
                            Kelompok Tani Cipanas
                        </span>

                        {/* Heading */}
                        <h1 className="hero__heading">
                            <span className="hero__heading-mobile">{title}</span>
                            <span className="hero__heading-desktop">{title}</span>
                        </h1>

                        {/* Subtitle as accent desc */}
                        <p className="text-[var(--color-brand-accent)] font-serif text-base md:text-lg italic">
                            {subtitle}
                        </p>

                        <p className="hero__desc">{description}</p>
                    </div>
                </div>

                {/* Stats bar — replaces CTA section */}
                <div className="flex flex-wrap gap-4 md:gap-8 border-t border-white/10 pt-5 mt-2">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                                <span className="material-symbols-outlined text-[var(--color-brand-accent)] text-lg md:text-xl">
                                    {stat.icon}
                                </span>
                            </div>
                            <div>
                                <p className="text-xl md:text-2xl font-serif font-bold text-white leading-none">
                                    {stat.value}
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.12em] text-white/45 font-bold mt-0.5">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
