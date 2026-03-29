// Server Component — data lookup + SEO metadata at server level
// Client rendering delegated to ProductDetailClient
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checkProductSlugExists, getProductBySlug, getAllProductSlugs, getSimilarProducts } from "@/shared/lib/data/products";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { hasUserPurchasedProduct } from "@/shared/lib/data/orders";
import ProductDetailClient from "@/shared/components/pdp/ProductDetailClient";
import { BreadcrumbJsonLd } from "@/shared/components/seo/BreadcrumbJsonLd";
import ProductJsonLd from "@/shared/components/pdp/ProductJsonLd";

// Product detail — revalidate every 1 hour
export const revalidate = 3600;

// With DB-backed data, new products can be added at runtime.
// Allow dynamic params so unlisted slugs try a DB lookup first.
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const plant = await getProductBySlug(params.slug);
    if (!plant) return { title: "Produk Tidak Ditemukan" };

    const ogImage = plant.images?.[0]?.url || "";

    return {
        title: plant.name,
        description: plant.description?.substring(0, 160),
        alternates: {
            canonical: `/product/${params.slug}`,
        },
        openGraph: {
            title: plant.name,
            description: plant.description?.substring(0, 160),
            images: ogImage ? [{ url: ogImage }] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    // ── Fast existence check BEFORE any Suspense boundary ──
    // Per Next.js docs (streaming.mdx:636): ensures HTTP 404 for nonexistent slugs
    const exists = await checkProductSlugExists(params.slug);
    if (!exists) notFound();

    // ── Full data fetch (existence confirmed) ──
    const dbPlant = await getProductBySlug(params.slug);
    if (!dbPlant) notFound(); // Safety net — should not happen

    const dbSimilar = await getSimilarProducts(params.slug, dbPlant.categoryId ?? undefined);

    // ── Auth + purchase check for reviews ──
    const currentUser = await getCurrentUser();
    const hasPurchased = currentUser
       ? await hasUserPurchasedProduct(currentUser.id, dbPlant.id)
       : false;

    // ── Transform DB shape → ProductDetailClient expected shape ──
    const price = Number(dbPlant.price);
    const compareAt = dbPlant.compareAtPrice ? Number(dbPlant.compareAtPrice) : null;
    const specs = (dbPlant.specs || {}) as Record<string, unknown>;
    const sku = dbPlant.sku || dbPlant.id;

    // Computed fields — derived from existing data, no admin input needed
    const scientificName = dbPlant.scientificName || "";
    const cultivar = scientificName.match(/'([^']+)'/)?.[1] || null;
    const genus = scientificName.split(" ")[0] || null;
    const family = (specs.family as string) || deriveFamilyFromCategory(dbPlant.category?.name);
    const isToxic = String(specs.toxicity || "").toLowerCase().includes("toxic")
      && !String(specs.toxicity || "").toLowerCase().includes("non-toxic");
    const petSafe = !isToxic;
    const childrenSafe = (specs.childrenSafe as boolean) ?? !isToxic;

    const rawPlant = {
        id: dbPlant.id,
        slug: dbPlant.slug,
        sku,
        name: dbPlant.name,
        scientificName,
        cultivar,
        genus,
        family,
        category: dbPlant.category?.name || "Tanaman",
        basePriceStr: `Rp ${price.toLocaleString("id-ID")}`,
        discountPriceStr: compareAt ? `Rp ${price.toLocaleString("id-ID")}` : null,
        discountPercentage: dbPlant.discountPct,
        stock: dbPlant.stock,
        isAvailable: dbPlant.stock > 0,
        careDifficulty: dbPlant.careDifficulty,
        sizeOptions: (dbPlant.sizeOptions || []) as string[],
        images: dbPlant.images.map((img) => ({ url: img.url, alt: img.alt || dbPlant.name })),
        labels: (dbPlant.labels || []) as string[],
        description: dbPlant.description || "",
        specs: {
            light: String(specs.light || "Indirect"),
            water: String(specs.water || "Moderate"),
            soil: String(specs.soil || "Well-draining"),
            humidity: String(specs.humidity || "50% - 70%"),
            temperature: String(specs.temperature || "18°C - 28°C"),
            toxicity: String(specs.toxicity || "Non-toxic"),
        },
        // Extended specs — optional, with defaults
        extendedSpecs: {
            height: (specs.height as string) || null,
            potSize: (specs.potSize as string) || null,
            growthRate: (specs.growthRate as string) || null,
            careTips: (specs.careTips as string) || null,
            fertilizing: (specs.fertilizing as string) || null,
            careDetails: (specs.careDetails as Record<string, string>) || null,
            handling: (specs.handling as string) || null,
            originRegions: (specs.originRegions as string[]) || null,
            habitat: (specs.habitat as string) || null,
            usageTags: (specs.usageTags as { icon: string; label: string }[]) || null,
            benefits: (specs.benefits as { icon: string; label: string; description: string }[]) || null,
            packagingType: (specs.packagingType as string) || null,
            acclimationGuide: (specs.acclimationGuide as string) || null,
        },
        // Safety — derived
        isToxic,
        petSafe,
        childrenSafe,
        // Curator / E-E-A-T
        expert: dbPlant.curator ? {
            name: dbPlant.curator.user?.name || dbPlant.curator.shortName,
            shortName: dbPlant.curator.shortName,
            title: dbPlant.curator.title,
            avatar: dbPlant.curator.avatar,
            bio: dbPlant.curator.bio,
        } : null,
        reviewsSummary: { average: 0, count: 0, distribution: {} },
        faqs: (dbPlant.faqs || []) as { q: string; a: string }[],
        reviews: [],
        isLoggedIn: !!currentUser,
        hasPurchased,
    };

    const similarPlants = dbSimilar.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        scientificName: p.scientificName || "",
        basePriceStr: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
        images: p.images.map((img) => ({ url: img.url, alt: img.alt || p.name })),
        labels: (p.labels || []) as string[],
    }));

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Beranda", url: "https://bmjplantstore.com" },
                { name: "Produk", url: "https://bmjplantstore.com/product" },
                { name: dbPlant.name, url: `https://bmjplantstore.com/product/${params.slug}` },
            ]} />
            <ProductJsonLd
                name={dbPlant.name}
                description={dbPlant.description || ""}
                image={dbPlant.images[0]?.url}
                price={Number(dbPlant.price)}
                currency="IDR"
                availability={dbPlant.stock > 0 ? "InStock" : "OutOfStock"}
                sku={sku}
                brand="BMJ Plant Store"
                url={`https://bmjplantstore.com/product/${params.slug}`}
            />
            <ProductDetailClient
                rawPlant={rawPlant}
                similarPlants={similarPlants}
            />
        </>
    );
}

/** Derive botanical family from category name.
 *  Most BMJ products are Araceae family. */
function deriveFamilyFromCategory(categoryName?: string): string {
  if (!categoryName) return "Araceae";
  const familyMap: Record<string, string> = {
    Monstera: "Araceae",
    Philodendron: "Araceae",
    Anthurium: "Araceae",
    Alocasia: "Araceae",
    Syngonium: "Araceae",
    Calathea: "Marantaceae",
    Fern: "Polypodiaceae",
    Succulent: "Crassulaceae",
  };
  return familyMap[categoryName] || "Araceae";
}
