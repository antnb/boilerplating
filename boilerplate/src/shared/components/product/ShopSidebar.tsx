"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import type { ActiveFilters, PriceRange } from "@/shared/components/product/ProductListingClient";

type GroupWithCount = {
    id: string;
    name: string;
    slug: string;
    _count: { plants: number };
};

interface ShopSidebarProps {
    groups: GroupWithCount[];
    activeFilters: ActiveFilters;
    priceRange: PriceRange;
    sidebarSettings?: Record<string, unknown>;
}

/* ── Icon mapping by GROUP NAME (lowercased) ── */
const CATEGORY_ICONS: Record<string, string> = {
    "aquatic plant": "water_drop",
    "aroid": "eco",
    "begonia": "local_florist",
    "bonsai": "park",
    "flower": "local_florist",
    "fruit": "nutrition",
    "herb": "grass",
    "hoya": "favorite",
    "jungle plant": "forest",
    "ornamental plant": "palette",
    "platycerium": "filter_vintage",
    "sansevieria": "straighten",
    "tanaman proyek": "domain",
    "succulent": "potted_plant",
    "cactus": "psychiatry",
    "philodendron": "nest_eco_leaf",
    "monstera": "spa",
};

const CARE_OPTIONS = [
    { value: "", label: "Semua", icon: "select_all" },
    { value: "easy", label: "Mudah", icon: "sentiment_satisfied" },
    { value: "medium", label: "Sedang", icon: "sentiment_neutral" },
    { value: "hard", label: "Sulit", icon: "sentiment_dissatisfied" },
] as const;

function getCategoryIcon(groupName: string): string {
    return CATEGORY_ICONS[groupName.toLowerCase()] || "eco";
}

