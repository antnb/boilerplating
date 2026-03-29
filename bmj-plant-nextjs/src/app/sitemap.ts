import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/data/products";
import { getAllArticleSlugs } from "@/lib/data/articles";
import { getAllPortfolioSlugs } from "@/lib/data/portfolios";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://bmjplantstore.com";

    const [productSlugs, articleSlugs, portfolioSlugs] = await Promise.all([
        getAllProductSlugs(),
        getAllArticleSlugs(),
        getAllPortfolioSlugs(),
    ]);

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/product`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/overview`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/knowledge`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/layanan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];

    const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
        url: `${baseUrl}/product/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
        url: `${baseUrl}/knowledge/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    const portfolioPages: MetadataRoute.Sitemap = portfolioSlugs.map((slug) => ({
        url: `${baseUrl}/portfolio/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...articlePages, ...portfolioPages];
}
