import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import { unstable_cache } from "next/cache";

// ══════════════════════════════════════
// Category Data Access Layer
// ══════════════════════════════════════

/** Cached categories — revalidate daily (categories rarely change) */
export const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, description: true },
    });
  },
  ["categories"],
  { revalidate: 86400, tags: ["categories"] }
);
