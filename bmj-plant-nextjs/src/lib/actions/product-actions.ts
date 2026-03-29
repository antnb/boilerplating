"use server";

import { getProductById } from "@/lib/data/products";

/**
 * Server action to resolve a product ID to basic product data.
 * Used by client-side cart/wishlist hooks that need product info.
 */
export async function resolveProductAction(productId: string) {
  const product = await getProductById(productId);
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    scientificName: product.scientificName,
    price: Number(product.price),
    stock: product.stock,
    images: product.images.map((img) => ({ src: img.url, alt: img.alt })),
    labels: (product.labels || []) as string[],
    discountPercentage: product.discountPct,
  };
}
