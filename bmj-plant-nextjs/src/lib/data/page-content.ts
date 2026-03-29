import 'server-only';
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

// ══════════════════════════════════════
// PageContent Data Access Layer
// ══════════════════════════════════════
// Generic fetcher for CMS JSON blobs stored in page_contents table.
// Each page's full mock data is stored as a single JSON object.

/** Generic page content fetcher — caches for 15 minutes */
export function getPageContent<T = Record<string, unknown>>(key: string) {
  return unstable_cache(
    async () => {
      const page = await prisma.pageContent.findUnique({
        where: { key },
        select: { content: true },
      });
      return (page?.content ?? null) as T | null;
    },
    [`page-content-${key}`],
    { revalidate: 900, tags: ["page-content", `page-content-${key}`] }
  )();
}

/**
 * Update a specific section within a page's content JSON blob.
 * Merges sectionData into existing content[sectionKey].
 *
 * @param pageKey - The PageContent key (e.g., "homepage")
 * @param sectionKey - The section within the JSON (e.g., "hero_bento")
 * @param sectionData - Validated data to replace the section
 */
export async function updatePageContent(
  pageKey: string,
  sectionKey: string,
  sectionData: Record<string, unknown>
) {
  // Fetch existing content
  const existing = await prisma.pageContent.findUnique({
    where: { key: pageKey },
    select: { content: true },
  });

  const currentContent = (existing?.content as Record<string, unknown>) ?? {};

  // Merge: replace only the target section, keep others untouched
  const updatedContent = {
    ...currentContent,
    [sectionKey]: sectionData,
  };

  // Upsert — create if doesn't exist, update if it does
  const jsonContent = updatedContent as Prisma.InputJsonValue;
  return prisma.pageContent.upsert({
    where: { key: pageKey },
    update: { content: jsonContent },
    create: { key: pageKey, content: jsonContent },
    select: { key: true, updatedAt: true },
  });
}

/**
 * Get all page content as raw JSON (for admin editor).
 * Not cached — admin always sees latest data.
 */
export async function getPageContentForAdmin(pageKey: string) {
  const page = await prisma.pageContent.findUnique({
    where: { key: pageKey },
    select: { content: true, updatedAt: true },
  });
  return page;
}

