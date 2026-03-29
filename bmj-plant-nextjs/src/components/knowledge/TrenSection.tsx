"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { KnowledgeTrenData } from "@/lib/schemas/knowledge-sections";
import greenhouseImg from "@/assets/images/greenhouse-interior.webp";
import gardenPath from "@/assets/images/garden-path.webp";

interface TrenArticle {
    category: string;
    title: string;
    description: string;
    img: any;
    date: string;
    readTime: string;
}

type Props = { data?: KnowledgeTrenData };

const defaultArticles: TrenArticle[] = [
    { category: "Market Report", title: "Anthurium Papillilaminum Hybrid Market 2024", description: "Analisis harga dan permintaan pasar global untuk hibrida gelap Anthurium.", img: greenhouseImg, date: "12 Aug", readTime: "5 Min" },
    { category: "Tips", title: "Manajemen Dormansi Alocasia", description: "Strategi pencahayaan buatan untuk musim hujan.", img: gardenPath, date: "10 Aug", readTime: "4 Min" },
    { category: "Research", title: "Philodendron Gloriosum vs Melanochrysum", description: "Perbandingan mendalam karakteristik dan kebutuhan perawatan.", img: greenhouseImg, date: "8 Aug", readTime: "7 Min" },
    { category: "Industry", title: "Sertifikasi CITES untuk Ekspor Tanaman", description: "Panduan lengkap regulasi ekspor tanaman langka Indonesia.", img: gardenPath, date: "5 Aug", readTime: "6 Min" },
    { category: "Innovation", title: "Tissue Culture untuk Koleksi Langka", description: "Perkembangan teknik kultur jaringan untuk propagasi massal.", img: greenhouseImg, date: "2 Aug", readTime: "8 Min" },
    { category: "Guide", title: "Membangun Greenhouse di Dataran Rendah", description: "Teknik kontrol suhu dan kelembaban untuk iklim tropis.", img: gardenPath, date: "30 Jul", readTime: "10 Min" },
];

export function TrenSection({ data }: Props) {
    const [showAll, setShowAll] = useState(false);

    const sectionNumber = data?.sectionNumber ?? "05.";
    const sectionTitle = data?.sectionTitle ?? "Tren & Updates";
    const loadMoreText = data?.loadMoreText ?? "Muat Lebih Banyak";
    const allArticles = (data?.articles ?? defaultArticles) as TrenArticle[];

    const visibleArticles = showAll ? allArticles : allArticles.slice(0, 2);

    return (
        <section className="bg-card py-8 md:py-20 px-4 border-t border-border" id="tren">
            <div className="container-page">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 md:mb-10">
                    <div className="flex items-center gap-2 pl-1">
                        <span className="text-xl md:text-2xl font-serif italic text-foreground/20">{sectionNumber}</span>
                        <h2 className="text-xl md:text-3xl font-serif text-foreground">{sectionTitle}</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Previous">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </button>
                        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Next">
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Desktop: 3-col grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-8">
                    {allArticles.map((article, i) => (
                        <ArticleCard key={i} article={article} />
                    ))}
                </div>

                {/* Mobile: stacked */}
                <div className="md:hidden space-y-6 mb-6">
                    {visibleArticles.map((article, i) => (
                        <div key={i}>
                            <MobileArticleCard article={article} />
                            {i < visibleArticles.length - 1 && (
                                <div className="w-full h-px bg-border mt-6" />
                            )}
                        </div>
                    ))}
                </div>

                {!showAll && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="md:hidden w-full py-3 border border-foreground text-foreground text-xs font-bold uppercase tracking-widest rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined text-base group-hover:rotate-90 transition-transform">add</span>
                        {loadMoreText}
                    </button>
                )}
            </div>
        </section>
    );
}

function ArticleCard({ article }: { article: TrenArticle }) {
    const slugMap: Record<string, string> = {
        "Anthurium Papillilaminum Hybrid Market 2024": "anthurium-hybrid-market-2024",
        "Manajemen Dormansi Alocasia": "dormansi-alocasia",
        "Philodendron Gloriosum vs Melanochrysum": "gloriosum-vs-melanochrysum",
        "Sertifikasi CITES untuk Ekspor Tanaman": "sertifikasi-cites-ekspor",
    };
    const slug = slugMap[article.title] || "panduan-identifikasi-hybrid-philodendron";

    return (
        <Link href={`/knowledge/${slug}`} className="group cursor-pointer block">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative shadow-sm mb-4">
                <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-card/90 px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                    {article.category}
                </span>
            </div>
            <h3 className="font-serif text-lg text-foreground mb-1.5 leading-snug group-hover:text-accent transition-colors">
                {article.title}
            </h3>
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed mb-2">
                {article.description}
            </p>
            <div className="flex items-center gap-3 text-3xs text-muted-foreground font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    {article.date}
                </span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {article.readTime}
                </span>
            </div>
        </Link>
    );
}

function MobileArticleCard({ article }: { article: TrenArticle }) {
    return (
        <article className="flex flex-col gap-3">
            <div className="w-full aspect-video rounded-xl overflow-hidden relative shadow-sm">
                <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
                <span className="absolute top-2 left-2 bg-card/90 px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                    {article.category}
                </span>
            </div>
            <div>
                <h3 className="font-serif text-lg text-foreground mb-1 leading-snug">{article.title}</h3>
                <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{article.description}</p>
                <div className="mt-2 flex items-center gap-3 text-3xs text-muted-foreground font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {article.date}
                    </span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {article.readTime}
                    </span>
                </div>
            </div>
        </article>
    );
}
