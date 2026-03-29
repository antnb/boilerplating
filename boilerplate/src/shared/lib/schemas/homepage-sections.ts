/**
 * Zod Schemas — Homepage Section Data Validation
 *
 * Each schema defines the expected JSON structure for a homepage section's
 * `data` field in the `PageSection` model. Zod `.parse()` is used both for:
 *   1. Validating admin input before writing to DB
 *   2. Providing type-safe defaults when reading from DB for public display
 *
 * If a section has no data in the DB, `.parse({})` will fill in all defaults,
 * ensuring the public page always renders correctly.
 */

import { z } from "zod";

// ============================================
// HERO BENTO
// ============================================

export const heroBentoSchema = z.object({
    // ── Hero Badge ──
    badge: z.string().default("Spesialis Tanaman Hias Langka"),

    // ── Hero Copy ──
    heading: z.string().default("Bumi Mekarsari Jaya"),
    description: z.string().default(
        "Sourcing rare botanical specimens for discerning collectors and architectural landscapes worldwide."
    ),
    backgroundImage: z.string().default("/images/homepage/hero-greenhouse.jpg"),
    trendingTags: z.array(z.string()).default(["Variegated", "Large Form", "Rare Aroids"]),

    // ── CTA Buttons ──
    ctaPrimaryLabel: z.string().default("Jelajahi Koleksi"),
    ctaPrimaryHref: z.string().default("/product"),
    ctaSecondaryLabel: z.string().default("Untuk Bisnis/Grosir"),
    ctaSecondaryHref: z.string().default("/layanan"),

    // ── Featured Specimen Card ──
    featuredPlantName: z.string().default("Monstera Albo"),
    featuredPlantPrice: z.string().default("IDR 3.8jt"),
    featuredPlantImage: z.string().default("/images/plants/IMG-20250703-WA0007.jpg"),
    featuredPlantHref: z.string().default("/product"),
});

export type HeroBentoData = z.infer<typeof heroBentoSchema>;

// ============================================
// TRUST STRIP
// ============================================

export const trustStripPillSchema = z.object({
    icon: z.string(),
    label: z.string(),
    subtitle: z.string().optional(),
});

export const trustStripSchema = z.object({
    pills: z.array(trustStripPillSchema).default([
        { icon: "verified", label: "Keaslian Terjamin", subtitle: "Sertifikat keaslian setiap spesimen" },
        { icon: "local_shipping", label: "Pengiriman Aman", subtitle: "Packaging khusus tanaman hidup" },
        { icon: "support_agent", label: "Dukungan Ahli 7 Hari", subtitle: "Konsultasi perawatan pasca pembelian" },
        { icon: "workspace_premium", label: "Kualitas Premium", subtitle: "Dipilih oleh ahli hortikultural" },
        { icon: "autorenew", label: "Garansi Tanaman Hidup", subtitle: "Kami ganti jika tidak survive perjalanan" },
    ]),
});

export type TrustStripData = z.infer<typeof trustStripSchema>;

// ============================================
// ORDER PROCESS
// ============================================

export const orderStepSchema = z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
});

export const orderProcessSchema = z.object({
    sectionTitle: z.string().default("Bagaimana Tanaman Sampai ke Anda"),
    steps: z.array(orderStepSchema).default([
        { icon: "ads_click", title: "PILIH", desc: "Pilih spesimen terbaik dari katalog kurasi kami." },
        { icon: "package_2", title: "DIKEMAS", desc: "Pengemasan khusus tanaman hidup anti-stress." },
        { icon: "local_shipping", title: "DIKIRIM", desc: "Pengiriman ekspres berpendingin ke seluruh Indonesia." },
        { icon: "check_circle", title: "DITERIMA", desc: "Jaminan tanaman tiba sehat atau kami kirim ulang." },
    ]),
});

export type OrderProcessData = z.infer<typeof orderProcessSchema>;

// ============================================
// TEAM SECTION
// ============================================

export const teamMemberSchema = z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().default(""),
    image: z.string().default(""),
    tags: z.array(z.string()).default([]),
});

