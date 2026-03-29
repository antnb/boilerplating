// Server Component — no "use client" needed
import type { Metadata } from "next";
import { Hero } from "@/components/homepage/Hero";
import { TrustStrip } from "@/components/homepage/TrustStrip";
import { CatalogSection } from "@/components/homepage/CatalogSection";
import { OrderProcess } from "@/components/homepage/OrderProcess";
import { TeamSection } from "@/components/homepage/TeamSection";
import { GreenSpaceCTA } from "@/components/homepage/GreenSpaceCTA";
import { B2BSection } from "@/components/homepage/B2BSection";
import { JournalSection } from "@/components/homepage/JournalSection";
import { ConsultationCTA } from "@/components/homepage/ConsultationCTA";
import { ExcellenceSection } from "@/components/homepage/ExcellenceSection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { NewsletterSection } from "@/components/homepage/NewsletterSection";
import { ScrollRevealCSS } from "@/components/ui/ScrollRevealCSS";

import { getPageContent } from "@/lib/data/page-content";
import { getCachedProducts } from "@/lib/data/products";
import { getCachedTeamMembers } from "@/lib/data/staff-profiles";

export const metadata: Metadata = {
    title: {
        absolute: "BMJ Plant Store — Toko Tanaman Hias Premium",
    },
    description:
        "Koleksi Monstera, Philodendron, Alocasia, dan tanaman tropis langka. Pengiriman aman ke seluruh Indonesia.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "BMJ Plant Store — Toko Tanaman Hias Premium",
        description: "Koleksi Monstera, Philodendron, Alocasia, dan tanaman tropis langka. Pengiriman aman ke seluruh Indonesia.",
        url: "/",
    },
};

export default async function HomePage() {
    const [sections, dbProducts, teamMembers] = await Promise.all([
        getPageContent<Record<string, any>>("homepage"),
        getCachedProducts({ take: 12 }),
        getCachedTeamMembers(),
    ]);

    // Fallback if homepage content not in DB yet
    if (!sections) {
        return <div className="container-page py-20 text-center">Homepage content loading...</div>;
    }

    // Transform DB products to the shape CatalogSection expects
    const catalogPlants = dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        scientificName: p.scientificName,
        price: Number(p.price),
        stock: p.stock,
        createdAt: new Date(),
        family: null,
        usageIndoor: true,
        usageOutdoor: true,
        usageAirPurifier: true,
        usageHanging: false,
        usageTerrarium: false,
        usageGift: true,
        plantGroup: { name: p.category?.name || "Aroid", slug: p.category?.slug || "aroid" },
        plantType: { name: "Indoor", slug: "indoor" },
        images: p.images.map((img) => ({ src: img.url, alt: img.alt })),
    }));

    const mockTestimonials = [
        {
            id: "t1",
            name: "Bapak Ahmad",
            company: "Kolektor Jakarta",
            avatar: null,
            rating: 5,
            text: "Tanaman tiba dalam kondisi sangat sehat. Packaging rapi dan aman. Sangat puas dengan pelayanan BMJ!",
            plant: { name: "Monstera Albo", slug: "monstera-albo" },
        },
        {
            id: "t2",
            name: "Ibu Sari",
            company: "Interior Designer",
            avatar: null,
            rating: 5,
            text: "Kualitas tanaman luar biasa. Sudah 3 kali order untuk proyek desain interior dan selalu memuaskan.",
            plant: { name: "Philodendron", slug: "philodendron" },
        },
        {
            id: "t3",
            name: "Pak Budi",
            company: "Landscape Architect",
            avatar: null,
            rating: 4,
            text: "Partner terpercaya untuk supply tanaman proyek lanskap. Respons cepat dan harga kompetitif.",
            plant: null,
        },
    ];

    return (
        <div id="page-home" className="container-page page-sections scroll-smooth">
            <Hero data={sections.hero_bento} trustStripData={sections.trust_strip}>
                <TrustStrip data={sections.trust_strip} />
            </Hero>

            <ScrollRevealCSS direction="up" delay={0.05}>
                <CatalogSection
                    settings={sections.catalog_section}
                    plants={catalogPlants}
                    topSellerIds={[]}
                />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.1}>
                <OrderProcess data={sections.order_process} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.05}>
                <TeamSection data={sections.team_section} dbMembers={teamMembers} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="left" delay={0.05}>
                <GreenSpaceCTA data={sections.greenspace_cta} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="right" delay={0.05}>
                <B2BSection data={sections.b2b_section} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.05}>
                <JournalSection data={sections.journal_section} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.1}>
                <ConsultationCTA data={sections.consultation_cta} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.05}>
                <ExcellenceSection data={sections.excellence_section} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.1}>
                <TestimonialsSection testimonials={mockTestimonials} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.15}>
                <NewsletterSection data={sections.newsletter_section} />
            </ScrollRevealCSS>
        </div>
    );
}
