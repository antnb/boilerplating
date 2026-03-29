import Link from "next/link";
import Image from "next/image";
import type { KnowledgeZoneMemilihData } from "@/lib/schemas/knowledge-sections";
import greenhouseImg from "@/assets/images/greenhouse-interior.webp";

type Props = { data?: KnowledgeZoneMemilihData };

export function ZoneMemilih({ data }: Props) {
    const sectionNumber = data?.sectionNumber ?? "02.";
    const sectionTitle = data?.sectionTitle ?? "Memilih";
    const sectionSubtitle = data?.sectionSubtitle ?? "Selection";
    const featuredImage = data?.featuredImage ?? greenhouseImg;
    const featuredImageAlt = data?.featuredImageAlt ?? "Panduan inspeksi kesehatan tanaman";
    const featuredBadge = data?.featuredBadge ?? "Essential Guide";
    const featuredTitle = data?.featuredTitle ?? "Panduan Inspeksi Kesehatan Tanaman";
    const featuredDesc = data?.featuredDesc ?? "Panduan visual mendeteksi penyakit dan memilih spesimen berkualitas.";
    const desktopSubLinks = data?.desktopSubLinks ?? ["Memilih Pot yang Tepat", "Variegata vs Non-Variegata"];
    const mobileHeroTitle = data?.mobileHeroTitle ?? "Inspeksi Kesehatan";
    const mobileHeroDesc = data?.mobileHeroDesc ?? "Panduan visual mendeteksi penyakit.";
    const mobileSubArticles = data?.mobileSubArticles ?? [
        { title: "Teknik Menjaga Variegasi Stabil", subtitle: "Monstera Guide", img: greenhouseImg },
        { title: "Cutting vs Tanaman Utuh", subtitle: "Investasi Cerdas", img: greenhouseImg },
    ];

    return (
        <section className="bg-card md:bg-transparent py-8 md:py-0 px-4 md:px-0 border-t border-border md:border-t-0" id="memilih">
            {/* Mobile header */}
            <div className="flex items-center gap-2 mb-4 pl-1 md:hidden">
                <span className="text-xl font-serif italic text-foreground/20">{sectionNumber}</span>
                <h2 className="text-xl font-serif text-foreground">{sectionTitle}</h2>
            </div>

            {/* Desktop header */}
            <div className="hidden md:block mb-6">
                <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-serif italic text-foreground/20">{sectionNumber}</span>
                    <h2 className="text-2xl font-serif text-foreground">{sectionTitle}</h2>
                </div>
                <span className="text-2xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-10">{sectionSubtitle}</span>
            </div>

            {/* Desktop: card+links */}
            <div className="hidden md:block">
                <Link href="/knowledge/inspeksi-kesehatan-tanaman" className="bg-card rounded-xl overflow-hidden shadow-soft mb-4 border border-border flex flex-col group">
                    <div className="aspect-[16/9] w-full relative overflow-hidden">
                        <Image
                        src={featuredImage}
                        alt={featuredImageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="33vw"
                    />
                        <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider shadow-sm">
                            {featuredBadge}
                        </span>
                    </div>
                    <div className="p-5 flex flex-col justify-center">
                        <h3 className="font-serif text-lg text-foreground mb-1.5 leading-snug group-hover:text-accent transition-colors">{featuredTitle}</h3>
                        <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">{featuredDesc}</p>
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider group-hover:text-accent transition-colors inline-flex items-center gap-1">
                            Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </div>
                </Link>
                <div className="space-y-2">
                    {desktopSubLinks.map((title, i) => (
                        <a key={i} href="#" className="block pl-4 py-2 border-l-2 border-border hover:border-accent text-sm font-serif text-foreground hover:text-accent transition-colors">
                            {title}
                        </a>
                    ))}
                </div>
            </div>

            {/* Mobile: overlay card + sub-articles */}
            <div className="md:hidden">
                <Link href="/knowledge/inspeksi-kesehatan-tanaman" className="rounded-xl overflow-hidden h-[240px] relative mb-4 shadow-soft group block">
                    <Image
                        src={featuredImage}
                        alt={featuredImageAlt}
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="text-3xs text-accent font-bold uppercase tracking-widest mb-1 block">{featuredBadge}</span>
                        <h3 className="font-serif text-lg text-white leading-tight mb-1">{mobileHeroTitle}</h3>
                        <p className="text-white/70 text-xs line-clamp-2">{mobileHeroDesc}</p>
                    </div>
                </Link>

                <div className="space-y-3">
                    {mobileSubArticles.map((item, i) => (
                        <a key={i} href="#" className="flex flex-col p-3 bg-muted rounded-xl border border-border shadow-sm">
                            <div className="w-full aspect-[2/1] rounded-lg overflow-hidden flex-shrink-0 shadow-sm mb-3 relative">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                />
                            </div>
                            <div className="flex flex-col h-full justify-center">
                                <h4 className="font-serif text-sm text-foreground mb-1 leading-snug">{item.title}</h4>
                                <span className="text-3xs text-muted-foreground font-bold uppercase tracking-wide">{item.subtitle}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
