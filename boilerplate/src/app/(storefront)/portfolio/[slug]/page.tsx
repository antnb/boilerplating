// Server Component — portfolio project lookup + SEO metadata
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checkPortfolioSlugExists, getPortfolioBySlug, getAllPortfolioSlugs, getRelatedPortfolios } from "@/shared/lib/data/portfolios";
import PortfolioDetailClient from "@/shared/components/portfolio/detail/PortfolioDetailClient";
import { BreadcrumbJsonLd } from "@/shared/components/seo/BreadcrumbJsonLd";

// Portfolio project — revalidate every 24 hours
export const revalidate = 86400;

// Allow dynamic params for new portfolio items
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
    const slugs = await getAllPortfolioSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const project = await getPortfolioBySlug(params.slug);
    if (!project) return { title: "Proyek Tidak Ditemukan" };
    return {
        title: project.title,
        description: project.description?.substring(0, 160),
        alternates: {
            canonical: `/portfolio/${params.slug}`,
        },
        openGraph: {
            title: project.title,
            description: project.description?.substring(0, 160),
        },
    };
}

export default async function PortfolioDetailPage({ params }: Props) {
    // ── Fast existence check BEFORE any Suspense boundary ──
    // Per Next.js docs (streaming.mdx:636): ensures HTTP 404 for nonexistent slugs
    const exists = await checkPortfolioSlugExists(params.slug);
    if (!exists) notFound();

    // ── Full data fetch (existence confirmed) ──
    const [dbProject, dbRelated] = await Promise.all([
        getPortfolioBySlug(params.slug),
        getRelatedPortfolios(params.slug),
    ]);

    if (!dbProject) notFound(); // Safety net

    // ── Transform DB shape → PortfolioDetailClient expected shape ──
    const specs = (dbProject.specs || {}) as Record<string, string>;
    const tags = (dbProject.tags || []) as string[];

    const project = {
        slug: dbProject.slug,
        title: dbProject.title,
        category: dbProject.category || "Landscaping",
        heroImage: dbProject.heroImage || "/images/placeholder.jpg",
        description: dbProject.description || "",
        challenge: dbProject.challenge || "",
        solution: dbProject.solution || "",
        result: dbProject.result || "",
        tags,
        specs: {
            client: specs.client || "-",
            location: specs.location || "-",
            scale: specs.scale || "-",
            duration: specs.duration || "-",
            completedAt: specs.completedAt || "-",
            plantCount: specs.plantCount || "-",
        },
        // Map DB images (url/alt) → gallery (src/alt) for the client component
        gallery: dbProject.images.map((img) => ({
            id: img.id,
            src: img.url,
            alt: img.alt || dbProject.title,
        })),
        // Map delivery stages — stage images are stored as JSON
        deliveryStages: dbProject.deliveryStages.map((stage) => ({
            step: stage.step,
            label: stage.label,
            description: stage.description || "",
            icon: stage.icon || "check_circle",
            images: ((stage.images || []) as Array<{ id?: string; src?: string; url?: string; alt?: string }>).map(
                (img, i) => ({
                    id: img.id || `stage-img-${i}`,
                    src: img.src || img.url || "",
                    alt: img.alt || stage.label,
                })
            ),
        })),
    };

    const relatedProjects = dbRelated.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category || "Landscaping",
        heroImage: p.heroImage || "/images/placeholder.jpg",
    }));

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Beranda", url: "https://bmjplantstore.com" },
                { name: "Portfolio", url: "https://bmjplantstore.com/portfolio" },
                { name: project.title, url: `https://bmjplantstore.com/portfolio/${params.slug}` },
            ]} />
            <PortfolioDetailClient
                project={project}
                relatedProjects={relatedProjects}
            />
        </>
    );
}
