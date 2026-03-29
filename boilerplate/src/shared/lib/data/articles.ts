import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import { unstable_cache } from "next/cache";

// ══════════════════════════════════════
// Article Data Access Layer
// ══════════════════════════════════════
// Rule #3:  Every query uses explicit `select`.
// Rule #7:  Read-heavy article data cached.
// Rule #14: findUnique for slug lookups.

// ── READS ──

/** Get single article by slug — full content for article detail page */
export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, subtitle: true,
      content: true, category: true, author: true,
      heroImage: true, heroImageAlt: true,
      mobileSpecimenImage: true, mobileSpecimenLabel: true,
      readTime: true, specs: true, zone: true,
      publishedAt: true, createdAt: true, sortOrder: true,
      authorProfile: {
        select: {
          id: true,
          shortName: true, title: true,
          avatar: true, bio: true, badge: true,
          verificationNote: true,
          user: { select: { name: true } },
        },
      },
      relatedFrom: {
        select: {
          relatedArticle: {
            select: {
              slug: true, title: true, subtitle: true,
              heroImage: true, category: true, readTime: true,
            },
          },
        },
      },
    },
  });
}

/** Fast existence check — returns boolean, no full data load.
 *  Used BEFORE Suspense boundaries to enable proper HTTP 404.
 *  See: streaming.mdx line 635 */
export async function checkArticleSlugExists(slug: string): Promise<boolean> {
  const result = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });
  return result !== null;
}

/** Cached article listings — for knowledge page sections */
export const getCachedArticles = unstable_cache(
  async (opts?: { zone?: string; take?: number }) => {
    return prisma.article.findMany({
      where: {
        isPublished: true,
        ...(opts?.zone && { zone: opts.zone }),
      },
      take: opts?.take,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        slug: true, title: true, subtitle: true,
        category: true, author: true, readTime: true,
        heroImage: true, heroImageAlt: true, zone: true,
      },
    });
  },
  ["articles"],
  { revalidate: 86400, tags: ["articles"] }
);

/** All published article slugs — for generateStaticParams */
export async function getAllArticleSlugs() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return articles.map(a => a.slug);
}

/** Featured article — for knowledge page hero */
export const getFeaturedArticle = unstable_cache(
  async () => {
    return prisma.article.findFirst({
      where: { isPublished: true, isFeatured: true },
      select: {
        slug: true, title: true, subtitle: true,
        category: true, author: true, readTime: true,
        heroImage: true, heroImageAlt: true,
      },
    });
  },
  ["featured-article"],
  { revalidate: 86400, tags: ["articles"] }
);
