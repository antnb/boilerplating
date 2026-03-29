import Link from "next/link";
import Image from "next/image";
import type { KnowledgeZoneMenggunakanData } from "@/shared/lib/schemas/knowledge-sections";
import greenhouseImg from "@/shared/assets/images/greenhouse-interior.webp";

type Props = { data?: KnowledgeZoneMenggunakanData };

export function ZoneMenggunakan({ data }: Props) {
    const sectionNumber = data?.sectionNumber ?? "04.";
    const sectionTitle = data?.sectionTitle ?? "Menggunakan";
    const sectionSubtitle = data?.sectionSubtitle ?? "Design & Decor";
    const articles = data?.articles ?? [
        { category: "Interior Styling", title: "Ruang Minim Cahaya", description: "Solusi estetis untuk sudut gelap.", img: greenhouseImg, alt: "Interior styling dengan tanaman di ruang minim cahaya" },
        { category: "Landscape Arch", title: "Tropical Garden Modern", description: "Elemen hardscape minimalis.", img: greenhouseImg, alt: "Konsep tropical garden modern dengan elemen minimalis" },
    ];

    return (
        <section className="bg-brand-bg py-8 md:py-16 px-4 md:px-0" id="menggunakan">
            <div className="container-page">
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

                {/* Overlay cards */}
                <div className="flex flex-col gap-3 md:gap-5">
                    {articles.map((item, i) => {
                        const slugMap: Record<string, string> = {
                            "Ruang Minim Cahaya": "interior-tanaman-ruang-gelap",
                            "Tropical Garden Modern": "tropical-garden-modern",
                        };
                        const slug = slugMap[item.title] || "#";
                        return (
                            <Link
                                key={i}
                                href={`/knowledge/${slug}`}
                                className="relative rounded-xl overflow-hidden h-[200px] md:h-auto md:min-h-[250px] md:flex-1 shadow-soft group cursor-pointer block"
                            >
                                <Image
                                src={item.img}
                                alt={item.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                                    <span className="text-3xs font-bold text-accent uppercase tracking-widest mb-1 block">{item.category}</span>
                                    <h3 className="font-serif text-lg md:text-xl text-white mb-1 group-hover:text-accent transition-colors">{item.title}</h3>
                                    <p className="text-white/70 text-xs line-clamp-2">{item.description}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
