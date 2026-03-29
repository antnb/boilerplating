/**
 * Zod Schemas — Knowledge Hub Page Section Data Validation
 *
 * Mirror of layanan-sections.ts architecture.
 * Knowledge Hub has 7 logical sections rendered by 8 components.
 */

import { z } from "zod";

// ============================================
// KNOWLEDGE HERO
// ============================================

export const knowledgeHeroSchema = z.object({
    badge1: z.string().default("BMJ Authority Index"),
    badge2: z.string().default("Verified by Experts"),
    headingLine1: z.string().default("Pusat Otoritas"),
    headingLine2: z.string().default("Botani Cipanas"),
    description: z.string().default("Panduan lengkap perawatan, identifikasi spesies, dan teknik budidaya dari ahli hortikultura bersertifikat."),
    heroImage: z.string().default("/images/knowledge/hero-greenhouse.jpg"),
    heroImageAlt: z.string().default("Interior greenhouse profesional BMJ Nursery di dataran tinggi Cipanas"),
    searchPlaceholder: z.string().default("Cari panduan..."),
    statNumber: z.string().default("2.4k+"),
    statLabel: z.string().default("Artikel Terkurasi"),
    altitudeBadge: z.string().default("1.100 mdpl"),
});

export type KnowledgeHeroData = z.infer<typeof knowledgeHeroSchema>;

// ============================================
// CATEGORY NAV
// ============================================

const categorySchema = z.object({
    id: z.string(),
    label: z.string(),
    subtitle: z.string(),
    icon: z.string(),
});

export const knowledgeCategoryNavSchema = z.object({
    categories: z.array(categorySchema).default([
        { id: "mengenal", label: "Mengenal", subtitle: "Classification", icon: "psychiatry" },
        { id: "memilih", label: "Memilih", subtitle: "Selection", icon: "check_circle" },
        { id: "merawat", label: "Merawat", subtitle: "Care Database", icon: "water_drop" },
        { id: "menggunakan", label: "Menggunakan", subtitle: "Design & Decor", icon: "landscape" },
        { id: "tren", label: "Tren", subtitle: "Global Updates", icon: "trending_up" },
    ]),
});

export type KnowledgeCategoryNavData = z.infer<typeof knowledgeCategoryNavSchema>;

// ============================================
// FEATURED MAGAZINE (desktop-only Zone 1)
// ============================================

const sidebarArticleSchema = z.object({
    cat: z.string(),
    title: z.string(),
    img: z.string(),
    time: z.string(),
});

export const knowledgeFeaturedSchema = z.object({
    zoneLabel: z.string().default("Zone 1"),
    zoneTitle: z.string().default("Sorotan Panduan"),
    zoneSubtitle: z.string().default("Koleksi panduan terkurasi dari tim editorial BMJ Nursery"),
    ctaText: z.string().default("Lihat Semua"),
    ctaHref: z.string().default("/knowledge/all"),
    featuredImage: z.string().default("/images/knowledge/featured-botany.jpg"),
    featuredImageAlt: z.string().default("Taksonomi Araceae — panduan klasifikasi botani"),
    featuredBadge: z.string().default("Editor's Choice"),
    featuredCategory: z.string().default("🌿 Mengenal · Taksonomi"),
    featuredTitle: z.string().default("Karakteristik Dasar Araceae: Panduan Klasifikasi Visual"),
    featuredDesc: z.string().default("Dasar klasifikasi botani untuk identifikasi akurat famili Araceae, termasuk genus Monstera, Philodendron, dan Anthurium."),
    featuredAuthorName: z.string().default("Dr. Hartono S."),
    featuredAuthorRole: z.string().default("Lead Horticulturalist · 8 min read"),
    sidebarArticles: z.array(sidebarArticleSchema).default([
        { cat: "Memilih", title: "Teknik Menjaga Variegasi Stabil", img: "/images/knowledge/monstera-selection.jpg", time: "5 min" },
        { cat: "Merawat", title: "Komposisi Media Tanam Epiphytic", img: "/images/knowledge/soil-care.jpg", time: "6 min" },
        { cat: "Tren", title: "Hibridisasi Anthurium Dark Hybrid", img: "/images/knowledge/interior-alocasia.jpg", time: "4 min" },
    ]),
});

export type KnowledgeFeaturedData = z.infer<typeof knowledgeFeaturedSchema>;

// ============================================
// EDITORIAL BOARD
// ============================================

const expertSchema = z.object({
    name: z.string(),
    role: z.string(),
    specialty: z.string(),
    hasImage: z.boolean().default(false),
});

