// Server Component — no "use client" needed
import type { Metadata } from "next";
import { getPageContent } from "@/lib/data/page-content";
import { LayananHero } from "@/components/layanan/LayananHero";
import { LayananUSP } from "@/components/layanan/LayananUSP";
import { LayananQuickContact } from "@/components/layanan/LayananQuickContact";
import { LayananCaraKerja } from "@/components/layanan/LayananCaraKerja";
import { LayananPartners } from "@/components/layanan/LayananPartners";
import { LayananSegmen } from "@/components/layanan/LayananSegmen";
import { LayananGaleri } from "@/components/layanan/LayananGaleri";
import { LayananPelanggan } from "@/components/layanan/LayananPelanggan";
import { LayananLogistik } from "@/components/layanan/LayananLogistik";
import { LayananFAQ } from "@/components/layanan/LayananFAQ";
import { LayananCTA } from "@/components/layanan/LayananCTA";
import { ScrollRevealCSS } from "@/components/ui/ScrollRevealCSS";

export const metadata: Metadata = {
    title: "Layanan Landscape & B2B",
    description:
        "Jasa penataan taman, supply tanaman proyek, dan desain lanskap profesional.",
    alternates: {
        canonical: "/layanan",
    },
    openGraph: {
        title: "Layanan Landscape & B2B | BMJ Plant Store",
        description: "Jasa penataan taman, supply tanaman proyek, dan desain lanskap profesional.",
        url: "/layanan",
    },
};

export default async function LayananPage() {
    const sections = await getPageContent<Record<string, any>>("layanan");

    if (!sections) {
        return <div className="container-page py-20 text-center">Layanan content loading...</div>;
    }

    return (
        <div id="page-layanan" className="container-page page-sections scroll-smooth">
            <LayananHero data={sections.layanan_hero as any} />

            <ScrollRevealCSS direction="up" delay={0.05}>
                <LayananUSP data={sections.layanan_usp as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.08}>
                <LayananQuickContact data={sections.layanan_quick_contact as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.05}>
                <LayananCaraKerja data={sections.layanan_cara_kerja as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="left" delay={0.05}>
                <LayananPartners data={sections.layanan_partners as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.05}>
                <LayananSegmen data={sections.layanan_segmen as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.08}>
                <LayananGaleri data={sections.layanan_galeri as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="right" delay={0.05}>
                <LayananPelanggan data={sections.layanan_pelanggan as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.05}>
                <LayananLogistik data={sections.layanan_logistik as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.08}>
                <LayananFAQ data={sections.layanan_faq as any} />
            </ScrollRevealCSS>

            <ScrollRevealCSS direction="up" delay={0.1}>
                <LayananCTA data={sections.layanan_cta as any} />
            </ScrollRevealCSS>
        </div>
    );
}
