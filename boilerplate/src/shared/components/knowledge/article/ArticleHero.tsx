import Link from "next/link";
import Image from "next/image";
type ArticleHeroProps = {
    title: string;
    subtitle: string;
    heroImage: string;
    heroImageAlt: string;
    author: string;
    date: string;
    readTime: string;
    breadcrumb: { label: string; href: string }[];
};

export default function ArticleHero({
    title,
    subtitle,
    heroImage,
    heroImageAlt,
    author,
    date,
    readTime,
    breadcrumb,
}: ArticleHeroProps) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-primary rounded-2xl overflow-hidden shadow-md mb-8 h-auto lg:h-[450px]">
            {/* ── Text Panel ── */}
            <div className="p-8 lg:p-12 flex flex-col justify-between relative order-2 lg:order-1 text-primary-foreground">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-sans mb-6 text-primary-foreground/40">
                    {breadcrumb.map((item, i) => (
                        <span key={i} className="flex items-center gap-2">
                            {i > 0 && (
                                <span className="material-symbols-outlined text-sm">
                                    chevron_right
                                </span>
                            )}
                            <Link href={item.href}
                                className="hover:text-accent transition-colors"
                            >
                                {item.label}
                            </Link>
                        </span>
                    ))}
                    <span className="material-symbols-outlined text-sm">
                        chevron_right
                    </span>
                    <span className="truncate">{title}</span>
                </nav>

                {/* Title + Subtitle */}
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-5xl font-serif italic text-accent leading-[1.1] mb-6">
                        {title}
                    </h1>
                    <p className="text-primary-foreground/80 text-sm lg:text-base leading-relaxed max-w-md mb-8">
                        {subtitle}
                    </p>
                </div>

                {/* Author / Date / Read Time */}
                <div className="flex flex-wrap items-center gap-6 text-primary-foreground/60 text-xs font-medium border-t border-primary-foreground/10 pt-6 mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent text-sm">
                            verified
                        </span>
                        <span>{author}</span>
                    </div>
                    <div className="w-1 h-1 bg-accent rounded-full" />
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent text-sm">
                            calendar_today
                        </span>
                        <span>{date}</span>
                    </div>
                    <div className="w-1 h-1 bg-accent rounded-full" />
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent text-sm">
                            schedule
                        </span>
                        <span>{readTime}</span>
                    </div>
                </div>
            </div>

            {/* ── Image Panel (desktop only) ── */}
            <div className="relative h-64 lg:h-full order-1 lg:order-2">
                <Image
                    src={heroImage}
                    alt={heroImageAlt}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/20" />
            </div>
        </section>
    );
}
