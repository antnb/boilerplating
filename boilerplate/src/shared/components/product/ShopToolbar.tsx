"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * ShopToolbar — V4D HeaderBar
 *
 * Breadcrumb + heading + sort pills (desktop)
 * Mobile category pills (horizontal scroll)
 * All structural CSS is in globals.css under #header-bar and #shop-toolbar.
 */

type GroupItem = {
    id: string;
    name: string;
    slug: string;
};

const SORT_OPTIONS = [
    { label: "Terbaru", value: "newest" },
    { label: "Harga ↑", value: "price-asc" },
    { label: "Harga ↓", value: "price-desc" },
    { label: "Populer", value: "popular" },
];

interface ShopToolbarProps {
    onOpenFilter?: () => void;
    groups: GroupItem[];
    totalCount: number;
    activeSort: string;
}

export default function ShopToolbar({ onOpenFilter, groups, totalCount, activeSort }: ShopToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSort = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            if (value === "newest") {
                params.delete("sort");
            } else {
                params.set("sort", value);
            }
            const qs = params.toString();
            router.push(`/product${qs ? `?${qs}` : ""}`);
        },
        [router, searchParams]
    );

    return (
        <>
            {/* Mobile: Category Pills */}
            <div id="shop-toolbar" className="w-full bg-brand-bg border-b border-brand-border relative z-40 shadow-sm lg:hidden">
                <div className="shop-toolbar__row">
                    <div className="category-pills-wrapper flex-1 overflow-x-auto flex items-center gap-2">
                        <Link href="/product"
                            className="shrink-0 px-4 py-2 rounded-full text-xs font-bold font-serif whitespace-nowrap bg-primary text-primary-foreground shadow-md"
                        >
                            Semua
                        </Link>
                        {groups.map((group) => (
                            <Link
                                key={group.id}
                                href={`/product?group=${group.slug}`}
                                className="shrink-0 px-4 py-2 rounded-full text-xs font-bold font-serif whitespace-nowrap bg-card border border-border text-foreground active:bg-primary active:text-primary-foreground"
                            >
                                {group.name}
                            </Link>
                        ))}
                    </div>
                    <button
                        onClick={onOpenFilter}
                        className="shop-toolbar__filter-btn"
                    >
                        <span className="material-symbols-outlined text-sm">tune</span>
                        Filter
                    </button>
                </div>
            </div>

            {/* Desktop: Header Bar with breadcrumb + heading + sort pills */}
            <div id="header-bar" className="hidden lg:block bg-brand-bg">
                <nav className="header-bar__bc" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
                    {" / "}
                    <strong>Produk</strong>
                </nav>
                <div className="header-bar__row">
                    <div className="flex items-center">
                        <h2 className="header-bar__title font-serif">
                            Katalog Tanaman Hias Premium
                        </h2>
                        <span className="header-bar__sub">
                            {totalCount} spesimen · 2026
                        </span>
                    </div>
                    <div className="sort-pills">
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleSort(opt.value)}
                                className={`sort-pill ${activeSort === opt.value ? "sort-pill--active" : ""}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
