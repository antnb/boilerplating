import Image from "next/image";
import type { KnowledgeEditorialData } from "@/lib/schemas/knowledge-sections";
import type { TeamMemberDB } from "@/types/staff";
import editorialImg from "@/assets/images/knowledge-editorial-team.webp";

type Props = {
    data?: KnowledgeEditorialData;
    dbMembers?: TeamMemberDB[];
};

export function EditorialBoard({ data, dbMembers }: Props) {
    const badgeText = data?.badgeText ?? "Editorial Board";
    const heading = data?.heading ?? "Scientific Verification";
    const subtitle = data?.subtitle ?? "Setiap artikel diverifikasi oleh tim ahli botani bersertifikat untuk memastikan akurasi ilmiah.";

    // Priority: DB data > CMS data > hardcoded fallback
    const experts = (dbMembers && dbMembers.length > 0)
        ? dbMembers.map(m => ({
            name: m.shortName,
            role: m.title,
            specialty: m.bio ?? "",
        }))
        : data?.experts ?? [
            { name: "Dr. Hartono S.", role: "Lead Horticulturalist", specialty: "Spesialis Araceae & Fisiologi." },
            { name: "Sarah Wijaya, SP.", role: "Plant Pathologist", specialty: "Ahli Hama & Penyakit Tropis." },
        ];
    const quoteText = data?.quoteText ?? "Botani bukan sekadar nama latin — ia adalah bahasa universal yang menghubungkan kita dengan keanekaragaman hayati.";
    const quoteAuthor = data?.quoteAuthor ?? "— Dr. Hartono S.";
    const disclaimerTitle = data?.disclaimerTitle ?? "General Guidance";
    const disclaimerText = data?.disclaimerText ?? "Disclaimer: Informasi yang disajikan bersifat umum dan edukatif. Untuk kondisi spesifik tanaman Anda, konsultasikan langsung dengan tim ahli kami.";

    return (
        <section className="container-page py-12 md:py-20">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <span className="inline-block px-3 py-1 border border-border rounded-full text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-3">
                    {badgeText}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">{heading}</h2>
                <p className="text-muted-foreground text-sm max-w-lg font-light leading-relaxed">{subtitle}</p>
            </div>

            {/* Content: Image + Experts + Quote */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
                {/* Left: Team image */}
                <div className="rounded-xl overflow-hidden aspect-[16/10] relative">
                    <Image
                        src={editorialImg}
                        alt="Tim ahli botani BMJ"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                {/* Right: Expert list + Quote */}
                <div className="flex flex-col gap-6">
                    {/* Expert cards */}
                    <div className="flex flex-col gap-4">
                        {experts.map((expert: any, i: number) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                            >
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-xl text-muted-foreground">person</span>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-serif text-base font-semibold text-foreground">{expert.name}</h4>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{expert.role}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{expert.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="border-l-2 border-primary/40 pl-4 py-1">
                        <p className="text-sm font-serif italic text-foreground/80 leading-relaxed mb-1.5">
                            &ldquo;{quoteText}&rdquo;
                        </p>
                        <cite className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest not-italic">
                            {quoteAuthor}
                        </cite>
                    </blockquote>
                </div>
            </div>

            {/* Disclaimer — subtle footnote */}
            <div className="mt-8 md:mt-12 flex items-start gap-2.5 text-muted-foreground">
                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                <p className="text-xs font-light italic leading-relaxed">
                    <span className="font-semibold not-italic">{disclaimerTitle}:</span> {disclaimerText}
                </p>
            </div>
        </section>
    );
}
