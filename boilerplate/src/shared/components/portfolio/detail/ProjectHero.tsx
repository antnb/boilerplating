import Image from "next/image";

type ProjectHeroProps = {
    title: string;
    category: string;
    heroImage: string | null;
    heroImageAlt: string | null;
    location: string;
    scale: string;
};

export default function ProjectHero({
    title,
    category,
    heroImage,
    heroImageAlt,
    location,
    scale,
}: ProjectHeroProps) {
    return (
        <section className="relative rounded-3xl overflow-hidden mb-8 min-h-[300px] md:min-h-[440px]">
            <Image
                src={heroImage || "/placeholder.jpg"}
                alt={heroImageAlt || title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <span className="self-start px-3 py-1 mb-4 bg-brand-accent/90 text-brand-dark text-2xs font-bold uppercase tracking-wider rounded-full">
                    {category}
                </span>
                <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-3">
                    {title}
                </h1>
                <div className="flex items-center gap-6 text-white/70 text-sm">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {location}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">forest</span>
                        {scale}
                    </span>
                </div>
            </div>
        </section>
    );
}
