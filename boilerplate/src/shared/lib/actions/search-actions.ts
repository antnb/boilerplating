"use server";

import { searchProducts } from "@/shared/lib/data/products";
import { searchQuerySchema } from "@/shared/lib/validations/admin";

/**
 * Server action for search suggestions — searches products by name/scientific name.
 */
export async function searchProductsAction(query: string) {
  const parsed = searchQuerySchema.safeParse({ query });
  if (!parsed.success || !parsed.data.query) return [];

  const results = await searchProducts(parsed.data.query, 5);
  return results.map((p) => ({
    slug: p.slug,
    name: p.name,
    scientificName: p.scientificName,
    price: Number(p.price),
    labels: (p.labels || []) as string[],
    image: p.images?.[0]?.url || null,
  }));
}
