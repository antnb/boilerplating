"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Portal } from "@/components/ui/portal";
import { useOverlay } from "@/hooks/useOverlay";
import type { ActiveFilters, PriceRange } from "@/components/product/ProductListingClient";

type GroupItem = {
    id: string;
    name: string;
    slug: string;
};

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    groups: GroupItem[];
    activeFilters: ActiveFilters;
    priceRange: PriceRange;
}

const SORT_OPTIONS = [
    { label: "Terbaru", value: "newest" },
    { label: "Harga: Rendah → Tinggi", value: "price-asc" },
    { label: "Harga: Tinggi → Rendah", value: "price-desc" },
    { label: "Populer", value: "popular" },
];

const CARE_OPTIONS = [
    { value: "", label: "Semua", icon: "select_all" },
    { value: "easy", label: "Mudah", icon: "sentiment_satisfied" },
    { value: "medium", label: "Sedang", icon: "sentiment_neutral" },
    { value: "hard", label: "Sulit", icon: "sentiment_dissatisfied" },
] as const;

export default function MobileFilterDrawer({
    isOpen,
    onClose,
    groups,
    activeFilters,
    priceRange,
}: MobileFilterDrawerProps) {
    const stableClose = useCallback(() => onClose(), [onClose]);
    useOverlay(isOpen, stableClose);

    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedSort, setSelectedSort] = useState(activeFilters.sort || "newest");
    const [selectedCare, setSelectedCare] = useState(activeFilters.care || "");
    const [selectedGroup, setSelectedGroup] = useState(activeFilters.group || "");
    const [minPrice, setMinPrice] = useState(activeFilters.minPrice?.toString() || "");
    const [maxPrice, setMaxPrice] = useState(activeFilters.maxPrice?.toString() || "");

    // Sync when drawer re-opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSort(activeFilters.sort || "newest");
            setSelectedCare(activeFilters.care || "");
            setSelectedGroup(activeFilters.group || "");
            setMinPrice(activeFilters.minPrice?.toString() || "");
            setMaxPrice(activeFilters.maxPrice?.toString() || "");
        }
    }, [isOpen, activeFilters]);

    const handleApply = useCallback(() => {
        const params = new URLSearchParams();

        // Preserve search query
        const currentQ = searchParams?.get("q");
        if (currentQ) params.set("q", currentQ);

        if (selectedSort !== "newest") params.set("sort", selectedSort);
        if (selectedGroup) params.set("group", selectedGroup);
        if (selectedCare) params.set("care", selectedCare);

        const min = minPrice ? Number(minPrice) : undefined;
        const max = maxPrice ? Number(maxPrice) : undefined;
        if (min && !isNaN(min)) params.set("minPrice", min.toString());
        if (max && !isNaN(max)) params.set("maxPrice", max.toString());

        const qs = params.toString();
        router.push(`/product${qs ? `?${qs}` : ""}`);
        onClose();
    }, [router, searchParams, selectedSort, selectedCare, selectedGroup, minPrice, maxPrice, onClose]);

    const handleReset = useCallback(() => {
        setSelectedSort("newest");
        setSelectedCare("");
        setSelectedGroup("");
        setMinPrice("");
        setMaxPrice("");
        router.push("/product");
        onClose();
    }, [router, onClose]);

    if (!isOpen) return null;

    return (
        <Portal>
        <div className="fixed top-0 left-0 w-screen z-[100] lg:hidden" style={{ height: '100dvh' }} role="dialog" aria-modal="true" aria-label="Filter dan urutkan produk">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-background rounded-t-[24px] shadow-2xl max-h-[85dvh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-foreground/20" />
                </div>

                <div className="px-5 pb-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-serif font-bold text-foreground">
                            Filter & Urutkan
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                            aria-label="Tutup filter"
                        >
                            <span className="material-symbols-outlined text-lg text-foreground" aria-hidden="true">
                                close
                            </span>
                        </button>
                    </div>

                    {/* Kategori */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            Kategori
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedGroup("")}
                                className={`px-4 py-2 rounded-full text-xs font-bold font-serif transition-colors border ${
                                    !selectedGroup
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted border-border text-foreground hover:bg-primary/10"
                                }`}
                            >
                                Semua
                            </button>
                            {groups.map((group) => (
                                <button
                                    key={group.id}
                                    onClick={() => setSelectedGroup(group.slug)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold font-serif transition-colors border ${
                                        selectedGroup === group.slug
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-muted border-border text-foreground hover:bg-primary/10"
                                    }`}
                                >
                                    {group.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rentang Harga */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            Rentang Harga
                        </h3>
                        <div className="flex gap-3">
                            <div className="relative w-full">
                                <span className="absolute left-3 top-2 text-[9px] text-muted-foreground font-bold tracking-wider">
                                    MIN
                                </span>
                                <input
                                    className="w-full pl-3 pt-5 pb-1 text-xs font-bold text-foreground border border-border rounded-xl bg-muted focus:border-ring focus:ring-0 focus:outline-none"
                                    placeholder={priceRange.min.toLocaleString("id-ID")}
                                    type="text"
                                    inputMode="numeric"
                                    aria-label="Input harga minimum"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>
                            <div className="relative w-full">
                                <span className="absolute left-3 top-2 text-[9px] text-muted-foreground font-bold tracking-wider">
                                    MAX
                                </span>
                                <input
                                    className="w-full pl-3 pt-5 pb-1 text-xs font-bold text-foreground border border-border rounded-xl bg-muted focus:border-ring focus:ring-0 focus:outline-none"
                                    placeholder={priceRange.max.toLocaleString("id-ID")}
                                    type="text"
                                    inputMode="numeric"
                                    aria-label="Input harga maksimum"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tingkat Perawatan */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            Tingkat Perawatan
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {CARE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSelectedCare(opt.value)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold font-serif transition-colors flex items-center gap-1.5 border ${
                                        selectedCare === opt.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-muted border-border text-foreground hover:bg-primary/10"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm" aria-hidden="true">{opt.icon}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Urutkan */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            Urutkan
                        </h3>
                        <div className="flex flex-col gap-1">
                            {SORT_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    htmlFor={`mobile-sort-${opt.value}`}
                                    className="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="mobile-sort"
                                        id={`mobile-sort-${opt.value}`}
                                        checked={selectedSort === opt.value}
                                        onChange={() => setSelectedSort(opt.value)}
                                        className="w-4 h-4 rounded-full border-border text-primary focus:ring-ring bg-transparent"
                                    />
                                    <span className="text-sm font-medium text-muted-foreground font-serif">
                                        {opt.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3.5 rounded-full border-2 border-border text-foreground font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-transform"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-[2] py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </Portal>
    );
}
