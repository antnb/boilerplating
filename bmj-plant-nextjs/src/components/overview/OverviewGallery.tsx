"use client";

import { useState } from "react";
import Image from "next/image";
import type { OverviewGalleryData } from "@/lib/schemas/overview-sections";

import galleryLogistik1 from "@/assets/images/overview-gallery-logistik-1.webp";
import galleryLogistik2 from "@/assets/images/overview-gallery-logistik-2.webp";
import galleryKebun1 from "@/assets/images/overview-gallery-kebun-1.webp";
import galleryKebun2 from "@/assets/images/overview-gallery-kebun-2.webp";
import galleryProyek1 from "@/assets/images/overview-gallery-proyek-1.webp";
import galleryProyek2 from "@/assets/images/overview-gallery-proyek-2.webp";

type Props = { data?: OverviewGalleryData };

type GalleryTab = "semua" | "logistik" | "kebun" | "proyek";

interface GalleryItem {
    src: any;
    alt: string;
    category: Exclude<GalleryTab, "semua">;
    span?: string;
}

const ITEMS: GalleryItem[] = [
    { src: galleryLogistik1, alt: "Dokumentasi logistik pengiriman tanaman BMJ", category: "logistik", span: "lg:col-span-2 lg:row-span-2" },
    { src: galleryLogistik2, alt: "Standar pengemasan tanaman hidup", category: "logistik" },
    { src: galleryKebun1, alt: "Tampak greenhouse nursery mitra BMJ", category: "kebun" },
    { src: galleryProyek1, alt: "Proyek lanskap hotel dengan tanaman dari BMJ", category: "proyek", span: "lg:col-span-2" },
    { src: galleryKebun2, alt: "Area pembibitan tanaman hias di nursery Cipanas", category: "kebun" },
    { src: galleryProyek2, alt: "Proyek taman vertikal perkantoran", category: "proyek" },
];

const TABS: { key: GalleryTab; label: string }[] = [
    { key: "semua", label: "Semua" },
    { key: "logistik", label: "Logistik" },
    { key: "kebun", label: "Kebun" },
    { key: "proyek", label: "Proyek" },
];

export function OverviewGallery({ data }: Props) {
    const badge = data?.badge ?? "Dokumentasi";
    const heading = data?.heading ?? "Galeri & Dokumentasi";
    const galleryTabs = data?.tabs ?? TABS;
    const galleryItems = data?.items?.length ? data.items : ITEMS;
    const [tab, setTab] = useState<string>(galleryTabs[0]?.key ?? "semua");

    const filtered = tab === (galleryTabs[0]?.key ?? "semua") ? galleryItems : galleryItems.filter((i: any) => i.category === tab);

    return (
        <section id="galeri" className="space-y-4 lg:space-y-6">
            {/* Header + Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 lg:gap-4">
                <div>
                    <span className="inline-block px-3 py-1.5 bg-muted text-foreground rounded-full text-2xs lg:text-xs font-bold uppercase tracking-wider mb-3">
                        {badge}
                    </span>
                    <h2 className="text-xl lg:text-3xl font-serif font-bold text-foreground">
                        {heading}
                    </h2>
                </div>

                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {galleryTabs.map((t: any) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 ${tab === t.key
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 auto-rows-[140px] lg:auto-rows-[200px]">
                {filtered.map((item: any, i: number) => (
                    <div
                        key={`${item.category}-${i}`}
                        className={`relative rounded-xl lg:rounded-2xl overflow-hidden border border-border group cursor-pointer ${item.span || ""}`}
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 lg:p-4">
                            <span className="text-primary-foreground text-xs lg:text-sm font-medium">{item.alt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
