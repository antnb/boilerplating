/**
 * Zod Schemas — Portfolio Page Section Data Validation
 * 6 sections matching mock-portfolio-data structure.
 * Defaults mirror MOCK_PORTFOLIO values for graceful fallback.
 */

import { z } from "zod";

// ============================================
// PORTFOLIO HERO
// ============================================

const portfolioStatSchema = z.object({ value: z.string(), label: z.string(), icon: z.string() });
export const portfolioHeroSchema = z.object({
    title: z.string().default("Kelompok Tani & Supplier Tanaman Hias Nasional"),
    subtitle: z.string().default("Dari Hub Cipanas untuk Seluruh Indonesia"),
    description: z.string().default("BMJ mengkoordinasikan ratusan petani tanaman hias di Cipanas — pusat industri tanaman hias terbesar di Indonesia. Kapasitas supply besar melalui aggregasi jaringan petani berpengalaman."),
    backgroundImage: z.string().default("https://lh3.googleusercontent.com/aida-public/AB6AXuAGHbALY8uUEWVV11XjGVftCYTk1LeJz_Xw862AQ2ToPHmBiYNs5pvIAmDRC7wIeNE37lkyBXRs5VPjyWA2r-m4KfkMCMfZDwksLvtYKt5W5rjrjcJrrIUX0RmcxpyoC0h9HvAAyO9A4ZXdL6x3cwsZNjPSOmk6Im6HeZqhD9rz7dO0EnMImRwQZJeC0AH3gAnjlW43AzOi8WXSAc5eN5muG7rYTEARdjELRX3fbRydZ0XXD1yodk-BQ25qr7jqMOwtlRGraNeJzvo"),
    stats: z.array(portfolioStatSchema).default([
        { value: "100+", label: "Petani Mitra", icon: "groups" },
        { value: "10K+", label: "Kapasitas Pohon/Order", icon: "forest" },
        { value: "34", label: "Provinsi Terjangkau", icon: "local_shipping" },
    ]),
});
export type PortfolioHeroData = z.infer<typeof portfolioHeroSchema>;

// ============================================
// PORTFOLIO SERVICES
// ============================================

const serviceCardSchema = z.object({ icon: z.string(), title: z.string(), description: z.string(), tag: z.string() });
export const portfolioServicesSchema = z.object({
    services: z.array(serviceCardSchema).default([
        { icon: "park", title: "Suplai Proyek Lanskap", description: "Tanaman groundcover, perdu, peneduh, dan palem untuk proyek properti, hotel, taman kota. Minimum order 10.000 pohon.", tag: "B2B • Skala Besar" },
        { icon: "local_florist", title: "Tanaman Exotic & Koleksi", description: "Monstera, Philodendron, Anthurium, Aglonema dan varietas langka untuk kolektor dan retailer.", tag: "B2B + B2C" },
        { icon: "handshake", title: "Koordinasi Petani", description: "Sebagai kelompok tani, BMJ menghubungkan ratusan petani di Cipanas dengan buyer nasional dan internasional.", tag: "Farmer Cooperative" },
    ]),
});
export type PortfolioServicesData = z.infer<typeof portfolioServicesSchema>;

// ============================================
// PORTFOLIO SEGMENTS
// ============================================

const segmentItemSchema = z.object({ label: z.string(), description: z.string(), icon: z.string(), percentage: z.string(), examples: z.array(z.string()) });
export const portfolioSegmentsSchema = z.object({
    title: z.string().default("Dua Segmen, Satu Ekosistem"),
    items: z.array(segmentItemSchema).default([
        { label: "Tanaman Proyek", description: "Landscape supply untuk developer, kontraktor, dan pemerintah", icon: "apartment", percentage: "50%", examples: ["Groundcover & rumput", "Perdu & semak hias", "Tanaman peneduh", "Palem & tanaman border", "Vertical garden"] },
        { label: "Tanaman Exotic", description: "Varietas koleksi untuk kolektor, retailer, dan hobbyist", icon: "eco", percentage: "50%", examples: ["Monstera (Albo, Thai Con)", "Philodendron langka", "Anthurium premium", "Aglonema mutasi", "Aroid koleksi lainnya"] },
    ]),
});
export type PortfolioSegmentsData = z.infer<typeof portfolioSegmentsSchema>;

