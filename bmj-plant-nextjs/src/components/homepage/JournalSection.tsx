/* Section 8: The Journal */

import Image from "next/image";
import type { JournalSectionData } from "@/lib/schemas/homepage-sections";

type Props = {
    data: JournalSectionData;
};

export function JournalSection({ data }: Props) {
    return (
        <section id="journal-section" className="flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end px-1 md:px-2">
                <h2 className="text-2xl md:text-3xl font-serif text-brand-dark">
                    {data.heading}{" "}
                    <span className="italic text-brand-dark/60">{data.headingHighlight}</span>
                </h2>
                <a
                    className="text-xs md:text-sm font-bold text-brand-dark border-b border-brand-dark/20 pb-1 hover:border-brand-dark transition-colors"
                    href={data.ctaHref}
                >
                    {data.ctaLabel}
                </a>
            </div>

            {/* Desktop: 3-col vertical cards */}
            <div className="hidden md:grid md:grid-cols-3 journal-grid">
                {data.articles.map((article) => (
                    <article
                        key={article.title}
                        className="bento-card group cursor-pointer bg-white rounded-2xl overflow-hidden border border-brand-dark"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <Image
                                alt={article.alt}
                                src={(article.image as any)?.src || article.image}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="33vw"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider text-brand-dark">
                                {article.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-brand-accent transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-brand-dark/70 mb-4 line-clamp-2">
                                {article.excerpt}
                            </p>
                            <span className="text-xs font-bold text-brand-dark uppercase tracking-widest border-b border-brand-dark/20 pb-0.5">
                                Baca Artikel
                            </span>
                        </div>
                    </article>
                ))}
            </div>

            {/* Mobile: horizontal article rows */}
            <div className="flex flex-col gap-3 md:hidden">
                {data.articles.map((article) => (
                    <article
                        key={article.title}
                        className="flex gap-3 bg-white rounded-xl border border-brand-dark overflow-hidden p-3 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                        <div className="w-24 h-24 rounded-lg overflow-hidden relative flex-shrink-0">
                            <Image
                                alt={article.alt}
                                src={(article.image as any)?.src || article.image}
                                fill
                                className="object-cover"
                                sizes="96px"
                            />
                        </div>
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                            <span className="text-3xs font-bold text-brand-dark/50 uppercase tracking-widest mb-1">
                                {article.category}
                            </span>
                            <h3 className="font-serif text-sm font-medium text-brand-dark leading-snug mb-1 line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-2xs text-brand-dark/60 line-clamp-2 leading-relaxed">
                                {article.excerpt}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
