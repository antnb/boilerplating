import Link from "next/link";
import Image from "next/image";
/* Section: Team — E-E-A-T Focused, Simple but Prominent */

import type { TeamSectionData } from "@/shared/lib/schemas/homepage-sections";
import type { TeamMemberDB } from "@/shared/types/staff";
import { StaggerChildren } from "@/shared/components/layout/StaggerChildren";

type Props = {
    data?: TeamSectionData;
    dbMembers?: TeamMemberDB[];
};

export function TeamSection({ data, dbMembers }: Props) {
    const sectionLabel = data?.sectionLabel ?? "Tim Ahli";
    const sectionTitle = data?.sectionTitle ?? "Kurator &";
    const sectionTitleHighlight = data?.sectionTitleHighlight ?? "Botanikus";
    const sectionDescription = data?.sectionDescription ?? "Dipilih dan dirawat oleh tim berpengalaman lebih dari 15 tahun di dunia tanaman hias langka.";

    // Priority: DB data > CMS data > hardcoded fallback
    const members = (dbMembers && dbMembers.length > 0)
        ? dbMembers.map(m => ({
            name: m.shortName,
            role: m.title,
            bio: m.bio ?? "",
            image: m.avatar ?? "/images/placeholder.jpg",
            tags: m.badge ? [m.badge] : [],
            profileId: m.id,
        }))
        : (data?.members ?? [
            { name: "Pak Andi", role: "Spesialis Flora Tropis", bio: "15+ tahun pengalaman akuisisi tanaman langka", image: "/images/placeholder.jpg", tags: [] },
            { name: "Pak Budi", role: "Nursery Manager", bio: "Mengelola 3 hektar nursery di Cipanas", image: "/images/placeholder.jpg", tags: [] },
            { name: "Pak Hartono", role: "Ahli Konservasi", bio: "Spesialis aklimatisasi & perawatan tanaman", image: "/images/placeholder.jpg", tags: [] },
            { name: "Bu Sari", role: "Quality Control", bio: "Inspeksi 3 tahap sebelum pengiriman", image: "/images/placeholder.jpg", tags: [] },
            { name: "Pak Dimas", role: "Logistics Lead", bio: "Packaging khusus ke seluruh Indonesia", image: "/images/placeholder.jpg", tags: [] },
            { name: "Bu Ratna", role: "Customer Relations", bio: "Konsultasi & pendampingan pasca-beli", image: "/images/placeholder.jpg", tags: [] },
          ]).map(m => ({ ...m, profileId: undefined as string | undefined }));

    return (
        <section id="team-section" className="team-eeat">
            {/* Header */}
            <div className="team-eeat__header">
                <span className="team-eeat__label">
                    <span className="material-symbols-outlined">verified</span>
                    {sectionLabel}
                </span>
                <h2 className="team-eeat__title">
                    {sectionTitle}{" "}
                    <span className="team-eeat__highlight">{sectionTitleHighlight}</span>
                </h2>
                <p className="team-eeat__desc">{sectionDescription}</p>
                <Link href="/overview" className="team-eeat__link">
                    Kenali Tim Kami
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </Link>
            </div>

            {/* Member Cards */}
            <StaggerChildren stagger={0.1} className="team-eeat__grid">
                {members.map((member, idx) => {
                    const card = (
                        <article key={idx} className="team-eeat-card">
                            <div className="team-eeat-card__photo">
                                <Image
                                    alt={`${member.name} — ${member.role}`}
                                    src={member.image || "/images/placeholder.jpg"}
                                    width={120}
                                    height={120}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="team-eeat-card__body">
                                <h3 className="team-eeat-card__name">{member.name}</h3>
                                <span className="team-eeat-card__role">{member.role}</span>
                                {member.bio && (
                                    <p className="team-eeat-card__bio">{member.bio}</p>
                                )}
                            </div>
                        </article>
                    );
                    // Wrap in Link if we have a profile ID from DB
                    return member.profileId ? (
                        <Link key={idx} href={`/staff/${member.profileId}`} className="block hover:opacity-90 transition-opacity">
                            {card}
                        </Link>
                    ) : card;
                })}
            </StaggerChildren>
        </section>
    );
}
