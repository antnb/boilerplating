"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/shared/hooks/useWishlist";
import { resolveProductAction } from "@/shared/lib/actions/product-actions";
import type { ResolvedPlant } from "@/shared/lib/utils/plant-helpers";
import ProductCard from "@/shared/components/product/ProductCard";

export default function WishlistContent() {
    const { items: wishlistIds, count, clearWishlist } = useWishlist();
    const [wishlistedPlants, setWishlistedPlants] = useState<ResolvedPlant[]>([]);
    const [isResolving, setIsResolving] = useState(false);

    // Resolve wishlist IDs → full plant data via server action
    useEffect(() => {
        if (wishlistIds.length === 0) {
            setWishlistedPlants([]);
            return;
        }

        let cancelled = false;
        setIsResolving(true);

        Promise.all(
            wishlistIds.map(async (id) => {
                const resolved = await resolveProductAction(id);
                if (!resolved) return null;
                return {
                    id: resolved.id,
                    name: resolved.name,
                    slug: resolved.slug,
                    scientificName: resolved.scientificName || "",
                    price: resolved.price,
                    stock: resolved.stock,
                    images: resolved.images,
                    labels: resolved.labels,
                    discountPercentage: resolved.discountPercentage,
                } as ResolvedPlant;
            })
        ).then((results) => {
            if (!cancelled) {
                setWishlistedPlants(results.filter((p): p is ResolvedPlant => p !== null));
                setIsResolving(false);
            }
        });

        return () => { cancelled = true; };
    }, [wishlistIds]);

    // ── Empty state ──
    if (count === 0) {
        return (
            <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-muted-foreground/25 mb-4 block">
                    favorite
                </span>
                <p className="text-lg font-serif font-bold mb-2">
                    Wishlist Anda masih kosong
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                    Temukan tanaman hias favorit dan simpan di sini!
                </p>
                <Link
                    href="/product"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-brand-forest-dark transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">local_florist</span>
                    Jelajahi Katalog
                </Link>
            </div>
        );
    }

    // ── Loading state while resolving ──
    if (isResolving && wishlistedPlants.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground text-sm">Memuat wishlist...</p>
            </div>
        );
    }

    // ── Wishlist grid ──
    return (
        <div>
            {/* Header row with count + clear button */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                    {count} tanaman di wishlist Anda
                </p>
                <button
                    onClick={clearWishlist}
                    className="text-sm text-destructive hover:text-destructive/80 transition-colors font-medium flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-base">delete_sweep</span>
                    Hapus Semua
                </button>
            </div>

            {/* Product grid — same layout as ProductListingPage */}
            <ul
                role="list"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            >
                {wishlistedPlants.map((plant) => {
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
                                badge={
                                    plant.discountPercentage > 0
                                        ? { label: `-${plant.discountPercentage}%`, color: "red" }
                                        : plant.labels?.includes("Rare")
                                            ? { label: "Rare", color: "gold" }
                                            : null
                                }
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
