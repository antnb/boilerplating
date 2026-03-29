import type { OverviewTestimonialsData } from "@/lib/schemas/overview-sections";

type Props = { data?: OverviewTestimonialsData };

interface Testimonial {
    name: string;
    company: string;
    rating: number;
    content: string;
    initials: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        name: "Ahmad Hidayat",
        company: "PT Green Landscape Indonesia",
        rating: 5,
        content: "Kualitas tanaman dari BMJ sangat konsisten. Pengiriman ke proyek resort di Bali pun tiba dalam kondisi prima. Sudah 3 tahun jadi partner B2B kami.",
        initials: "AH",
    },
    {
        name: "Dewi Lestari",
        company: "Interior Design Studio Bali",
        rating: 5,
        content: "Varietas monstera dan philodendron dari jaringan BMJ sangat lengkap. Support tim untuk konsultasi jenis tanaman indoor sangat membantu.",
        initials: "DL",
    },
    {
        name: "Budi Santoso",
        company: "Developer Property Jakarta",
        rating: 5,
        content: "Proyek landscaping 3 cluster perumahan kami ditangani dengan baik. Kapasitas supply besar jadi keunggulan utama BMJ.",
        initials: "BS",
    },
];

function Stars({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <span
                    key={s}
                    className={`material-symbols-outlined text-sm icon-filled ${s <= count ? "text-accent" : "text-muted"}`}
                >
                    star
                </span>
            ))}
        </div>
    );
}

export function OverviewTestimonials({ data }: Props) {
    const badge = data?.badge ?? "Testimoni";
    const heading = data?.heading ?? "Dipercaya Mitra Bisnis";
    const testimonials = (data?.testimonials ?? TESTIMONIALS) as Testimonial[];

    return (
        <section id="testimoni" className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-block px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent rounded-full text-2xs lg:text-xs font-bold uppercase tracking-wider mb-3 lg:mb-4">
                    {badge}
                </span>
                <h2 className="text-xl lg:text-3xl font-serif font-bold text-foreground">
                    {heading}
                </h2>
            </div>

            {/* Cards */}
            <div className="flex lg:grid lg:grid-cols-3 gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                {testimonials.map((t) => (
                    <article
                        key={t.name}
                        className="bg-card rounded-2xl p-5 lg:p-6 border border-border flex-shrink-0 w-[280px] lg:w-auto flex flex-col gap-3 lg:gap-4"
                    >
                        <Stars count={t.rating} />

                        <blockquote className="text-sm lg:text-base text-foreground leading-relaxed flex-1 border-none p-0 m-0">
                            <p>&ldquo;{t.content}&rdquo;</p>
                        </blockquote>

                        <footer className="flex items-center gap-3 pt-2 border-t border-border">
                            {/* Initials avatar */}
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary-foreground">{t.initials}</span>
                            </div>
                            <div>
                                <cite className="font-semibold text-foreground not-italic text-sm block">{t.name}</cite>
                                <span className="text-xs text-muted-foreground">{t.company}</span>
                            </div>
                        </footer>
                    </article>
                ))}
            </div>
        </section>
    );
}