export default function ShopSidebar({
    groups,
    activeFilters,
    priceRange,
    sidebarSettings,
}: ShopSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Sync local state with URL params (fixes stale state after reset/navigation)
    const [minPrice, setMinPrice] = useState<string>(
        activeFilters.minPrice?.toString() || ""
    );
    const [maxPrice, setMaxPrice] = useState<string>(
        activeFilters.maxPrice?.toString() || ""
    );

    useEffect(() => {
        setMinPrice(activeFilters.minPrice?.toString() || "");
        setMaxPrice(activeFilters.maxPrice?.toString() || "");
    }, [activeFilters.minPrice, activeFilters.maxPrice]);

    const showPriceFilter = (sidebarSettings?.showPriceFilter as boolean) ?? true;
    const showCategoryFilter = (sidebarSettings?.showCategoryFilter as boolean) ?? true;
    const ctaEnabled = (sidebarSettings?.ctaEnabled as boolean) ?? true;
    const ctaTitle = (sidebarSettings?.ctaTitle as string) || "Konsultasi Spesimen";
    const ctaDescription = (sidebarSettings?.ctaDescription as string) || "\u201cButuh bantuan memilih? Konsultasi dengan ahli kami.\u201d";
    const ctaButtonText = (sidebarSettings?.ctaButtonText as string) || "Chat WA";
    const ctaWhatsappNumber = (sidebarSettings?.ctaWhatsappNumber as string) || "6281586664516";

    const totalPlants = groups.reduce((acc, g) => acc + g._count.plants, 0);

    /** Build new URL preserving existing params */
    const pushParams = useCallback(
        (updates: Record<string, string | undefined>) => {
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            for (const [key, value] of Object.entries(updates)) {
                if (value === undefined || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }
            const qs = params.toString();
            router.push(`/product${qs ? `?${qs}` : ""}`);
        },
        [router, searchParams]
    );

    /** Build category URL preserving other filters */
    const buildCategoryUrl = useCallback(
        (groupSlug?: string) => {
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            if (groupSlug) {
                params.set("group", groupSlug);
            } else {
                params.delete("group");
            }
            // Remove search query when switching category
            params.delete("q");
            const qs = params.toString();
            return `/product${qs ? `?${qs}` : ""}`;
        },
        [searchParams]
    );

    const applyPriceFilter = useCallback(() => {
        const min = minPrice ? Number(minPrice) : undefined;
        const max = maxPrice ? Number(maxPrice) : undefined;
        if (min !== undefined && isNaN(min)) return;
        if (max !== undefined && isNaN(max)) return;
        pushParams({
            minPrice: min?.toString(),
            maxPrice: max?.toString(),
        });
    }, [minPrice, maxPrice, pushParams]);

    const handleQuickFilter = useCallback(
        (tag: string) => {
            // Toggle: if already active, clear it
            const current = activeFilters.q;
            pushParams({ q: current === tag ? undefined : tag });
        },
        [pushParams, activeFilters.q]
    );

    const handleReset = useCallback(() => {
        setMinPrice("");
        setMaxPrice("");
        router.push("/product");
    }, [router]);

    return (
        <aside
            id="shop-sidebar"
            className="hidden lg:flex flex-col gap-3 w-[260px] 2xl:w-[280px] min-[1920px]:w-[300px] shrink-0 sticky top-20 self-start max-h-[calc(100dvh-5rem)] overflow-y-auto scrollbar-thin"
            aria-label="Sidebar filter produk"
        >
            <div className="sidebar__card">

                {/* ── Kategori ── */}
                {showCategoryFilter && (
                    <>
                        <h3 className="sidebar__heading">
                            Kategori
                            <span className="material-symbols-outlined sidebar__heading-icon" aria-hidden="true">
                                category
                            </span>
                        </h3>
                        <div className="sidebar__cat-list">
                            <a
                                href={buildCategoryUrl()}
                                onClick={(e) => { e.preventDefault(); router.push(buildCategoryUrl()); }}
                                className={`sidebar__cat-item ${!activeFilters.group && !activeFilters.q ? "sidebar__cat-item--active" : ""}`}
                            >
                                <span className="sidebar__cat-icon">
                                    <span className="material-symbols-outlined text-sm" aria-hidden="true">eco</span>
                                </span>
                                <span>Semua Tanaman</span>
                                <span className="sidebar__cat-count">{totalPlants}</span>
                            </a>

                            {groups.map((group) => (
                                <a
                                    key={group.id}
                                    href={buildCategoryUrl(group.slug)}
                                    onClick={(e) => { e.preventDefault(); router.push(buildCategoryUrl(group.slug)); }}
                                    className={`sidebar__cat-item ${activeFilters.group === group.slug ? "sidebar__cat-item--active" : ""}`}
                                >
                                    <span className="sidebar__cat-icon">
                                        <span className="material-symbols-outlined text-sm" aria-hidden="true">
                                            {getCategoryIcon(group.name)}
                                        </span>
                                    </span>
                                    <span>{group.name}</span>
                                    <span className="sidebar__cat-count">{group._count.plants}</span>
                                </a>
                            ))}
                        </div>
                        <div className="sidebar__badges">
                            <div className="sidebar__badge-label">Filter Cepat</div>
                            <div className="sidebar__badge-row">
                                <button
                                    className={`sidebar__badge sidebar__badge--new ${activeFilters.q === "baru" ? "sidebar__badge--active" : ""}`}
                                    onClick={() => handleQuickFilter("baru")}
                                >
                                    <span className="material-symbols-outlined text-xs" aria-hidden="true">fiber_new</span>
                                    Baru
                                </button>
                                <button
                                    className={`sidebar__badge sidebar__badge--pop ${activeFilters.q === "populer" ? "sidebar__badge--active" : ""}`}
                                    onClick={() => handleQuickFilter("populer")}
                                >
                                    <span className="material-symbols-outlined text-xs" aria-hidden="true">whatshot</span>
                                    Populer
                                </button>
                                <button
                                    className={`sidebar__badge sidebar__badge--trend ${activeFilters.q === "rare" ? "sidebar__badge--active" : ""}`}
                                    onClick={() => handleQuickFilter("rare")}
                                >
                                    <span className="material-symbols-outlined text-xs" aria-hidden="true">trending_up</span>
                                    Rare
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Tingkat Perawatan ── */}
                <div className="sidebar__divider" />
                <details className="sidebar__collapsible" open>
                    <summary className="sidebar__heading">
                        Tingkat Perawatan
                        <span className="material-symbols-outlined sidebar__heading-icon" aria-hidden="true">
                            psychiatry
                        </span>
                    </summary>
                    <div className="sidebar__care-list">
                        {CARE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                className={`sidebar__care-item ${(activeFilters.care || "") === opt.value ? "sidebar__care-item--active" : ""}`}
                                onClick={() => pushParams({ care: opt.value || undefined })}
                            >
                                <span className="material-symbols-outlined text-sm" aria-hidden="true">{opt.icon}</span>
                                <span>{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </details>

                {/* ── Harga ── */}
                {showPriceFilter && (
                    <>
                        <div className="sidebar__divider" />
                        <details className="sidebar__collapsible" open>
                            <summary className="sidebar__heading">
                                Rentang Harga
                                <span className="material-symbols-outlined sidebar__heading-icon" aria-hidden="true">
                                    payments
                                </span>
                            </summary>
                            <div className="sidebar__price-body">
                                <div className="sidebar__price-row">
                                    <div className="sidebar__price-field">
                                        <span className="sidebar__price-label">Min</span>
                                        <input
                                            className="sidebar__price-input"
                                            placeholder={priceRange.min.toLocaleString("id-ID")}
                                            type="text"
                                            inputMode="numeric"
                                            aria-label="Input harga minimum"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
                                        />
                                    </div>
                                    <div className="sidebar__price-field">
                                        <span className="sidebar__price-label">Max</span>
                                        <input
                                            className="sidebar__price-input"
                                            placeholder={priceRange.max.toLocaleString("id-ID")}
                                            type="text"
                                            inputMode="numeric"
                                            aria-label="Input harga maksimum"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
                                        />
                                    </div>
                                </div>
                                <button onClick={applyPriceFilter} className="sidebar__price-apply">
                                    Terapkan
                                </button>
                            </div>
                        </details>
                    </>
                )}

                {/* ── Reset ── */}
                <div className="sidebar__divider" />
                <button onClick={handleReset} className="sidebar__reset">
                    <span className="material-symbols-outlined sidebar__reset-icon" aria-hidden="true">
                        sync
                    </span>
                    Reset Semua
                </button>

                {/* ── CTA ── */}
                {ctaEnabled && (
                    <>
                        <div className="sidebar__divider" />
                        <div className="sidebar__cta-inline">
                            <div className="sidebar__cta-header">
                                <span className="material-symbols-outlined sidebar__cta-icon" aria-hidden="true">
                                    psychiatry
                                </span>
                                <span className="sidebar__cta-title">{ctaTitle}</span>
                            </div>
                            <p className="sidebar__cta-desc">{ctaDescription}</p>
                            <a
                                href={`https://wa.me/${ctaWhatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sidebar__cta-link"
                            >
                                {ctaButtonText}
                                <span className="material-symbols-outlined text-xs" aria-hidden="true">
                                    arrow_outward
                                </span>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}
