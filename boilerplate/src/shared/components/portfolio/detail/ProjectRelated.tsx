import Link from "next/link";
import Image from "next/image";
type RelatedProject = {
    slug: string;
    title: string;
    category: string;
    location: string;
    heroImage: string | null;
    heroImageAlt: string | null;
};

type ProjectRelatedProps = {
    projects: RelatedProject[];
};

export default function ProjectRelated({ projects }: ProjectRelatedProps) {
    if (projects.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="font-serif text-2xl text-brand-dark mb-6">Proyek Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {projects.map((p) => (
                    <Link
                        key={p.slug}
                        href={`/portfolio/${p.slug}`}
                        className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
                    >
                        <Image
                            src={p.heroImage || "/placeholder.jpg"}
                            alt={p.heroImageAlt || p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <span className="text-2xs font-bold uppercase tracking-wider text-brand-accent/80">
                                {p.category}
                            </span>
                            <h3 className="font-serif text-sm text-white leading-snug group-hover:text-brand-accent transition-colors">
                                {p.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
