import Link from "next/link";
import Image from "next/image";
import type { RelatedArticle } from "@/types/article";

type ArticleRelatedProps = {
    articles: RelatedArticle[];
};

export default function ArticleRelated({ articles }: ArticleRelatedProps) {
    return (
        <section className="mt-16 pt-10 border-t border-border">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">Panduan Terkait</h2>
                <Link href="/knowledge" className="hidden sm:flex items-center gap-2 text-accent font-medium hover:underline text-sm">
                    Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Link key={article.slug} href={`/knowledge/${article.slug}`} className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                        <div className="aspect-[16/9] relative overflow-hidden">
                            <Image src={article.heroImage || ""} alt={article.heroImageAlt || ""} fill className="object-cover" sizes="33vw" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <span className="text-2xs font-bold tracking-widest text-accent uppercase mb-2 block">{article.category}</span>
                            <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-accent transition-colors leading-tight">{article.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide pb-2">
                {articles.slice(0, 2).map((article) => (
                    <Link key={article.slug} href={`/knowledge/${article.slug}`} className="group bg-card rounded-2xl overflow-hidden border border-border/50 min-w-[200px] flex-1 flex flex-col">
                        <div className="aspect-[16/9] relative overflow-hidden">
                            <Image src={article.heroImage || ""} alt={article.heroImageAlt || ""} fill className="object-cover" sizes="50vw" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <span className="text-3xs font-bold tracking-widest text-accent uppercase mb-1 block">{article.category}</span>
                            <h3 className="font-serif text-sm text-foreground leading-tight">{article.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
                <Link href="/knowledge" className="inline-flex items-center gap-2 text-accent font-medium hover:underline text-sm">
                    Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>
        </section>
    );
}
