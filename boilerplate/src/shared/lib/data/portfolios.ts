import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import { unstable_cache } from "next/cache";

// ══════════════════════════════════════
// Portfolio Data Access Layer
// ══════════════════════════════════════

/** Get single portfolio by slug — full detail with images and delivery stages */
export async function getPortfolioBySlug(slug: string) {
  return prisma.portfolio.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, category: true,
      heroImage: true, description: true, challenge: true,
      solution: true, result: true, specs: true, tags: true,
      images: {
        select: { id: true, url: true, alt: true },
        orderBy: { sortOrder: "asc" },
      },
      deliveryStages: {
        select: {
          id: true, step: true, label: true,
          description: true, icon: true, images: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

/** Fast existence check — returns boolean, no full data load.
 *  Used BEFORE Suspense boundaries to enable proper HTTP 404.
 *  See: streaming.mdx line 635 */
export async function checkPortfolioSlugExists(slug: string): Promise<boolean> {
  const result = await prisma.portfolio.findUnique({
    where: { slug },
    select: { id: true },
  });
  return result !== null;
}

/** Cached portfolio listings */
export const getCachedPortfolios = unstable_cache(
  async () => {
    return prisma.portfolio.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true, title: true, category: true,
        heroImage: true, specs: true, tags: true,
      },
    });
  },
  ["portfolios"],
  { revalidate: 86400, tags: ["portfolios"] }
);

/** All portfolio slugs — for generateStaticParams */
export async function getAllPortfolioSlugs() {
  const portfolios = await prisma.portfolio.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return portfolios.map(p => p.slug);
}

/** Related portfolios — exclude current, limit 2 */
export async function getRelatedPortfolios(excludeSlug: string, take = 2) {
  return prisma.portfolio.findMany({
    where: { isPublished: true, slug: { not: excludeSlug } },
    take,
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true, title: true, category: true,
      heroImage: true, specs: true,
    },
  });
}
