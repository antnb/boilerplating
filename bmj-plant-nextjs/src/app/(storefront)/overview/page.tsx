// Server Component — no "use client" needed
import type { Metadata } from "next";
import { OverviewHero } from "@/components/overview/OverviewHero";
import { OverviewStickyNav } from "@/components/overview/OverviewStickyNav";
import { OverviewStats } from "@/components/overview/OverviewStats";
import { OverviewAbout } from "@/components/overview/OverviewAbout";
import { OverviewNetwork } from "@/components/overview/OverviewNetwork";
import { OverviewGallery } from "@/components/overview/OverviewGallery";
import { OverviewTeam } from "@/components/overview/OverviewTeam";
import { OverviewLogistics } from "@/components/overview/OverviewLogistics";
import { OverviewGuarantee } from "@/components/overview/OverviewGuarantee";
import { OverviewTestimonials } from "@/components/overview/OverviewTestimonials";
import { OverviewFAQ } from "@/components/overview/OverviewFAQ";
import { OverviewContact } from "@/components/overview/OverviewContact";
import { ScrollRevealCSS } from "@/components/ui/ScrollRevealCSS";
import { getPageContent } from "@/lib/data/page-content";
import { getCachedTeamMembers } from "@/lib/data/staff-profiles";

export const metadata: Metadata = {
    title: "Tentang Kami",
    description:
        "Nursery tanaman hias premium di Indonesia. Spesialis Monstera, Philodendron, dan tanaman langka.",
    alternates: {
        canonical: "/overview",
    },
    openGraph: {
        title: "Tentang Kami | BMJ Plant Store",
        description: "Nursery tanaman hias premium di Indonesia. Spesialis Monstera, Philodendron, dan tanaman langka.",
        url: "/overview",
    },
};

export default async function OverviewPage() {
    const [data, teamMembers] = await Promise.all([
        getPageContent<Record<string, any>>("overview"),
        getCachedTeamMembers(),
    ]);

    if (!data) {
        return <div className="container-page py-20 text-center">Overview content loading...</div>;
    }

    return (
        <div id="page-overview" className="min-h-screen pb-16 flex flex-col">
            <div className="container-page page-sections">
                <OverviewHero data={data.overview_hero as any} />
            </div>
            <OverviewStickyNav data={data.overview_sticky_nav as any} />
            <div className="container-page pt-12 pb-24 space-y-16 md:space-y-32">
                <ScrollRevealCSS direction="up" delay={0.05}>
                    <OverviewStats data={data.overview_stats as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.08}>
                    <OverviewAbout data={data.overview_about as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="left" delay={0.05}>
                    <OverviewNetwork data={data.overview_network as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.05}>
                    <OverviewGallery data={data.overview_gallery as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.08}>
                    <OverviewTeam data={data.overview_team as any} dbMembers={teamMembers} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="right" delay={0.05}>
                    <OverviewLogistics data={data.overview_logistics as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.05}>
                    <OverviewGuarantee data={data.overview_guarantee as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.08}>
                    <OverviewTestimonials data={data.overview_testimonials as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.05}>
                    <OverviewFAQ data={data.overview_faq as any} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.1}>
                    <OverviewContact data={data.overview_contact as any} />
                </ScrollRevealCSS>
            </div>
        </div>
    );
}
