import "server-only";
import { sectionSchemaRegistry } from "./homepage-sections";
import { productsSectionSchemaRegistry } from "./products-sections";
import { layananSectionSchemaRegistry } from "./layanan-sections";
import { overviewSectionSchemaRegistry } from "./overview-sections";
import { knowledgeSectionSchemaRegistry } from "./knowledge-sections";
import { portfolioSectionSchemaRegistry } from "./portfolio-sections";
import { globalSectionSchemaRegistry } from "./global-sections";
import type { z } from "zod";

// Display metadata for each page
export const PAGE_REGISTRY = {
  homepage: {
    label: "Homepage",
    description: "Halaman utama — hero, katalog, team, B2B, newsletter",
    dbKey: "homepage",
    registry: sectionSchemaRegistry,
  },
  products: {
    label: "Product Page",
    description: "Halaman katalog produk — hero, sidebar",
    dbKey: "products",
    registry: productsSectionSchemaRegistry,
  },
  layanan: {
    label: "Layanan",
    description: "Halaman layanan landscape & B2B",
    dbKey: "layanan",
    registry: layananSectionSchemaRegistry,
  },
  overview: {
    label: "Overview / Tentang",
    description: "Tentang perusahaan — stats, team, logistics, FAQ",
    dbKey: "overview",
    registry: overviewSectionSchemaRegistry,
  },
  "knowledge-page": {
    label: "Knowledge / Jurnal",
    description: "Pusat pengetahuan tanaman",
    dbKey: "knowledge-page",
    registry: knowledgeSectionSchemaRegistry,
  },
  "portfolio-page": {
    label: "Portfolio",
    description: "Galeri proyek landscape & interior",
    dbKey: "portfolio-page",
    registry: portfolioSectionSchemaRegistry,
  },
  navbar: {
    label: "Navbar (Global)",
    description: "Navigasi utama — links, logo, styling",
    dbKey: "navbar",
    registry: globalSectionSchemaRegistry,
  },
} as const;

export type PageKey = keyof typeof PAGE_REGISTRY;
export const PAGE_KEYS = Object.keys(PAGE_REGISTRY) as PageKey[];

// Human-readable section names
export const SECTION_LABELS: Record<string, string> = {
  // Homepage
  hero_bento: "Hero Banner",
  trust_strip: "Trust Strip",
  catalog_section: "Katalog / Koleksi Pilihan",
  order_process: "Proses Pemesanan",
  team_section: "Tim / Team",
  greenspace_cta: "Green Space CTA",
  b2b_section: "B2B Section",
  journal_section: "Jurnal",
  consultation_cta: "Konsultasi CTA",
  excellence_section: "Keunggulan",
  testimonials_section: "Testimoni",
  newsletter_section: "Newsletter",
  // Products
  product_hero: "Product Hero",
  product_sidebar: "Product Sidebar",
  // Layanan
  layanan_hero: "Hero Layanan",
  layanan_usp: "USP",
  layanan_quick_contact: "Quick Contact",
  layanan_cara_kerja: "Cara Kerja",
  layanan_partners: "Partners",
  layanan_segmen: "Segmen Layanan",
  layanan_galeri: "Galeri",
  layanan_pelanggan: "Pelanggan",
  layanan_logistik: "Logistik",
  layanan_faq: "FAQ",
  layanan_cta: "CTA",
  // Overview
  overview_hero: "Hero Overview",
  overview_sticky_nav: "Sticky Navigation",
  overview_stats: "Statistik",
  overview_about: "Tentang BMJ",
  overview_network: "Jaringan Nursery",
  overview_gallery: "Galeri & Dokumentasi",
  overview_team: "Tim Ahli",
  overview_logistics: "Sistem Logistik",
  overview_guarantee: "Garansi",
  overview_testimonials: "Testimoni",
  overview_faq: "FAQ",
  overview_contact: "Kontak",
  // Knowledge
  knowledge_hero: "Hero Knowledge",
  knowledge_category_nav: "Category Navigation",
  knowledge_featured: "Featured Article",
  knowledge_zone_mengenal: "Zone: Mengenal",
  knowledge_zone_memilih: "Zone: Memilih",
  knowledge_zone_merawat: "Zone: Merawat",
  knowledge_zone_menggunakan: "Zone: Menggunakan",
  knowledge_editorial: "Editorial Board",
  knowledge_tren: "Tren Section",
  // Portfolio
  portfolio_hero: "Hero Portfolio",
  portfolio_services: "Services",
  portfolio_segments: "Segments",
  portfolio_projects: "Projects",
  portfolio_logistics: "Logistik",
  portfolio_process_cta: "Process & CTA",
  // Global
  navbar_settings: "Navbar Settings",
};

/**
 * Get schema for a specific section within a page.
 * Returns undefined if pageKey or sectionKey not found.
 */
export function getSectionSchema(pageKey: string, sectionKey: string): z.ZodTypeAny | undefined {
  const page = PAGE_REGISTRY[pageKey as PageKey];
  if (!page) return undefined;
  const registry = page.registry as Record<string, z.ZodTypeAny>;
  return registry[sectionKey];
}
