import 'server-only';
import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";
import type { ProductFormInput } from "@/shared/lib/validations/product";

// ══════════════════════════════════════
// Product Data Access Layer
// ══════════════════════════════════════
// Rule #2:  All Prisma calls live here.
// Rule #3:  Every query uses explicit `select`.
// Rule #7:  Public catalog data cached via unstable_cache.
// Rule #14: findUnique for slug lookups.

// ── READS ──

/** Get single product by slug — includes images, category, specs, faqs */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, sku: true, name: true, scientificName: true,
      description: true, price: true, compareAtPrice: true,
      discountPct: true, stock: true, careDifficulty: true,
      sizeOptions: true, labels: true, specs: true, faqs: true,
      isActive: true, categoryId: true,
      images: { select: { id: true, url: true, alt: true }, orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true } },
      curator: {
        select: {
          id: true, shortName: true,
          title: true, avatar: true, bio: true,
          badge: true, verificationNote: true,
          user: { select: { name: true } },
        },
      },
    },
  });
}

/** Fast existence check — returns boolean, no full data load.
 *  Used BEFORE Suspense boundaries to enable proper HTTP 404.
 *  See: streaming.mdx line 635 */
export async function checkProductSlugExists(slug: string): Promise<boolean> {
  const result = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });
  return result !== null;
}

/** Cached product catalog for public listings */
export const getCachedProducts = unstable_cache(
  async (opts?: { categorySlug?: string; take?: number }) => {
    return prisma.product.findMany({
      where: {
        isActive: true,
        ...(opts?.categorySlug && { category: { slug: opts.categorySlug } }),
      },
      take: opts?.take ?? 50,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, slug: true, name: true, scientificName: true,
        price: true, compareAtPrice: true, discountPct: true,
        stock: true, careDifficulty: true, labels: true,
        sizeOptions: true, specs: true, isActive: true,
        images: { select: { url: true, alt: true }, orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    });
  },
  ["products-catalog"],
  { revalidate: 3600, tags: ["products"] }
);

/** All active product slugs — for generateStaticParams */
export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map(p => p.slug);
}

/** Similar products (exclude current slug) — for product detail recommendations */
export async function getSimilarProducts(excludeSlug: string, categoryId?: string, take = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      slug: { not: excludeSlug },
      ...(categoryId && { categoryId }),
    },
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, slug: true, name: true, scientificName: true,
      price: true, compareAtPrice: true, discountPct: true,
      labels: true, stock: true,
      images: { select: { url: true, alt: true }, orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });
}

/** Search products by name/scientific name — for search suggestions */
export async function searchProducts(query: string, take = 5) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { scientificName: { contains: query } },
      ],
    },
    take,
    select: {
      slug: true, name: true, scientificName: true, price: true,
      labels: true,
      images: { select: { url: true, alt: true }, take: 1 },
    },
  });
}

/** Get product by ID — for cart/wishlist resolution */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true, slug: true, name: true, scientificName: true,
      price: true, compareAtPrice: true, discountPct: true,
      stock: true, isActive: true,
      images: { select: { url: true, alt: true }, orderBy: { sortOrder: "asc" }, take: 1 },
      labels: true,
    },
  });
}

// ── WRITES ──

/** Create new product with images — Rule #5: $transaction for multi-table */
export async function createProduct(
  data: ProductFormInput,
  imageUrls: { url: string; alt: string }[]
) {
  const slug = generateSlug(data.name);

  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        slug,
        sku: data.sku,
        name: data.name,
        scientificName: data.scientificName || null,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        compareAtPrice: data.compareAtPrice
          ? new Prisma.Decimal(data.compareAtPrice)
          : null,
        discountPct: data.discountPct,
        stock: data.stock,
        careDifficulty: data.careDifficulty,
        sizeOptions: data.sizeOptions,
        labels: data.labels,
        specs: data.specs as unknown as Prisma.InputJsonValue,
        faqs: data.faqs as unknown as Prisma.InputJsonValue,
        isActive: data.isActive,
        categoryId: data.categoryId,
        curatorId: data.curatorId || null,
        images: {
          create: imageUrls.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: i,
          })),
        },
      },
      select: { id: true, slug: true },
    });
    return created;
  });

  revalidateTag("products");
  return product;
}

/** Update existing product — Rule #13: handle P2002/P2025 */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormInput>,
  imageUrls?: { url: string; alt: string }[]
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.sku !== undefined && { sku: data.sku }),
          ...(data.scientificName !== undefined && {
            scientificName: data.scientificName || null,
          }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.price !== undefined && {
            price: new Prisma.Decimal(data.price),
          }),
          ...(data.compareAtPrice !== undefined && {
            compareAtPrice: data.compareAtPrice
              ? new Prisma.Decimal(data.compareAtPrice)
              : null,
          }),
          ...(data.discountPct !== undefined && {
            discountPct: data.discountPct,
          }),
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.careDifficulty !== undefined && {
            careDifficulty: data.careDifficulty,
          }),
          ...(data.sizeOptions !== undefined && {
            sizeOptions: data.sizeOptions,
          }),
          ...(data.labels !== undefined && { labels: data.labels }),
          ...(data.specs !== undefined && { specs: data.specs as unknown as Prisma.InputJsonValue }),
          ...(data.faqs !== undefined && { faqs: data.faqs as unknown as Prisma.InputJsonValue }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.categoryId !== undefined && {
            categoryId: data.categoryId,
          }),
          ...(data.curatorId !== undefined && {
            curatorId: data.curatorId || null,
          }),
        },
        select: { id: true, slug: true },
      });

      // Replace images if provided
      if (imageUrls) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: imageUrls.map((img, i) => ({
            productId: id,
            url: img.url,
            alt: img.alt,
            sortOrder: i,
          })),
        });
      }

      return updated;
    });

    revalidateTag("products");
    revalidateTag(`product-${id}`);
    return { success: true as const, data: result };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false as const, error: "SKU sudah digunakan" };
      }
      if (error.code === "P2025") {
        return { success: false as const, error: "Produk tidak ditemukan" };
      }
    }
    throw error;
  }
}

/** Delete product (hard delete) */
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidateTag("products");
    return { success: true as const };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false as const, error: "Produk tidak ditemukan" };
      }
    }
    throw error;
  }
}

/** Update stock only — used by inline inventory editor */
export async function updateProductStock(id: string, stock: number) {
  await prisma.product.update({
    where: { id },
    data: { stock },
    select: { id: true },
  });
  revalidateTag("products");
  revalidateTag(`product-${id}`);
}

/** Get product for admin edit form (includes ALL fields) */
export async function getProductForEdit(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true, slug: true, sku: true, name: true, scientificName: true,
      description: true, price: true, compareAtPrice: true,
      discountPct: true, stock: true, careDifficulty: true,
      sizeOptions: true, labels: true, specs: true, faqs: true,
      isActive: true, categoryId: true, curatorId: true,
      images: {
        select: { id: true, url: true, alt: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
      },
      category: { select: { id: true, name: true, slug: true } },
      curator: { select: { id: true, shortName: true, user: { select: { name: true } } } },
    },
  });
}

/** Get all staff profiles for curator dropdown */
export async function getStaffProfiles() {
  return prisma.staffProfile.findMany({
    select: { id: true, shortName: true, title: true, user: { select: { name: true } } },
    orderBy: { teamSortOrder: "asc" },
  });
}

// ── Helpers ──

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
