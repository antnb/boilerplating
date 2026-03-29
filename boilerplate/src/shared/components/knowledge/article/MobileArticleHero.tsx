import Image from "next/image";
import type { ArticleSpec } from "@/shared/types/article";

type MobileArticleHeroProps = {
    title: string;
    subtitle: string;
    readTime: string;
    author: string;
    specimenImage: string;
    specimenLabel: string;
    specs: ArticleSpec[];
    category: string;
};

export default function MobileArticleHero({
    title, subtitle, readTime, author, specimenImage, specimenLabel, specs, category,
}: MobileArticleHeroProps) {
    return (
        <div className="lg:hidden flex flex-col gap-2 mb-6">
            {/* Hero image */}
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative shadow-md">
                <Image
                    src={specimenImage}
                    alt={specimenLabel}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-accent/90 rounded-full text-[10px] text-accent-foreground uppercase tracking-wider font-bold">
                            {category}
                        </span>
                        <span className="text-[10px] tracking-wide text-primary-foreground/70">{readTime}</span>
                    </div>
                    <h2 className="text-2xl font-serif italic leading-[1.15] mb-2">{title}</h2>
                    <p className="text-primary-foreground/70 text-xs font-light leading-relaxed">{subtitle}</p>
                </div>
            </div>

            {/* Author bar */}
            <div className="flex items-center justify-between bg-background rounded-xl px-4 py-3 border border-border/10 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-sm">verified</span>
                    <span className="text-xs font-medium text-foreground">{author}</span>
                </div>
            </div>

            {/* Quick specs */}
            {specs.length > 0 && (
                <div className="bg-background rounded-xl px-4 py-3 shadow-sm border border-border/10">
                    <div className="grid grid-cols-4 divide-x divide-border/10">
                        {specs.slice(0, 4).map((spec, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 px-1">
                                <span className="material-symbols-outlined text-accent text-lg">{spec.icon}</span>
                                <div className="text-center">
                                    <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{spec.label}</div>
                                    <div className="text-[10px] text-foreground font-medium">{spec.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
