import Link from "next/link";
import Image from "next/image";
import type { KnowledgeFeaturedData } from "@/lib/schemas/knowledge-sections";
import greenhouseImg from "@/assets/images/greenhouse-interior.webp";

type Props = { data?: KnowledgeFeaturedData };

export function FeaturedMagazine({ data }: Props) {
    const zoneLabel = data?.zoneLabel ?? "Zone 1";
    const zoneTitle = data?.zoneTitle ?? "Sorotan Panduan";
    const zoneSubtitle = data?.zoneSubtitle ?? "Koleksi panduan terkurasi dari tim editorial BMJ Nursery";
    const ctaText = data?.ctaText ?? "Lihat Semua";
    const ctaHref = data?.ctaHref ?? "/knowledge/all";
    const featuredImage = data?.featuredImage ?? greenhouseImg;
    const featuredImageAlt = data?.featuredImageAlt ?? "Taksonomi Araceae — panduan klasifikasi botani";
    const featuredBadge = data?.featuredBadge ?? "Editor's Choice";
    const featuredCategory = data?.featuredCategory ?? "🌿 Mengenal · Taksonomi";
    const featuredTitle = data?.featuredTitle ?? "Karakteristik Dasar Araceae: Panduan Klasifikasi Visual";
    const featuredDesc = data?.featuredDesc ?? "Dasar klasifikasi botani untuk identifikasi akurat famili Araceae, termasuk genus Monstera, Philodendron, dan Anthurium.";
    const featuredAuthorName = data?.featuredAuthorName ?? "Dr. Hartono S.";
    const featuredAuthorRole = data?.featuredAuthorRole ?? "Lead Horticulturalist · 8 min read";
    const sidebarArticles = data?.sidebarArticles ?? [
        { cat: "Memilih", title: "Teknik Menjaga Variegasi Stabil", img: greenhouseImg, time: "5 min" },
        { cat: "Merawat", title: "Komposisi Media Tanam Epiphytic", img: greenhouseImg, time: "6 min" },
        { cat: "Tren", title: "Hibridisasi Anthurium Dark Hybrid", img: greenhouseImg, time: "4 min" },
    ];

    return (
        <section className="hidden lg:block bg-brand-bg py-16 md:py-20">
            <div className="container-page">
                {/* Zone Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="text-xs font-bold text-foreground/30 uppercase tracking-[0.2em] block mb-2">
                            {zoneLabel}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif italic text-foreground leading-tight">
                            {zoneTitle}
                        </h2>
                        <p className="text-muted-foreground text-sm font-light mt-2 max-w-md">
                            {zoneSubtitle}
                        </p>
                    </div>
                    <a
                        href={ctaHref}
                        className="hidden md:inline-flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-widest hover:text-accent transition-colors"
                    >
                        {ctaText}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>

                {/* Content Grid: Featured (8) + Sidebar (4) */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Featured Article */}
                    <Link href="/knowledge/panduan-identifikasi-hybrid-philodendron" className="col-span-8 bg-card rounded-2xl overflow-hidden shadow-soft border border-border flex flex-row h-[500px] group">
                        <div className="relative w-1/2 overflow-hidden">
                            <Image
                                src={featuredImage}
                                alt={featuredImageAlt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="33vw"
                            />
                            <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded text-3xs font-bold uppercase tracking-widest shadow-sm">
                                {featuredBadge}
                            </span>
                        </div>
                        <div className="w-1/2 p-8 flex flex-col justify-center">
                            <span className="text-2xs font-bold text-accent uppercase tracking-[0.2em] mb-3">
                                {featuredCategory}
                            </span>
                            <h3 className="font-serif text-2xl text-foreground mb-3 leading-snug group-hover:text-accent transition-colors">
                                {featuredTitle}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                                {featuredDesc}
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-border">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-muted">
                                    <Image
                                        src={featuredImage}
                                        alt={featuredAuthorName}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <span className="text-2xs font-bold text-foreground/70 uppercase tracking-wide">{featuredAuthorName}</span>
                                    <span className="text-3xs text-muted-foreground block">{featuredAuthorRole}</span>
                                </div>
                                <span className="text-xs font-bold text-foreground uppercase tracking-wider group-hover:text-accent transition-colors flex items-center gap-1">
                                    Baca
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Sidebar: 3 compact cards */}
                    <div className="col-span-4 flex flex-col gap-5">
                        {sidebarArticles.map((item, i) => (
                            <article
                                key={i}
                                className="bg-card rounded-xl p-4 shadow-soft border border-border flex items-center gap-4 hover:shadow-hover transition-shadow group cursor-pointer"
                            >
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="80px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-3xs font-bold text-accent uppercase tracking-widest mb-1 block">
                                        {item.cat}
                                    </span>
                                    <h4 className="font-serif text-sm text-foreground leading-snug line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <span className="text-3xs text-muted-foreground mt-1 block">{item.time} read</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
