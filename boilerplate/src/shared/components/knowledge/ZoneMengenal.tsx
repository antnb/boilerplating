"use client";

import Link from "next/link";
import Image from "next/image";
import type { KnowledgeZoneMengenalData } from "@/shared/lib/schemas/knowledge-sections";
import greenhouseImg from "@/shared/assets/images/greenhouse-interior.webp";

type Props = { data?: KnowledgeZoneMengenalData };

export function ZoneMengenal({ data }: Props) {
    const sectionNumber = data?.sectionNumber ?? "01.";
    const sectionTitle = data?.sectionTitle ?? "Mengenal";
    const sectionSubtitle = data?.sectionSubtitle ?? "Classification";
    const featuredImage = data?.featuredImage ?? greenhouseImg;
    const featuredImageAlt = data?.featuredImageAlt ?? "Taksonomi Araceae — panduan klasifikasi botani dasar";
    const featuredBadge = data?.featuredBadge ?? "Featured";
    const featuredTitle = data?.featuredTitle ?? "Taksonomi Araceae";
    const featuredDesc = data?.featuredDesc ?? "Dasar klasifikasi botani untuk identifikasi akurat famili Araceae.";
    const featuredAuthor = data?.featuredAuthor ?? "Dr. Hartono";
    const subLinks = data?.subLinks ?? [
        { icon: "psychiatry", title: "Morfologi Daun & Venasi" },
        { icon: "forest", title: "Habitat Hutan Tropis" },
    ];

    return (
        <section className="bg-brand-bg py-8 md:py-0 px-4 md:px-0" id="mengenal">
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

            {/* Featured Card */}
            <Link href="/knowledge/taksonomi-araceae" className="bg-card rounded-xl overflow-hidden shadow-soft mb-4 border border-border flex flex-col group">
                <div className="aspect-[16/9] w-full relative overflow-hidden">
                    <Image
                        src={featuredImage}
                        alt={featuredImageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider shadow-sm">
                        {featuredBadge}
                    </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col justify-center">
                    <h3 className="font-serif text-lg text-foreground mb-1.5 leading-snug group-hover:text-accent transition-colors">{featuredTitle}</h3>
                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">{featuredDesc}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-border w-full">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border relative">
                            <Image
                                src={featuredImage}
                                alt={featuredAuthor}
                                width={24}
                                height={24}
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xs font-bold text-foreground/70 uppercase tracking-wide">{featuredAuthor}</span>
                    </div>
                </div>
            </Link>

            {/* Sub-category links */}
            <div className="space-y-3">
                <div className="hidden md:block space-y-2">
                    {subLinks.map((item, i) => (
                        <a key={i} href="#" className="block pl-4 py-2 border-l-2 border-border hover:border-accent text-sm font-serif text-foreground hover:text-accent transition-colors">
                            {item.title}
                        </a>
                    ))}
                </div>
                <div className="md:hidden space-y-3">
                    {subLinks.map((item, i) => (
                        <a key={i} href="#" className="bg-card rounded-xl p-3 shadow-soft border border-border flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            </div>
                            <h4 className="font-serif text-sm text-foreground leading-tight">{item.title}</h4>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