export const teamSectionSchema = z.object({
    sectionLabel: z.string().default("The Team"),
    sectionTitle: z.string().default("The Master"),
    sectionTitleHighlight: z.string().default("Horticulturalists"),
    sectionDescription: z.string().default(
        "Our team of world-class botanists curates every specimen with an unwavering eye for quality."
    ),
    members: z.array(teamMemberSchema).default([
        { name: "Alistair Thorne", role: "PhD. Rare Tropical Flora", bio: "", image: "/images/homepage/team/alistair-thorne.jpg", tags: [] },
        { name: "Julian Moss", role: "Landscape Architect", bio: "", image: "/images/homepage/team/julian-moss.jpg", tags: [] },
        { name: "Elena Vane", role: "Orchid Specialist", bio: "", image: "/images/homepage/team/elena-vane.jpg", tags: [] },
    ]),
});

export type TeamSectionData = z.infer<typeof teamSectionSchema>;

// ============================================
// GREEN SPACE CTA
// ============================================

export const greenSpaceCtaSchema = z.object({
    heading: z.string().default("Planning a Green Space?"),
    description: z.string().default(
        "Discuss your interior landscaping needs directly with our project leads via WhatsApp."
    ),
    ctaText: z.string().default("Chat on WhatsApp"),
});

export type GreenSpaceCtaData = z.infer<typeof greenSpaceCtaSchema>;

// ============================================
// B2B SECTION
// ============================================

export const b2bServiceSchema = z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
});

export const b2bStatSchema = z.object({
    value: z.string(),
    label: z.string(),
});

export const b2bSectionSchema = z.object({
    badge: z.string().default("Untuk Profesional"),
    heading: z.string().default("Mitra Terpercaya"),
    headingHighlight: z.string().default("Proyek Properti & Lanskap"),
    services: z.array(b2bServiceSchema).default([
        { icon: "domain", title: "Suplai Skala Besar", desc: "Kapasitas penyediaan ribuan tanaman untuk proyek properti, resort, dan commercial landscape." },
        { icon: "verified", title: "Kualitas Ekspor", desc: "Standar tanaman premium yang memenuhi persyaratan phytosanitary internasional." },
        { icon: "local_shipping", title: "Logistik Khusus", desc: "Armada pengiriman tanaman hidup berpendingin untuk memastikan tanaman tiba sehat." },
        { icon: "handshake", title: "Harga Grosir", desc: "Penawaran harga terbaik untuk pembelian volume besar dan kontrak jangka panjang." },
    ]),
    ctaText: z.string().default("Konsultasi B2B via WA"),
    projectImage: z.string().default("/images/homepage/b2b/landscape-project.jpg"),
    projectTitle: z.string().default("Resort Project, Bali"),
    projectSubtitle: z.string().default("Full Landscape Supply"),
    stats: z.array(b2bStatSchema).default([
        { value: "150+", label: "Proyek" },
        { value: "50+", label: "Mitra" },
    ]),
    partnersLabel: z.string().default("Partner Proyek Kami"),
});

export type B2BSectionData = z.infer<typeof b2bSectionSchema>;

// ============================================
// CONSULTATION CTA
// ============================================

export const consultationCtaSchema = z.object({
    icon: z.string().default("psychology_alt"),
    heading: z.string().default("Private Consultation"),
    description: z.string().default(
        "Schedule a session with our senior botanists for your personal project."
    ),
    ctaText: z.string().default("Book Consultation"),
});

export type ConsultationCtaData = z.infer<typeof consultationCtaSchema>;

// ============================================
// CATALOG SECTION (hybrid: admin settings + plant DB)
// ============================================

export const catalogSectionSchema = z.object({
    heading: z.string().default("Spesimen"),
    highlightText: z.string().default("Terpilih"),
    subtitle: z.string().default("Dipilih langsung dari kebun Bumi Mekarsari Jaya"),
    ctaLabel: z.string().default("Lihat Semua"),
    ctaHref: z.string().default("/product"),
    displayMode: z.enum(["random", "curated"]).default("random"),
    curatedPlantIds: z.array(z.string()).default([]),
    limit: z.number().default(8),

    // Badge labels (admin-configurable text)
    badgeNewLabel: z.string().default("Baru"),
    badgeBestSellerLabel: z.string().default("Laris"),
    badgeLowStockLabel: z.string().default("Hampir Habis"),

    // Badge thresholds (auto-logic)
    badgeNewDays: z.number().default(14),
    badgeLowStockThreshold: z.number().default(3),
});

export type CatalogSectionData = z.infer<typeof catalogSectionSchema>;

