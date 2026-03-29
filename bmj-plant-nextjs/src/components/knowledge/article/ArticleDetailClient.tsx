"use client";

/**
 * ArticleDetailClient — Client Component
 *
 * Receives pre-resolved article data from the Server Component page.tsx.
 * Removed: useParams(), redirect(), getArticle() call.
 * ArticleSidebar uses IntersectionObserver (scroll spy) → must be Client.
 */

import ArticleHero from "@/components/knowledge/article/ArticleHero";
import ArticleBody from "@/components/knowledge/article/ArticleBody";
import ArticleSidebar from "@/components/knowledge/article/ArticleSidebar";
import ArticleRelated from "@/components/knowledge/article/ArticleRelated";
import MobileArticleHero from "@/components/knowledge/article/MobileArticleHero";
import MobileArticleFooter from "@/components/knowledge/article/MobileArticleFooter";

interface ArticleDetailClientProps {
    article: any; // ArticleDetail type from mock-articles
}

export default function ArticleDetailClient({ article }: ArticleDetailClientProps) {
    const breadcrumb = [
        { label: "Knowledge", href: "/knowledge" },
        { label: article.category, href: "/knowledge" },
    ];

    return (
        <div className="min-h-screen pb-16">
            <div className="container-page pt-4 md:pt-8">
                {/* Desktop Hero */}
                <div className="hidden lg:block">
                    <ArticleHero
                        title={article.title}
                        subtitle={article.subtitle}
                        heroImage={article.heroImage}
                        heroImageAlt={article.heroImageAlt}
                        author={article.author}
                        date={article.date}
                        readTime={article.readTime}
                        breadcrumb={breadcrumb}
                    />
                </div>

                {/* Mobile Hero */}
                <MobileArticleHero
                    title={article.title}
                    subtitle={article.subtitle}
                    readTime={article.readTime}
                    author={article.author}
                    specimenImage={article.mobileSpecimenImage || article.heroImage}
                    specimenLabel={article.mobileSpecimenLabel || article.heroImageAlt}
                    specs={article.specs}
                    category={article.category}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-0 lg:mt-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <ArticleBody
                            content={article.content}
                            specs={article.specs}
                            expert={article.expert}
                        />

                        {/* Mobile Footer */}
                        <MobileArticleFooter expert={article.expert} />
                    </div>

                    {/* Sidebar (desktop only) */}
                    <ArticleSidebar
                        content={article.content}
                        expert={article.expert}
                    />
                </div>

                {/* Related Articles */}
                <ArticleRelated articles={article.relatedArticles} />
            </div>
        </div>
    );
}
