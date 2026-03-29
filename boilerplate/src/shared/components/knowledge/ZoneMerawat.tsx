import type { KnowledgeZoneMerawatData } from "@/shared/lib/schemas/knowledge-sections";

type Props = { data?: KnowledgeZoneMerawatData };

export function ZoneMerawat({ data }: Props) {
    const sectionNumber = data?.sectionNumber ?? "03.";
    const sectionTitle = data?.sectionTitle ?? "Merawat";
    const sectionSubtitle = data?.sectionSubtitle ?? "Care Database";
    const mobileSubtitle = data?.mobileSubtitle ?? "The Care Dashboard";
    const careCategories = data?.careCategories ?? [
        { icon: "water_drop", title: "Water", subtitle: "Teknik Penyiraman", count: 12 },
        { icon: "wb_sunny", title: "Light", subtitle: "Kebutuhan Cahaya", count: 8 },
        { icon: "science", title: "Soil", subtitle: "Nutrisi & Pupuk", count: 15 },
        { icon: "bug_report", title: "Pests", subtitle: "Hama & Penyakit", count: 6 },
    ];

    return (
        <section className="bg-brand-bg py-8 md:py-16 px-4 md:px-0 relative overflow-hidden" id="merawat">
            <div className="container-page relative z-10">
                {/* Mobile header */}
                <div className="md:hidden flex flex-col gap-1 mb-6 pl-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-serif italic text-foreground/20">{sectionNumber}</span>
                        <h2 className="text-xl font-serif text-foreground">{sectionTitle}</h2>
                    </div>
                    <span className="text-xs font-sans font-light text-muted-foreground block uppercase tracking-widest pl-[2.2rem]">
                        {mobileSubtitle}
                    </span>
                </div>

                {/* Desktop header */}
                <div className="hidden md:block mb-6">
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-serif italic text-foreground/20">{sectionNumber}</span>
                        <h2 className="text-2xl font-serif text-foreground">{sectionTitle}</h2>
                    </div>
                    <span className="text-2xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-10">{sectionSubtitle}</span>
                </div>

                {/* Desktop: cards grid */}
                <div className="hidden md:block bg-muted rounded-2xl p-8">
                    <div className="grid grid-cols-2 gap-6">
                        {careCategories.map((cat, i) => (
                            <a
                                key={i}
                                href="#"
                                className="bg-card rounded-xl p-5 flex items-start gap-4 hover:shadow-hover transition-shadow group border border-border"
                            >
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                                </div>
                                <div>
                                    <h4 className="font-serif text-base text-foreground mb-1">{cat.subtitle}</h4>
                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                                        Panduan lengkap {cat.subtitle.toLowerCase()} untuk tanaman tropis Anda.
                                    </p>
                                    <span className="text-2xs text-muted-foreground font-bold mt-2 inline-flex items-center gap-1 group-hover:text-accent transition-colors">
                                        {cat.count} artikel
                                        <span className="material-symbols-outlined text-2xs transform group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Mobile: compact icon grid */}
                <div className="md:hidden grid grid-cols-2 gap-3">
                    {careCategories.map((cat, i) => (
                        <a
                            key={i}
                            href="#"
                            className="bg-card rounded-xl p-4 flex flex-col items-center text-center aspect-square justify-center shadow-soft border border-border hover:border-foreground transition-all group"
                        >
                            <span className="material-symbols-outlined text-foreground text-3xl mb-2">{cat.icon}</span>
                            <h4 className="font-serif text-foreground text-sm mb-1">{cat.title}</h4>
                            <div className="flex items-center gap-1 text-2xs text-muted-foreground font-medium mt-1 group-hover:text-accent transition-colors">
                                {cat.count} artikel
                                <span className="material-symbols-outlined text-2xs transform group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
