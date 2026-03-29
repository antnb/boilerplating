// Server Component — no "use client" needed
import type { Metadata } from "next";
import { getPageContent } from "@/lib/data/page-content";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioServices from "@/components/portfolio/PortfolioServices";
import PortfolioSegments from "@/components/portfolio/PortfolioSegments";
import PortfolioLogistics from "@/components/portfolio/PortfolioLogistics";
import PortfolioProjects from "@/components/portfolio/PortfolioProjects";
import PortfolioProcessCTA from "@/components/portfolio/PortfolioProcessCTA";
import { ScrollRevealCSS } from "@/components/ui/ScrollRevealCSS";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
    title: "Portfolio Proyek",
    description:
        "Galeri proyek landscape, interior plant, dan taman yang telah kami kerjakan.",
    alternates: {
        canonical: "/portfolio",
    },
    openGraph: {
        title: "Portfolio Proyek | BMJ Plant Store",
        description: "Galeri proyek landscape, interior plant, dan taman yang telah kami kerjakan.",
        url: "/portfolio",
    },
};

// Portfolio — revalidate every 24 hours (projects change rarely)
export const revalidate = 86400;

export default async function PortfolioPage() {
    const s = await getPageContent<Record<string, any>>("portfolio-page");

    if (!s) {
        return <div className="container-page py-20 text-center">Portfolio content loading...</div>;
    }

    const hero = s.portfolio_hero;
    const services = s.portfolio_services;
    const segments = s.portfolio_segments;
    const projectsSection = s.portfolio_projects;
    const logistics = s.portfolio_logistics;
    const processCta = s.portfolio_process_cta;

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Beranda", url: "https://bmjplantstore.com" },
                { name: "Portfolio", url: "https://bmjplantstore.com/portfolio" },
            ]} />
            <div id="page-portfolio" className="container-page page-sections">
                <PortfolioHero
                    title={hero.title}
                    subtitle={hero.subtitle}
                    description={hero.description}
                    backgroundImage={hero.backgroundImage}
                    stats={hero.stats}
                />

                <ScrollRevealCSS direction="up" delay={0.05}>
                    <PortfolioServices services={services.services} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.08}>
                    <PortfolioSegments title={segments.title} items={segments.items} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.05}>
                    <PortfolioProjects projects={projectsSection.projects} />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="left" delay={0.05}>
                    <PortfolioLogistics
                        title={logistics.title}
                        subtitle={logistics.subtitle}
                        islands={logistics.islands}
                        destinations={logistics.destinations}
                        shippingNote={logistics.shippingNote}
                    />
                </ScrollRevealCSS>

                <ScrollRevealCSS direction="up" delay={0.1}>
                    <PortfolioProcessCTA
                        process={{
                            title: processCta.processTitle,
                            steps: processCta.steps,
                        }}
                        cta={{
                            title: processCta.ctaTitle,
                            subtitle: processCta.ctaSubtitle,
                            primaryLabel: processCta.primaryLabel,
                            secondaryLabel: processCta.secondaryLabel,
                        }}
                    />
                </ScrollRevealCSS>
            </div>
        </>
    );
}