export const knowledgeEditorialSchema = z.object({
    badgeText: z.string().default("Editorial Board"),
    heading: z.string().default("Scientific Verification"),
    subtitle: z.string().default("Setiap artikel diverifikasi oleh tim ahli botani bersertifikat untuk memastikan akurasi ilmiah."),
    experts: z.array(expertSchema).default([
        { name: "Dr. Hartono S.", role: "Lead Horticulturalist", specialty: "Spesialis Araceae & Fisiologi.", hasImage: true },
        { name: "Sarah Wijaya, SP.", role: "Plant Pathologist", specialty: "Ahli Hama & Penyakit Tropis.", hasImage: false },
    ]),
    quoteText: z.string().default("Botani bukan sekadar nama latin — ia adalah bahasa universal yang menghubungkan kita dengan keanekaragaman hayati."),
    quoteAuthor: z.string().default("— Dr. Hartono S."),
    disclaimerTitle: z.string().default("General Guidance"),
    disclaimerText: z.string().default("Disclaimer: Informasi yang disajikan bersifat umum dan edukatif. Untuk kondisi spesifik tanaman Anda, konsultasikan langsung dengan tim ahli kami."),
});

export type KnowledgeEditorialData = z.infer<typeof knowledgeEditorialSchema>;

// ============================================
// ZONE MENGENAL
// ============================================

const subLinkSchema = z.object({
    icon: z.string().optional(),
    title: z.string(),
});

export const knowledgeZoneMengenalSchema = z.object({
    sectionNumber: z.string().default("01."),
    sectionTitle: z.string().default("Mengenal"),
    sectionSubtitle: z.string().default("Classification"),
    featuredImage: z.string().default("/images/knowledge/featured-botany.jpg"),
    featuredImageAlt: z.string().default("Taksonomi Araceae — panduan klasifikasi botani dasar"),
    featuredBadge: z.string().default("Featured"),
    featuredTitle: z.string().default("Taksonomi Araceae"),
    featuredDesc: z.string().default("Dasar klasifikasi botani untuk identifikasi akurat famili Araceae."),
    featuredAuthor: z.string().default("Dr. Hartono"),
    subLinks: z.array(subLinkSchema).default([
        { icon: "psychiatry", title: "Morfologi Daun & Venasi" },
        { icon: "forest", title: "Habitat Hutan Tropis" },
    ]),
});

export type KnowledgeZoneMengenalData = z.infer<typeof knowledgeZoneMengenalSchema>;

// ============================================
// ZONE MEMILIH
// ============================================

const memilihSubArticleSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    img: z.string(),
});

export const knowledgeZoneMemilihSchema = z.object({
    sectionNumber: z.string().default("02."),
    sectionTitle: z.string().default("Memilih"),
    sectionSubtitle: z.string().default("Selection"),
    featuredImage: z.string().default("/images/knowledge/monstera-selection.jpg"),
    featuredImageAlt: z.string().default("Panduan inspeksi kesehatan tanaman"),
    featuredBadge: z.string().default("Essential Guide"),
    featuredTitle: z.string().default("Panduan Inspeksi Kesehatan Tanaman"),
    featuredDesc: z.string().default("Panduan visual mendeteksi penyakit dan memilih spesimen berkualitas."),
    desktopSubLinks: z.array(z.string()).default(["Memilih Pot yang Tepat", "Variegata vs Non-Variegata"]),
    mobileHeroTitle: z.string().default("Inspeksi Kesehatan"),
    mobileHeroDesc: z.string().default("Panduan visual mendeteksi penyakit."),
    mobileSubArticles: z.array(memilihSubArticleSchema).default([
        { title: "Teknik Menjaga Variegasi Stabil", subtitle: "Monstera Guide", img: "/images/knowledge/monstera-selection.jpg" },
        { title: "Cutting vs Tanaman Utuh", subtitle: "Investasi Cerdas", img: "/images/knowledge/monstera-selection.jpg" },
    ]),
});

export type KnowledgeZoneMemilihData = z.infer<typeof knowledgeZoneMemilihSchema>;

// ============================================
// ZONE MERAWAT
// ============================================

const careCategorySchema = z.object({
    icon: z.string(),
    title: z.string(),
    subtitle: z.string(),
    count: z.number(),
});

export const knowledgeZoneMerawatSchema = z.object({
    sectionNumber: z.string().default("03."),
    sectionTitle: z.string().default("Merawat"),
    sectionSubtitle: z.string().default("Care Database"),
    mobileSubtitle: z.string().default("The Care Dashboard"),
    careCategories: z.array(careCategorySchema).default([
        { icon: "water_drop", title: "Water", subtitle: "Teknik Penyiraman", count: 12 },
        { icon: "wb_sunny", title: "Light", subtitle: "Kebutuhan Cahaya", count: 8 },
        { icon: "science", title: "Soil", subtitle: "Nutrisi & Pupuk", count: 15 },
        { icon: "bug_report", title: "Pests", subtitle: "Hama & Penyakit", count: 6 },
    ]),
});

