"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import SearchStrip from "@/components/product/SearchStrip";
import ShopToolbar from "@/components/product/ShopToolbar";
import ShopSidebar from "@/components/product/ShopSidebar";
import MobileFilterDrawer from "@/components/product/MobileFilterDrawer";
import ProductCard from "@/components/product/ProductCard";
import ShippingStrip from "@/components/product/ShippingStrip";
import GuaranteeBanner from "@/components/product/GuaranteeBanner";
import B2BCta from "@/components/product/B2BCta";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { parsePrice } from "@/lib/utils/plant-helpers";

// ── Type for product data received from server ──
interface ProductData {
  id: string;
  name: string;
  slug: string;
  scientificName: string;
  price: number;
  originalPrice: number;
  stock: number;
  plantGroup: { name: string; slug: string };
  plantType: { name: string; slug: string };
  images: { src: string; alt: string }[];
  family: string | null;
  usageIndoor: boolean;
  usageOutdoor: boolean;
  usageAirPurifier: boolean;
  usageHanging: boolean;
  usageTerrarium: boolean;
  usageGift: boolean;
  description: string;
  labels: string[];
  rating?: number;
  reviewCount?: number;
  specs: Record<string, string>;
  careDifficulty: number;
  discountPercentage: number;
}

interface GroupData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  _count: { plants: number };
}

interface Props {
  products: ProductData[];
  groups: GroupData[];
}

const ITEMS_PER_PAGE = 12;

export default function ProductListingPage({ products, groups }: Props) {
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [quickViewPlant, setQuickViewPlant] = useState<ProductData | null>(null);

  // Parse URL params
  const minPrice = searchParams?.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams?.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const sort = searchParams?.get("sort") || "newest";
  const group = searchParams?.get("group") || undefined;
  const q = searchParams?.get("q")?.trim().toLowerCase() || undefined;
  const care = searchParams?.get("care") || undefined;

  const activeFilters = { minPrice, maxPrice, sort, group, q, care };
  const priceRange = { min: 0, max: 10000000 };

  // ── Real filtering + sorting ──
  const filteredPlants = useMemo(() => {
    let result = [...products];

    // Text search
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.scientificName?.toLowerCase().includes(q)) ||
          (p.description?.toLowerCase().includes(q)) ||
          (p.labels?.some((l) => l.toLowerCase().includes(q)))
      );
    }

    // Care difficulty
    if (care) {
      result = result.filter((p) => {
        if (care === "easy") return p.careDifficulty <= 2;
        if (care === "medium") return p.careDifficulty === 3;
        if (care === "hard") return p.careDifficulty >= 4;
        return true;
      });
    }

    // Price range
    if (minPrice) result = result.filter((p) => p.price >= minPrice);
    if (maxPrice) result = result.filter((p) => p.price <= maxPrice);
    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // newest — keep original order
        break;
    }

    return result;
  }, [products, q, minPrice, maxPrice, sort, care]);

  const visiblePlants = filteredPlants.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlants.length;

  const handleQuickView = useCallback((plant: ProductData) => {
    setQuickViewPlant(plant);
  }, []);

  return (
    <div id="page-products">
      <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-brand-dark container-page pt-6 pb-2">
        Katalog Tanaman Hias
      </h1>
      <SearchStrip defaultValue={searchParams?.get("q") || ""} />

      <ShopToolbar
        onOpenFilter={() => setIsFilterOpen(true)}
        groups={groups}
        totalCount={filteredPlants.length}
        activeSort={sort}
      />

      <div className="product-layout container-page">
        <ShopSidebar
          groups={groups}
          activeFilters={activeFilters}
          priceRange={priceRange}
        />

        <section className="product-grid-area">
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
                    badge={
                      plant.discountPercentage > 0
                        ? { label: `-${plant.discountPercentage}%`, color: "red" }
                        : plant.labels?.includes("Rare")
                          ? { label: "Rare", color: "gold" }
                          : null
                    }
                    onQuickView={() => handleQuickView(plant)}
                  />
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div className="load-more-area">
              <button
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="load-more-btn"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Muat Lebih Banyak
                <span className="text-xs opacity-40">({filteredPlants.length - visibleCount} tersisa)</span>
              </button>
              <p className="load-more-counter">Menampilkan {visibleCount} dari {filteredPlants.length} produk</p>
            </div>
          )}

          {!hasMore && filteredPlants.length > ITEMS_PER_PAGE && (
            <div className="load-more-area">
              <p className="load-more-done">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Semua {filteredPlants.length} produk ditampilkan
              </p>
            </div>
          )}

          {filteredPlants.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-muted-foreground/30 mb-4 block">search_off</span>
              <p className="text-lg font-serif font-bold mb-2">Tidak ditemukan</p>
              <p className="text-muted-foreground text-sm">
                {q ? `Tidak ada produk yang cocok dengan "${q}"` : "Tidak ada produk sesuai filter"}
              </p>
            </div>
          )}

          <div className="product-bottom-sections">
            <ShippingStrip />
            <GuaranteeBanner />
            <B2BCta />
          </div>
        </section>
      </div>

      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        groups={groups}
        activeFilters={activeFilters}
        priceRange={priceRange}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        plant={quickViewPlant ? {
          id: quickViewPlant.id,
          name: quickViewPlant.name,
          slug: quickViewPlant.slug,
          scientificName: quickViewPlant.scientificName,
          price: quickViewPlant.price,
          image: quickViewPlant.images[0]?.src || null,
          stock: quickViewPlant.stock,
          description: quickViewPlant.description,
          labels: quickViewPlant.labels,
          rating: quickViewPlant.rating,
          reviewCount: quickViewPlant.reviewCount,
          specs: quickViewPlant.specs || {},
        } : null}
        open={!!quickViewPlant}
        onClose={() => setQuickViewPlant(null)}
      />
    </div>
  );
}
