import Link from "next/link";
import type { CatalogSectionData } from "@/lib/schemas/homepage-sections";
import ProductCard from "@/components/product/ProductCard";
import { StaggerChildren } from "@/components/layout/StaggerChildren";

/* ═══════════════════════════════════════════════════════════
   Section 3: Spesimen Terpilih (Catalog)

   Data flow:
   - `settings` from admin (heading, subtitle, ctaLabel, badge config)
   - `plants` from DB (getFeaturedPlants / getPlantsByIds)
   - `topSellerIds` from DB (getTopSellingPlantIds)
   ═══════════════════════════════════════════════════════════ */

// ── Types matching publicPlantSelect shape ──
type PlantCard = {
    id: string;
    name: string;
    slug: string;
    scientificName: string | null;
    price: number;
    stock: number;
    createdAt: Date;
    family: string | null;
    usageIndoor: boolean;
    usageOutdoor: boolean;
    usageAirPurifier: boolean;
    usageHanging: boolean;
    usageTerrarium: boolean;
    usageGift: boolean;
    plantGroup: { name: string; slug: string };
    plantType: { name: string; slug: string };
    images: { src: string; alt: string | null }[];
};

type Props = {
    settings?: CatalogSectionData;
    plants: PlantCard[];
    topSellerIds?: string[];
};

// ── Badge resolution (priority: Low Stock > Best Seller > New) ──
type BadgeInfo = { label: string; color: "red" | "gold" | "green" };

function getBadge(
    plant: PlantCard,
    topSellerIds: string[],
    settings?: CatalogSectionData
): BadgeInfo | null {
    const lowStockThreshold = settings?.badgeLowStockThreshold ?? 3;
    const newDays = settings?.badgeNewDays ?? 14;

    // Priority 1: Low stock (but not zero — zero shows "Habis" separately)
    if (plant.stock > 0 && plant.stock <= lowStockThreshold) {
        return { label: settings?.badgeLowStockLabel ?? "Hampir Habis", color: "red" };
    }

    // Priority 2: Best seller
    if (topSellerIds.includes(plant.id)) {
        return { label: settings?.badgeBestSellerLabel ?? "Laris", color: "gold" };
    }

    // Priority 3: New arrival
    const daysSinceCreated = Math.floor(
        (Date.now() - new Date(plant.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= newDays) {
        return { label: settings?.badgeNewLabel ?? "Baru", color: "green" };
    }

    return null;
}

export function CatalogSection({ settings, plants, topSellerIds = [] }: Props) {
    const heading = settings?.heading ?? "Spesimen";
    const highlightText = settings?.highlightText ?? "Terpilih";
    const subtitle = settings?.subtitle ?? "Dipilih langsung dari kebun Bumi Mekarsari Jaya";
    const ctaLabel = settings?.ctaLabel ?? "Lihat Semua";
    const ctaHref = settings?.ctaHref ?? "/product";

    // Empty state
    if (plants.length === 0) {
        return null;
    }

    return (
        <section id="catalog-section" className="flex flex-col">
            {/* ── Section Header ── */}
            <header className="catalog-header">
                {/* Eyebrow + Title Block */}
                <div className="catalog-header__left">
                    <span className="catalog-eyebrow">
                        <span className="material-symbols-outlined text-sm">eco</span>
                        Koleksi Pilihan
                    </span>
                    <h2 className="catalog-title">
                        {heading}
                        <span className="catalog-title__highlight">{highlightText}</span>
                    </h2>
                    <p className="catalog-subtitle">{subtitle}</p>
                </div>

                {/* CTA Block */}
                <div className="catalog-header__right">
                    <Link href={ctaHref} className="catalog-cta">
                        <span className="catalog-cta__text">{ctaLabel}</span>
                        <span className="catalog-cta__icon">
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </span>
                    </Link>
                </div>
            </header>

            {/* Product Grid — 2-col mobile, 4-col desktop */}
            <StaggerChildren stagger={0.1} className="grid grid-cols-2 lg:grid-cols-4 catalog-grid mt-4 md:mt-5">
                {plants.map((plant) => {
                    const featuredImage = plant.images[0];
                    const badge = getBadge(plant, topSellerIds, settings);

                    return (
                        <ProductCard
                            key={plant.id}
                            plantId={plant.id}
                            name={plant.name}
                            scientificName={plant.scientificName}
                            price={plant.price}
                            slug={plant.slug}
                            image={featuredImage?.src || null}
                            imageAlt={featuredImage?.alt || null}
                            stock={plant.stock}
                            badge={badge}
                            family={plant.family}
                            usageIndoor={plant.usageIndoor}
                            usageOutdoor={plant.usageOutdoor}
                            usageAirPurifier={plant.usageAirPurifier}
                            usageHanging={plant.usageHanging}
                            usageTerrarium={plant.usageTerrarium}
                            usageGift={plant.usageGift}
                        />
                    );
                })}
            </StaggerChildren>

            {/* Empty state — should not trigger since parent checks */}
            {plants.length === 0 && (
                <div className="text-center py-12 text-brand-dark/40">
                    <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                    <p className="text-sm">Belum ada produk yang tersedia.</p>
                </div>
            )}
        </section>
    );
}
