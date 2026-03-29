import MaterialIcon from "./MaterialIcon";
import type { ExpertNote } from "@/types/pdp";

type BotanicalNarrativeProps = {
    narrative: string;
    expertNote: ExpertNote | null;
};

export default function BotanicalNarrative({ narrative, expertNote }: BotanicalNarrativeProps) {
    return (
        <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
            {/* Decorative top accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

            {/* Section eyebrow header */}
            <header className="px-6 pt-5 pb-0 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MaterialIcon name="eco" className="text-primary" size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Cerita Tanaman
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">Narasi Botanikal</h2>
                </div>
            </header>

            <div className="px-6 py-5">
                <p className="text-[13px] text-foreground/65 leading-[1.9]">{narrative}</p>
            </div>

            {/* Author Byline — E-E-A-T Expertise Signal */}
            <footer className="mx-6 mb-6 pt-4 border-t border-border flex items-start gap-3">
                <div className="bg-primary rounded-full p-2 flex-shrink-0" aria-hidden="true">
                    <MaterialIcon name="person" className="text-primary-foreground" size={16} />
                </div>
                <div>
                    <p className="text-[13px] font-semibold text-foreground">
                        Dikurasi oleh{" "}
                        <cite className="not-italic text-primary font-bold">
                            {expertNote?.name || "Tim Botanikal BMJ"}
                        </cite>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                        {expertNote?.title || "Botanical Specialist · BMJ Plant Store"}
                    </p>
                    <a href="#" className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold hover:underline mt-1">
                        <MaterialIcon name="open_in_new" size={12} />
                        Lihat profil
                    </a>
                </div>
            </footer>

            {/* Decorative corner */}
            <div className="absolute top-3 right-3 opacity-[0.04] pointer-events-none">
                <MaterialIcon name="spa" size={80} className="text-primary" />
            </div>
        </article>
    );
}
