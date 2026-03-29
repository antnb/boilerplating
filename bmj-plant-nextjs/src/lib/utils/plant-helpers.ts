// ── Types ──

export interface ResolvedPlant {
  id: string;
  name: string;
  slug: string;
  scientificName: string;
  price: number;
  stock: number;
  images: { src: string; alt: string }[];
  labels: string[];
  discountPercentage: number;
}

// ── Price parsing ──

/**
 * Parses a formatted Indonesian price string like "Rp 3.800.000" to 3800000.
 * Returns 0 if parsing fails.
 */
export function parsePrice(priceStr: string | null | undefined): number {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
}

// Note: resolvePlant and resolvePlants are no longer needed here.
// Product lookup should be done via DAL: getProductById from "@/lib/data/products".
// These functions are kept as stubs for backward compatibility during migration.
// After all consumers are updated, they should be removed.
