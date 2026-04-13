"use client";

import { useState } from "react";
import { EmptySearchResults } from "@/shared/components/ui/empty-states";
import SearchStrip from "@/shared/components/product/SearchStrip";
import ShopToolbar from "@/shared/components/product/ShopToolbar";
import ShopSidebar from "@/shared/components/product/ShopSidebar";
import MobileFilterDrawer from "@/shared/components/product/MobileFilterDrawer";
import ProductCard from "@/shared/components/product/ProductCard";
import ShippingStrip from "@/shared/components/product/ShippingStrip";
import GuaranteeBanner from "@/shared/components/product/GuaranteeBanner";
import B2BCta from "@/shared/components/product/B2BCta";

type PlantItem = {
    id: string;
    name: string;
    slug: string;
    scientificName: string | null;
    price: number;
    stock: number;
    plantGroup: { name: string; slug: string } | null;
    plantType: { name: string; slug: string } | null;
    images: { src: string; alt: string | null }[];
    family?: string | null;
    usageIndoor?: boolean;
    usageOutdoor?: boolean;
    usageAirPurifier?: boolean;
    usageHanging?: boolean;
    usageTerrarium?: boolean;
    usageGift?: boolean;
};

type GroupItem = {
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    _count: { plants: number };
};

export type ActiveFilters = {
    minPrice?: number;
    maxPrice?: number;
    sort: string;
    group?: string;
    q?: string;
    care?: string; // "easy" | "medium" | "hard"
};

export type PriceRange = {
    min: number;
    max: number;
};

interface ProductListingClientProps {
    plants: PlantItem[];
    groups: GroupItem[];
    totalPlants: number;
    activeFilters: ActiveFilters;
    priceRange: PriceRange;
    sidebarSettings?: Record<string, unknown>;
}

const ITEMS_PER_PAGE = 12;

export default function ProductListingClient({
    plants,
    groups,
    totalPlants,
    activeFilters,
    priceRange,
    sidebarSettings,
}: ProductListingClientProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const visiblePlants = plants.slice(0, visibleCount);
    const hasMore = visibleCount < plants.length;

    return (
        <div id="page-products">
            {/* V4D: Dark Search Strip (replaces ShopHero) */}
            <SearchStrip defaultValue={activeFilters.q} />

            {/* V4D: HeaderBar (mobile pills + desktop breadcrumb/H1/sort pills) */}
            <ShopToolbar
                onOpenFilter={() => setIsFilterOpen(true)}
                groups={groups}
                totalCount={totalPlants}
                activeSort={activeFilters.sort}
            />

            {/* Main Content: Sidebar + Grid */}
            <div className="product-layout container-page">
                {/* Desktop Sidebar */}
                <ShopSidebar
                    groups={groups}
                    activeFilters={activeFilters}
                    priceRange={priceRange}
                    sidebarSettings={sidebarSettings}
                />

                {/* Product Grid + Bottom Sections */}
                <section className="product-grid-area">
                    {/* Product Grid */}
                    <ul role="list" id="product-grid">
                        {visiblePlants.map((plant) => {
                            const featuredImage = plant.images[0];
                            return (
                                <li key={plant.id}>
                                    <ProductCard
                                        plantId={plant.id}
                                        name={plant.name}
                                        scientificName={plant.scientificName}
                                        price={plant.price}
                                        slug={plant.slug}
                                        image={featuredImage?.src ?? null}
                                        imageAlt={featuredImage?.alt ?? null}
                                        stock={plant.stock}
                                        family={plant.family}
                                        usageIndoor={plant.usageIndoor}
                                        usageOutdoor={plant.usageOutdoor}
                                        usageAirPurifier={plant.usageAirPurifier}
                                        usageHanging={plant.usageHanging}
                                        usageTerrarium={plant.usageTerrarium}
                                        usageGift={plant.usageGift}
                                    />
                                </li>
                            );
                        })}
                    </ul>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="load-more-area">
                            <button
                                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                                className="load-more-btn"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Muat Lebih Banyak
                                <span className="text-xs opacity-40">
                                    ({plants.length - visibleCount} tersisa)
                                </span>
                            </button>
                            <p className="load-more-counter">
                                Menampilkan {visibleCount} dari {plants.length} produk
                            </p>
                        </div>
                    )}

                    {/* All Loaded Indicator */}
                    {!hasMore && plants.length > ITEMS_PER_PAGE && (
                        <div className="load-more-area">
                            <p className="load-more-done">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Semua {plants.length} produk ditampilkan
                            </p>
                        </div>
                    )}

                    {/* Empty State */}
                    {plants.length === 0 && (
                        <EmptySearchResults query={activeFilters.q} />
                    )}

                    {/* Bottom Sections */}
                    <div className="product-bottom-sections">
                        <ShippingStrip />
                        <GuaranteeBanner />
                        <B2BCta />
                    </div>
                </section>
            </div>

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                groups={groups}
                activeFilters={activeFilters}
                priceRange={priceRange}
            />
        </div>
    );
}
