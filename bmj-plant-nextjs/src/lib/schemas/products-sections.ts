/**
 * Zod Schemas — Products Page Section Data Validation
 * Currently 1 section: product_hero (Single Background, HeroBento-style).
 * Defaults mirror hardcoded values in ShopHero.tsx.
 */

import { z } from "zod";

// ============================================
// PRODUCT HERO
// ============================================

const trendingLinkSchema = z.object({
    label: z.string(),
    href: z.string(),
});

export const productHeroSchema = z.object({
    badge: z.string().default("Edisi Kolektor 2026"),
    heading: z.string().default("Eksplorasi Botani Premium"),
    description: z.string().default(
        "Katalog eksklusif Philodendron, Monstera, dan Aroid langka. Dirawat pakar untuk memastikan genetik terbaik."
    ),
    searchPlaceholder: z.string().default("Cari koleksi tanaman..."),
    ctaText: z.string().default("Cari"),
    trendingLabel: z.string().default("Pencarian Populer:"),
    trendingLinks: z.array(trendingLinkSchema).default([
        { label: "Monstera Albo", href: "/product?q=monstera+albo" },
        { label: "Philodendron SS", href: "/product?q=philodendron+ss" },
        { label: "Daun Langka", href: "/product?q=daun+langka" },
        { label: "Terarium", href: "/product?q=terarium" },
        { label: "Tanaman Hias", href: "/product?q=tanaman+hias" },
    ]),
    backgroundImage: z.string().default("/images/plants/IMG-20250703-WA0001.jpg"),
});

export type ProductHeroData = z.infer<typeof productHeroSchema>;

// ============================================
// PRODUCT SIDEBAR
// ============================================

const sortOptionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

export const productSidebarSchema = z.object({
    showPriceFilter: z.boolean().default(true),
    showSortFilter: z.boolean().default(true),
    showCategoryFilter: z.boolean().default(true),
    ctaEnabled: z.boolean().default(true),
    ctaTitle: z.string().default("Konsultasi Spesimen"),
    ctaDescription: z.string().default("\u201cButuh bantuan memilih? Konsultasi dengan ahli kami.\u201d"),
    ctaButtonText: z.string().default("Chat WA"),
    ctaWhatsappNumber: z.string().default("6281586664516"),
    sortOptions: z.array(sortOptionSchema).default([
        { label: "Terbaru", value: "newest" },
        { label: "Harga: Rendah → Tinggi", value: "price-asc" },
        { label: "Harga: Tinggi → Rendah", value: "price-desc" },
        { label: "Populer", value: "popular" },
    ]),
});

export type ProductSidebarData = z.infer<typeof productSidebarSchema>;

// ============================================
// REGISTRY
// ============================================

export const productsSectionSchemaRegistry = {
    product_hero: productHeroSchema,
    product_sidebar: productSidebarSchema,
} as const;

export type ProductsSectionKey = keyof typeof productsSectionSchemaRegistry;