// ============================================
// PORTFOLIO PROJECTS
// ============================================

const projectPhotoSchema = z.object({ slug: z.string(), image: z.string(), imageAlt: z.string(), title: z.string(), category: z.string(), location: z.string(), scale: z.string() });
export const portfolioProjectsSchema = z.object({
    badge: z.string().default("Galeri Proyek"),
    heading: z.string().default("Proyek & Koleksi Terbaru"),
    projects: z.array(projectPhotoSchema).default([]),
});
export type PortfolioProjectsData = z.infer<typeof portfolioProjectsSchema>;

// ============================================
// PORTFOLIO LOGISTICS
// ============================================

const islandSchema = z.object({ name: z.string(), active: z.boolean() });
const destinationSchema = z.object({ city: z.string() });
export const portfolioLogisticsSchema = z.object({
    title: z.string().default("Jangkauan Pengiriman"),
    subtitle: z.string().default("Nasional & Internasional"),
    islands: z.array(islandSchema).default([
        { name: "Jawa", active: true }, { name: "Sumatera", active: true }, { name: "Kalimantan", active: true },
        { name: "Sulawesi", active: true }, { name: "Bali & NTB", active: true }, { name: "Papua", active: true },
    ]),
    destinations: z.array(destinationSchema).default([
        { city: "Jakarta" }, { city: "Surabaya" }, { city: "Bandung" }, { city: "Denpasar" },
        { city: "Medan" }, { city: "Makassar" }, { city: "Yogyakarta" }, { city: "Semarang" },
    ]),
    shippingNote: z.string().default("Pengiriman menggunakan jasa logistik pihak ketiga terpercaya. Ekspor internasional tersedia dengan frekuensi terbatas."),
});
export type PortfolioLogisticsData = z.infer<typeof portfolioLogisticsSchema>;

// ============================================
// PORTFOLIO PROCESS & CTA (combined)
// ============================================

const processStepSchema = z.object({ number: z.string(), title: z.string(), description: z.string(), icon: z.string() });
export const portfolioProcessCTASchema = z.object({
    processTitle: z.string().default("Proses Kerja"),
    steps: z.array(processStepSchema).default([
        { number: "01", title: "Konsultasi", description: "Diskusi kebutuhan proyek, jenis tanaman, volume, dan timeline", icon: "chat" },
        { number: "02", title: "Seleksi & Koordinasi", description: "Koordinasi dengan petani mitra untuk sourcing tanaman sesuai spesifikasi", icon: "checklist" },
        { number: "03", title: "Quality Control", description: "Inspeksi kualitas di kebun sebelum pengiriman", icon: "verified" },
        { number: "04", title: "Pengiriman", description: "Packing profesional dan pengiriman via logistik pihak ketiga terpercaya", icon: "local_shipping" },
    ]),
    ctaTitle: z.string().default("Siap untuk Proyek Anda?"),
    ctaSubtitle: z.string().default("Konsultasi gratis untuk kebutuhan tanaman proyek lanskap atau koleksi exotic. Kami siap supply dari ratusan petani mitra di Cipanas."),
    primaryLabel: z.string().default("Konsultasi via WhatsApp"),
    secondaryLabel: z.string().default("Lihat Katalog Tanaman"),
});
export type PortfolioProcessCTAData = z.infer<typeof portfolioProcessCTASchema>;

// ============================================
// REGISTRY
// ============================================

export const portfolioSectionSchemaRegistry = {
    portfolio_hero: portfolioHeroSchema,
    portfolio_services: portfolioServicesSchema,
    portfolio_segments: portfolioSegmentsSchema,
    portfolio_projects: portfolioProjectsSchema,
    portfolio_logistics: portfolioLogisticsSchema,
    portfolio_process_cta: portfolioProcessCTASchema,
} as const;

export type PortfolioSectionKey = keyof typeof portfolioSectionSchemaRegistry;
