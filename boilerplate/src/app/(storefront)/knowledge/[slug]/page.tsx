// Server Component — article lookup + SEO metadata at server level
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checkArticleSlugExists, getArticleBySlug, getAllArticleSlugs } from "@/shared/lib/data/articles";
import ArticleDetailClient from "@/shared/components/knowledge/article/ArticleDetailClient";
import { BreadcrumbJsonLd } from "@/shared/components/seo/BreadcrumbJsonLd";

// Knowledge article — revalidate every 4 hours
export const revalidate = 14400;

// With DB-backed data, allow dynamic params for new articles
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);
    if (!article) return { title: "Artikel Tidak Ditemukan" };
    return {
        title: article.title,
        description: article.subtitle || article.title,
        alternates: {
            canonical: `/knowledge/${params.slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.subtitle || article.title,
        },
    };
}

export default async function KnowledgeArticlePage({ params }: Props) {
    // ── Fast existence check BEFORE any Suspense boundary ──
    // Per Next.js docs (streaming.mdx:636): ensures HTTP 404 for nonexistent slugs
    const exists = await checkArticleSlugExists(params.slug);
    if (!exists) notFound();

    // ── Full data fetch (existence confirmed) ──
    const article = await getArticleBySlug(params.slug);
    if (!article) notFound(); // Safety net

    // Transform DAL output → ArticleDetail shape expected by client components
    const ap = article.authorProfile;
    const serializedArticle = {
        ...article,
        // Map StaffProfile (authorProfile) → ArticleExpert UI shape
        expert: ap ? {
            name: ap.user?.name || ap.shortName,
            shortName: ap.shortName,
            title: ap.title,
            avatar: ap.avatar || "/images/knowledge/knowledge-editorial-team.webp",
            bio: ap.bio,
            badge: ap.badge || "Expert",
            verificationNote: ap.verificationNote || "",
        } : null,
        relatedArticles: article.relatedFrom?.map((r) => r.relatedArticle) || [],
    };

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Beranda", url: "https://bmjplantstore.com" },
                { name: "Pusat Pengetahuan", url: "https://bmjplantstore.com/knowledge" },
                { name: article.title, url: `https://bmjplantstore.com/knowledge/${params.slug}` },
            ]} />
            <ArticleDetailClient article={JSON.parse(JSON.stringify(serializedArticle))} />
        </>
    );
}
