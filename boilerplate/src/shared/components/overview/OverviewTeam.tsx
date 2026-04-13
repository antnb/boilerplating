import Link from "next/link";
import type { OverviewTeamData } from "@/shared/lib/schemas/overview-sections";
import type { TeamMemberDB } from "@/shared/types/staff";

type Props = {
    data?: OverviewTeamData;
    dbMembers?: TeamMemberDB[];
};

const DEFAULT_MEMBERS = [
    { name: "Dr. Hartono S.", role: "Head Botanist", quote: '"Ilmu tanaman yang baik menghasilkan kualitas yang konsisten."', initials: "HS", bgClass: "from-primary to-primary/80" },
    { name: "Budi Santoso", role: "Field Coordinator", quote: '"Memberdayakan petani lokal, melayani pasar nasional."', initials: "BS", bgClass: "from-accent/80 to-accent" },
    { name: "Nur Aini", role: "Export Logistics Specialist", quote: '"Ketepatan waktu adalah komitmen, bukan janji."', initials: "NA", bgClass: "from-primary/80 to-primary" },
];

const BG_CLASSES = [
    "from-primary to-primary/80",
    "from-accent/80 to-accent",
    "from-primary/80 to-primary",
    "from-accent to-accent/80",
];

/** Extract initials from name: "Dr. Hartono" → "DH", "Budi Santoso" → "BS" */
function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(w => w.length > 0 && w !== ".")
        .map(w => w.replace(/\./g, "")[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("");
}

export function OverviewTeam({ data, dbMembers }: Props) {
    const badge = data?.badge ?? "The Nurserymen";
    const heading = data?.heading ?? "Dipimpin oleh Ahli";

    // Priority: DB data > CMS data > hardcoded fallback
    const members = (dbMembers && dbMembers.length > 0)
        ? dbMembers.map((m, i) => ({
            name: m.shortName,
            role: m.title,
            quote: m.bio ? `"${m.bio}"` : "",
            initials: getInitials(m.shortName),
            bgClass: BG_CLASSES[i % BG_CLASSES.length],
            profileId: m.id,
        }))
        : (data?.members ?? DEFAULT_MEMBERS).map(m => ({ ...m, profileId: undefined as string | undefined }));

    return (
        <section id="tim" className="space-y-4 lg:space-y-6">
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
                {members.map((member: any) => {
                    const card = (
                        <article
                            key={member.name}
                            className="bg-card rounded-2xl border border-border overflow-hidden flex-shrink-0 w-[260px] lg:w-auto"
                        >
                            {/* Initials avatar area */}
                            <div className={`relative h-[200px] lg:h-[240px] bg-gradient-to-br ${member.bgClass} flex items-center justify-center`}>
                                <span className="text-5xl lg:text-6xl font-serif font-bold text-white/90 select-none">
                                    {member.initials}
                                </span>
                                <span className="absolute bottom-3 right-3 material-symbols-outlined text-white/20 text-4xl">person</span>
                            </div>
                            <div className="p-4 lg:p-5">
                                <h3 className="font-serif font-bold text-foreground text-sm lg:text-base">
                                    {member.name}
                                </h3>
                                <p className="text-accent text-xs lg:text-sm font-medium mb-2">
                                    {member.role}
                                </p>
                                {member.quote && (
                                    <p className="text-muted-foreground text-xs lg:text-sm italic">
                                        {member.quote}
                                    </p>
                                )}
                            </div>
                        </article>
                    );
                    // Wrap in Link if we have a profile ID from DB
                    return member.profileId ? (
                        <Link key={member.name} href={`/staff/${member.profileId}`} className="block hover:opacity-90 transition-opacity flex-shrink-0 w-[260px] lg:w-auto">
                            {card}
                        </Link>
                    ) : card;
                })}
            </div>
        </section>
    );
}