// ============================================
// EXCELLENCE SECTION
// ============================================

export const excellenceSectionSchema = z.object({
    heading: z.string().default("Keunggulan dalam"),
    headingHighlight: z.string().default("Suplai Botanikal"),
    subtitle: z.string().default(
        "Dipercaya oleh resort dan arsitek lanskap terkemuka Indonesia."
    ),
    partnerCount: z.string().default("50+"),
    partnerLabel: z.string().default("Mitra Nurseri"),
    partnerSublabel: z.string().default("Di seluruh Nusantara"),
    guaranteeValue: z.string().default("100%"),
    guaranteeLabel: z.string().default("Garansi Hidup"),
    guaranteeDescription: z.string().default(
        "Kami ganti tanaman yang tidak survive perjalanan."
    ),
});

export type ExcellenceSectionData = z.infer<typeof excellenceSectionSchema>;

// ============================================
// NEWSLETTER SECTION
// ============================================

export const newsletterSectionSchema = z.object({
    heading: z.string().default("Bergabung dengan"),
    headingHighlight: z.string().default("Newsletter Botanikal"),
    description: z.string().default(
        "Akses awal ke koleksi langka, panduan perawatan dari ahli kami, dan penawaran eksklusif."
    ),
    placeholder: z.string().default("Alamat email Anda"),
    ctaText: z.string().default("Berlangganan"),
    disclaimer: z.string().default(
        "Kami menghargai privasi Anda. Berhenti berlangganan kapan saja."
    ),
});

export type NewsletterSectionData = z.infer<typeof newsletterSectionSchema>;

// ============================================
// JOURNAL SECTION
// ============================================

export const journalArticleSchema = z.object({
    category: z.string(),
    title: z.string(),
    excerpt: z.string(),
    image: z.string(),
    alt: z.string().default(""),
});

export const journalSectionSchema = z.object({
    heading: z.string().default("Jurnal"),
    headingHighlight: z.string().default("Kami"),
    ctaLabel: z.string().default("Baca Semua Artikel"),
    ctaHref: z.string().default("/knowledge"),
    articles: z.array(journalArticleSchema).default([
        {
            category: "Panduan Perawatan",
            title: "Menguasai Kelembapan untuk Aroid",
            excerpt: "Mengapa kelembapan 70% adalah titik ideal untuk Philodendron Anda dan cara mencapainya di dalam ruangan.",
            image: "/images/homepage/journal/humidity-aroids.jpg",
            alt: "Perawatan daun aroid",
        },
        {
            category: "Sorotan",
            title: "Di Balik Nurseri Dataran Tinggi Cipanas",
            excerpt: "Melihat kondisi ketinggian dan iklim yang membuat spesimen kami tumbuh subur sebelum sampai ke tangan Anda.",
            image: "/images/homepage/journal/java-nursery.jpg",
            alt: "Nurseri dataran tinggi",
        },
        {
            category: "Teknik",
            title: "Perbanyakan: Moss vs. Perlite",
            excerpt: "Tim ahli hortikultural kami membandingkan substrat terbaik untuk perbanyakan node tanaman.",
            image: "/images/homepage/journal/propagation.jpg",
            alt: "Teknik perbanyakan tanaman",
        },
    ]),
});

export type JournalSectionData = z.infer<typeof journalSectionSchema>;

// ============================================
// TESTIMONIALS SECTION
// ============================================

export const testimonialsSectionSchema = z.object({
    limit: z.number().default(6),
});

export type TestimonialsSectionData = z.infer<typeof testimonialsSectionSchema>;

// ============================================
// REGISTRY — section key → schema mapping
// ============================================

export const sectionSchemaRegistry = {
    hero_bento: heroBentoSchema,
    trust_strip: trustStripSchema,
    catalog_section: catalogSectionSchema,
    order_process: orderProcessSchema,
    team_section: teamSectionSchema,
    greenspace_cta: greenSpaceCtaSchema,
    b2b_section: b2bSectionSchema,
    consultation_cta: consultationCtaSchema,
    excellence_section: excellenceSectionSchema,
    newsletter_section: newsletterSectionSchema,
    journal_section: journalSectionSchema,
    testimonials_section: testimonialsSectionSchema,
} as const;

export type SectionKey = keyof typeof sectionSchemaRegistry;