export type KnowledgeZoneMerawatData = z.infer<typeof knowledgeZoneMerawatSchema>;

// ============================================
// ZONE MENGGUNAKAN
// ============================================

const menggunakanArticleSchema = z.object({
    category: z.string(),
    title: z.string(),
    description: z.string(),
    img: z.string(),
    alt: z.string(),
});

export const knowledgeZoneMenggunakanSchema = z.object({
    sectionNumber: z.string().default("04."),
    sectionTitle: z.string().default("Menggunakan"),
    sectionSubtitle: z.string().default("Design & Decor"),
    articles: z.array(menggunakanArticleSchema).default([
        { category: "Interior Styling", title: "Ruang Minim Cahaya", description: "Solusi estetis untuk sudut gelap.", img: "/images/knowledge/interior-alocasia.jpg", alt: "Interior styling dengan tanaman di ruang minim cahaya" },
        { category: "Landscape Arch", title: "Tropical Garden Modern", description: "Elemen hardscape minimalis.", img: "/images/knowledge/hero-greenhouse.jpg", alt: "Konsep tropical garden modern dengan elemen minimalis" },
    ]),
});

export type KnowledgeZoneMenggunakanData = z.infer<typeof knowledgeZoneMenggunakanSchema>;

// ============================================
// TREN SECTION
// ============================================

const trenArticleSchema = z.object({
    category: z.string(),
    title: z.string(),
    description: z.string(),
    img: z.string(),
    date: z.string(),
    readTime: z.string(),
});

export const knowledgeTrenSchema = z.object({
    sectionNumber: z.string().default("05."),
    sectionTitle: z.string().default("Tren & Updates"),
    loadMoreText: z.string().default("Muat Lebih Banyak"),
    articles: z.array(trenArticleSchema).default([
        { category: "Market Report", title: "Anthurium Papillilaminum Hybrid Market 2024", description: "Analisis harga dan permintaan pasar global untuk hibrida gelap Anthurium.", img: "/images/knowledge/featured-botany.jpg", date: "12 Aug", readTime: "5 Min" },
        { category: "Tips", title: "Manajemen Dormansi Alocasia", description: "Strategi pencahayaan buatan untuk musim hujan.", img: "/images/knowledge/interior-alocasia.jpg", date: "10 Aug", readTime: "4 Min" },
        { category: "Research", title: "Philodendron Gloriosum vs Melanochrysum", description: "Perbandingan mendalam karakteristik dan kebutuhan perawatan.", img: "/images/knowledge/monstera-selection.jpg", date: "8 Aug", readTime: "7 Min" },
        { category: "Industry", title: "Sertifikasi CITES untuk Ekspor Tanaman", description: "Panduan lengkap regulasi ekspor tanaman langka Indonesia.", img: "/images/knowledge/hero-greenhouse.jpg", date: "5 Aug", readTime: "6 Min" },
        { category: "Innovation", title: "Tissue Culture untuk Koleksi Langka", description: "Perkembangan teknik kultur jaringan untuk propagasi massal.", img: "/images/knowledge/soil-care.jpg", date: "2 Aug", readTime: "8 Min" },
        { category: "Guide", title: "Membangun Greenhouse di Dataran Rendah", description: "Teknik kontrol suhu dan kelembaban untuk iklim tropis.", img: "/images/knowledge/hero-greenhouse.jpg", date: "30 Jul", readTime: "10 Min" },
    ]),
});

export type KnowledgeTrenData = z.infer<typeof knowledgeTrenSchema>;

// ============================================
// REGISTRY — section key → schema mapping
// ============================================

export const knowledgeSectionSchemaRegistry = {
    knowledge_hero: knowledgeHeroSchema,
    knowledge_category_nav: knowledgeCategoryNavSchema,
    knowledge_featured: knowledgeFeaturedSchema,
    knowledge_editorial: knowledgeEditorialSchema,
    knowledge_zone_mengenal: knowledgeZoneMengenalSchema,
    knowledge_zone_memilih: knowledgeZoneMemilihSchema,
    knowledge_zone_merawat: knowledgeZoneMerawatSchema,
    knowledge_zone_menggunakan: knowledgeZoneMenggunakanSchema,
    knowledge_tren: knowledgeTrenSchema,
} as const;

export type KnowledgeSectionKey = keyof typeof knowledgeSectionSchemaRegistry;
