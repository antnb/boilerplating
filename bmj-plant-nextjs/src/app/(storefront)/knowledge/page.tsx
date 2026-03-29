// Server Component — no "use client" needed
import type { Metadata } from "next";
import { getPageContent } from "@/lib/data/page-content";
import { getCachedTeamMembers } from "@/lib/data/staff-profiles";
import { KnowledgeHero } from "@/components/knowledge/KnowledgeHero";
import { CategoryNav } from "@/components/knowledge/CategoryNav";
import { FeaturedMagazine } from "@/components/knowledge/FeaturedMagazine";
import { ZoneMengenal } from "@/components/knowledge/ZoneMengenal";
import { ZoneMemilih } from "@/components/knowledge/ZoneMemilih";
import { ZoneMerawat } from "@/components/knowledge/ZoneMerawat";
import { ZoneMenggunakan } from "@/components/knowledge/ZoneMenggunakan";
import { EditorialBoard } from "@/components/knowledge/EditorialBoard";
import { TrenSection } from "@/components/knowledge/TrenSection";
import { ScrollRevealCSS } from "@/components/ui/ScrollRevealCSS";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
    title: "Pusat Pengetahuan Tanaman",
    description:
        "Panduan merawat, memilih, dan mengenal tanaman hias. Artikel dari pakar botani.",
    alternates: {
        canonical: "/knowledge",
    },
    openGraph: {
        title: "Pusat Pengetahuan Tanaman | BMJ Plant Store",
        description: "Panduan merawat, memilih, dan mengenal tanaman hias. Artikel dari pakar botani.",
        url: "/knowledge",
    },
};

// Knowledge — revalidate every 4 hours (articles change infrequently)
export const revalidate = 14400;

export default async function KnowledgePage() {
    const [data, teamMembers] = await Promise.all([
        getPageContent<Record<string, any>>("knowledge-page"),
        getCachedTeamMembers(),
    ]);

    if (!data) {
        return <div className="container-page py-20 text-center">Knowledge content loading...</div>;
    }

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Beranda", url: "https://bmjplantstore.com" },
                { name: "Pusat Pengetahuan", url: "https://bmjplantstore.com/knowledge" },
            ]} />
            <div id="page-knowledge" className="min-h-screen bg-brand-bg flex flex-col">
                <div className="container-page page-sections">
                    <KnowledgeHero data={data.knowledge_hero as any} />
                </div>

                <CategoryNav data={data.knowledge_category_nav as any} />

                <ScrollRevealCSS direction="up" delay={0.08}>
                    <FeaturedMagazine data={data.knowledge_featured as any} />
                </ScrollRevealCSS>

                {/* Split layout for Mengenal & Memilih on Desktop */}
                <ScrollRevealCSS direction="up" delay={0.05}>
                    <div className="container-page py-10 md:py-20 hidden md:grid md:grid-cols-2 gap-8 lg:gap-16">
                        <ZoneMengenal data={data.knowledge_zone_mengenal as any} />
                        <ZoneMemilih data={data.knowledge_zone_memilih as any} />
                    </div>
                </ScrollRevealCSS>

                {/* Mobile block layout */}
                <div className="md:hidden">
                    <ScrollRevealCSS direction="up" delay={0.05}>
                        <ZoneMengenal data={data.knowledge_zone_mengenal as any} />
                    </ScrollRevealCSS>
                    <ScrollRevealCSS direction="up" delay={0.05}>
                        <ZoneMemilih data={data.knowledge_zone_memilih as any} />
                    </ScrollRevealCSS>
                </div>

                <ScrollRevealCSS direction="up" delay={0.05}>
                    <ZoneMerawat data={data.knowledge_zone_merawat as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="right" delay={0.05}>
                    <ZoneMenggunakan data={data.knowledge_zone_menggunakan as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.08}>
                    <EditorialBoard data={data.knowledge_editorial as any} dbMembers={teamMembers} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.1}>
                    <TrenSection data={data.knowledge_tren as any} />
                </ScrollRevealCSS>
            </div>
        </>
    );
}
