// Server Component — wraps client component in Suspense boundary
// Required by Next.js App Router for useSearchParams() support
import type { Metadata } from "next";
import { Suspense } from "react";
import ProductListingPage from "@/views/ProductListingPage";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getCachedProducts } from "@/lib/data/products";
import { getCachedCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
    title: "Katalog Tanaman Hias",
    description: "Koleksi lengkap tanaman hias premium — Monstera, Philodendron, Alocasia, dan tanaman tropis langka.",
    alternates: {
        canonical: "/product",
    },
    openGraph: {
        title: "Katalog Tanaman Hias | BMJ Plant Store",
        description: "Koleksi lengkap tanaman hias premium — Monstera, Philodendron, Alocasia, dan tanaman tropis langka.",
        url: "/product",
    },
};

// Product listing — revalidate every 1 hour (products change moderately)
export const revalidate = 3600;

export default async function Page() {
    const [dbProducts, dbCategories] = await Promise.all([
        getCachedProducts({ take: 50 }),
        getCachedCategories(),
    ]);

    // Transform DB products to the shape ProductListingPage expects
    const products = dbProducts.map((p) => {
        const specs = (p.specs || {}) as Record<string, unknown>;
        const labelsArr = (p.labels || []) as string[];
        const usageTags = (specs.usageTags as { icon: string; label: string }[]) || [];
        const usageLabels = usageTags.map(t => t.label.toLowerCase());

        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            scientificName: p.scientificName ?? "",
            price: Number(p.price),
            originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : Number(p.price),
            stock: p.stock,
            plantGroup: { name: p.category?.name || "Tanaman", slug: p.category?.slug || "tanaman" },
            plantType: { name: p.category?.name || "Indoor", slug: p.category?.slug || "indoor" },
            images: p.images.map((img) => ({ src: img.url, alt: img.alt })),
            family: (specs.family as string) || null,
            usageIndoor: usageLabels.includes("indoor") || usageTags.length === 0,
            usageOutdoor: usageLabels.includes("outdoor teduh") || usageLabels.includes("outdoor"),
            usageAirPurifier: labelsArr.includes("Air Purifier") || usageLabels.includes("air purifier"),
            usageHanging: usageLabels.includes("hanging"),
            usageTerrarium: usageLabels.includes("terrarium"),
            usageGift: labelsArr.includes("Gift") || usageLabels.includes("gift"),
            description: "",
            labels: labelsArr,
            rating: undefined as number | undefined,
            reviewCount: undefined as number | undefined,
            specs: {
              light: String(specs.light || ""),
              water: String(specs.water || ""),
            } as Record<string, string>,
            careDifficulty: p.careDifficulty,
            discountPercentage: p.discountPct,
        };
    });

    const groups = dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        tagline: c.description || "",
        description: c.description || "",
        _count: { plants: 0 },
    }));

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Beranda", url: "https://bmjplantstore.com" },
                { name: "Produk", url: "https://bmjplantstore.com/product" },
            ]} />
            <Suspense>
                <ProductListingPage products={products} groups={groups} />
            </Suspense>
        </>
    );
}
