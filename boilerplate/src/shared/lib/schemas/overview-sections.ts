/**
 * Zod Schemas — Overview Page Section Data Validation
 * 12 sections with defaults matching current hardcoded component values.
 */

import { z } from "zod";

// ============================================
// OVERVIEW HERO
// ============================================

export const overviewHeroSchema = z.object({
    nibBadge: z.string().default("NIB: 0712240010385"),
    headingPrefix: z.string().default("PT Bumi Mekarsari Jaya:"),
    headingAccent: z.string().default("Jaringan Supplier"),
    headingSuffix: z.string().default("Tanaman Nusantara"),
    trustBadge1: z.string().default("Legalitas Resmi"),
    trustBadge2: z.string().default("Bibit Unggul"),
    heroImage: z.string().default("https://lh3.googleusercontent.com/aida-public/AB6AXuD9l2EcOIrirbeRTMe9Yo7yCOcFNMf-tVCC_qhtN20lqVpjw0kkyhBCoqMOhFtxJzoDa0hGpB5VUtmd0GMjES6h5Id4drUj0HhBNl4_dzWzDOO5ZoWgZZklhHyAZ3UliFpm42zFrsAgkzOAWDJ-voto9moh4-PCXt3bFWCfzhrLaIInEbV10SasoCJgYcyDMSigJUf-fLsY1v3tz5GWbIOss6B0ifnWbhbAXavqVPrnR4vW978jSTz1dcMbtx7rflkE57S1Muszg10"),
    heroImageAlt: z.string().default("Nursery tanaman hias PT Bumi Mekarsari Jaya di Cipanas"),
    heroQuote: z.string().default('"Mitra Tumbuh Bersama Alam"'),
});
export type OverviewHeroData = z.infer<typeof overviewHeroSchema>;

// ============================================
// OVERVIEW STICKY NAV
// ============================================

const navItemSchema = z.object({ id: z.string(), label: z.string() });
export const overviewStickyNavSchema = z.object({
    items: z.array(navItemSchema).default([
        { id: "tentang", label: "Beranda" },
        { id: "tentang-kami", label: "Overview" },
        { id: "jaringan", label: "Jaringan" },
        { id: "galeri", label: "Galeri" },
        { id: "logistik", label: "Logistik" },
        { id: "kontak", label: "Kontak" },
    ]),
});
export type OverviewStickyNavData = z.infer<typeof overviewStickyNavSchema>;

// ============================================
// OVERVIEW STATS
// ============================================

const statItemSchema = z.object({ value: z.string(), label: z.string(), icon: z.string(), accent: z.boolean().default(false) });
export const overviewStatsSchema = z.object({
    stats: z.array(statItemSchema).default([
        { value: "50+", label: "Nursery Mitra", icon: "forest", accent: false },
        { value: "25+", label: "Kota Terjangkau", icon: "location_city", accent: true },
        { value: "200+", label: "Varietas Tanaman", icon: "potted_plant", accent: false },
        { value: "34", label: "Provinsi Pengiriman", icon: "local_shipping", accent: true },
    ]),
    nibText: z.string().default("NIB: 0712240010385 — Terdaftar di OSS (7 Desember 2024)"),
});
export type OverviewStatsData = z.infer<typeof overviewStatsSchema>;

// ============================================
// OVERVIEW ABOUT
// ============================================

export const overviewAboutSchema = z.object({
    badge: z.string().default("Tentang BMJ"),
    heading: z.string().default("Dari Jaringan Petani, untuk Indonesia"),
    paragraphs: z.array(z.string()).default([
        "PT Bumi Mekarsari Jaya (BMJ) berdiri sebagai kurator kualitas dalam industri tanaman hias Indonesia. Berawal dari kelompok tani di kawasan Cipanas — pusat nursery legendaris di Jawa Barat — kami membangun jaringan yang menghubungkan puluhan nursery petani lokal dengan pasar nasional.",
        "Dengan lebih dari satu dekade pengalaman, BMJ bukan sekadar supplier — kami adalah mitra strategis yang memahami bahwa setiap proyek lanskap memiliki kebutuhan unik. Dari resort mewah di Bali hingga gedung perkantoran di Jakarta, jaringan 50+ nursery mitra kami memastikan varietas yang tepat, dalam kualitas terbaik, tersedia tepat waktu.",
        "Model bisnis kami unik: satu pintu transaksi, banyak sumber tanaman. Ini memungkinkan kami menawarkan varietas jauh lebih beragam dibanding nursery tunggal, dengan kapasitas supply yang siap melayani proyek berskala apa pun.",
    ]),
    stat1Value: z.string().default("10+"),
    stat1Label: z.string().default("th Pengalaman"),
    stat2Value: z.string().default("100%"),
    stat2Label: z.string().default("Garansi Kualitas"),
    aboutImage: z.string().default("https://lh3.googleusercontent.com/aida-public/AB6AXuD9l2EcOIrirbeRTMe9Yo7yCOcFNMf-tVCC_qhtN20lqVpjw0kkyhBCoqMOhFtxJzoDa0hGpB5VUtmd0GMjES6h5Id4drUj0HhBNl4_dzWzDOO5ZoWgZZklhHyAZ3UliFpm42zFrsAgkzOAWDJ-voto9moh4-PCXt3bFWCfzhrLaIInEbV10SasoCJgYcyDMSigJUf-fLsY1v3tz5GWbIOss6B0ifnWbhbAXavqVPrnR4vW978jSTz1dcMbtx7rflkE57S1Muszg10"),
    aboutImageAlt: z.string().default("Tim BMJ mengecek kualitas tanaman di nursery Cipanas"),
});
export type OverviewAboutData = z.infer<typeof overviewAboutSchema>;

// ============================================
// OVERVIEW NETWORK
// ============================================

const satelliteSchema = z.object({ label: z.string(), angle: z.number() });
const mitraSchema = z.object({ name: z.string(), specialty: z.string(), capacity: z.string() });
export const overviewNetworkSchema = z.object({
    centerLabel: z.string().default("BMJ"),
    centerSubtitle: z.string().default("Pusat Koordinasi"),
    satellites: z.array(satelliteSchema).default([
        { label: "Tanaman Hias", angle: 0 }, { label: "Tanaman Buah", angle: 60 }, { label: "Pohon Besar", angle: 120 },
        { label: "Groundcover", angle: 180 }, { label: "Tanaman Hias", angle: 240 }, { label: "Palm & Palem", angle: 300 },
    ]),
    heading: z.string().default("Sistem Jaringan Terintegrasi"),
    description: z.string().default("Kami mengelola kualitas dari berbagai titik satelit nursery untuk memastikan ketersediaan stok yang konsisten sepanjang tahun."),
    mitraTitle: z.string().default("Mitra Unggulan"),
    mitra: z.array(mitraSchema).default([
        { name: "Nursery Cipanas Indah", specialty: "Spesialis Aroid & Philodendron", capacity: "5.000+ unit/bulan" },
        { name: "Kebun Bunga Puncak", specialty: "Tanaman Hias Outdoor & Groundcover", capacity: "10.000+ unit/bulan" },
        { name: "Agro Nursery Lembang", specialty: "Pohon Besar & Tanaman Peneduh", capacity: "2.000+ unit/bulan" },
    ]),
});
export type OverviewNetworkData = z.infer<typeof overviewNetworkSchema>;

// ============================================
// OVERVIEW GALLERY
// ============================================

const galleryItemSchema = z.object({ src: z.string(), alt: z.string(), category: z.string(), span: z.string().optional() });
const galleryTabSchema = z.object({ key: z.string(), label: z.string() });
export const overviewGallerySchema = z.object({
    badge: z.string().default("Dokumentasi"),
    heading: z.string().default("Galeri & Dokumentasi"),
    tabs: z.array(galleryTabSchema).default([
        { key: "semua", label: "Semua" }, { key: "logistik", label: "Logistik" },
        { key: "kebun", label: "Kebun" }, { key: "proyek", label: "Proyek" },
    ]),
    items: z.array(galleryItemSchema).default([]),
});
export type OverviewGalleryData = z.infer<typeof overviewGallerySchema>;

// ============================================
// OVERVIEW TEAM
// ============================================

const teamMemberSchema = z.object({ name: z.string(), role: z.string(), quote: z.string(), initials: z.string(), bgClass: z.string() });
export const overviewTeamSchema = z.object({
    badge: z.string().default("The Nurserymen"),
    heading: z.string().default("Dipimpin oleh Ahli"),
    members: z.array(teamMemberSchema).default([
        { name: "Budi Santoso", role: "CEO & Founder", quote: '"Memberdayakan petani lokal, melayani pasar nasional."', initials: "BS", bgClass: "from-brand-dark to-brand-deep" },
        { name: "Siti Aminah", role: "Head of Operations", quote: '"Ketepatan waktu adalah komitmen, bukan janji."', initials: "SA", bgClass: "from-brand-accent/80 to-brand-accent" },
        { name: "Dr. Ahmad Fikri", role: "Horticulturist", quote: '"Ilmu tanaman yang baik menghasilkan kualitas yang konsisten."', initials: "AF", bgClass: "from-brand-dark/80 to-brand-dark" },
    ]),
});
export type OverviewTeamData = z.infer<typeof overviewTeamSchema>;

// ============================================
// OVERVIEW LOGISTICS
// ============================================

const logisticsStepSchema = z.object({ icon: z.string(), title: z.string(), desc: z.string(), step: z.string() });
export const overviewLogisticsSchema = z.object({
    badge: z.string().default("Sistem Logistik"),
    heading: z.string().default("Sistem Pengiriman Terintegrasi"),
    subtitle: z.string().default("Dari nursery langsung ke lokasi proyek Anda — dengan jaminan kualitas di setiap tahap."),
    steps: z.array(logisticsStepSchema).default([
        { icon: "inventory_2", title: "Seleksi & Packaging", desc: "Inspeksi kualitas ketat sebelum pengiriman. Packaging khusus tanaman hidup.", step: "01" },
        { icon: "local_shipping", title: "Kurir Darat", desc: "Armada khusus untuk pengiriman antar kota dengan kontrol suhu.", step: "02" },
        { icon: "flight_takeoff", title: "Cargo Udara", desc: "Express delivery via kargo udara untuk pesanan prioritas.", step: "03" },
        { icon: "sailing", title: "Ekspedisi Laut", desc: "Pengiriman kontainer untuk volume besar antar pulau.", step: "04" },
    ]),
    partnersLabel: z.string().default("Mitra Ekspedisi"),
    partners: z.array(z.string()).default(["JNE", "J&T", "SiCepat", "POS Indonesia", "DHL", "TIKI"]),
});
export type OverviewLogisticsData = z.infer<typeof overviewLogisticsSchema>;

// ============================================
// OVERVIEW GUARANTEE
// ============================================

export const overviewGuaranteeSchema = z.object({
    heading: z.string().default("Garansi 100% Aman"),
    description: z.string().default("Kami menjamin setiap tanaman tiba dalam kondisi prima. Jika terjadi kerusakan saat pengiriman, kami akan mengganti dengan unit baru atau melakukan refund — tanpa syarat rumit."),
    badgeText: z.string().default("Terproteksi"),
});
export type OverviewGuaranteeData = z.infer<typeof overviewGuaranteeSchema>;

// ============================================
// OVERVIEW TESTIMONIALS
// ============================================

const testimonialSchema = z.object({ name: z.string(), company: z.string(), rating: z.number(), content: z.string(), initials: z.string() });
export const overviewTestimonialsSchema = z.object({
    badge: z.string().default("Testimoni"),
    heading: z.string().default("Dipercaya Mitra Bisnis"),
    testimonials: z.array(testimonialSchema).default([
        { name: "Ahmad Hidayat", company: "PT Green Landscape Indonesia", rating: 5, content: "Kualitas tanaman dari BMJ sangat konsisten. Pengiriman ke proyek resort di Bali pun tiba dalam kondisi prima. Sudah 3 tahun jadi partner B2B kami.", initials: "AH" },
        { name: "Dewi Lestari", company: "Interior Design Studio Bali", rating: 5, content: "Varietas monstera dan philodendron dari jaringan BMJ sangat lengkap. Support tim untuk konsultasi jenis tanaman indoor sangat membantu.", initials: "DL" },
        { name: "Budi Santoso", company: "Developer Property Jakarta", rating: 5, content: "Proyek landscaping 3 cluster perumahan kami ditangani dengan baik. Kapasitas supply besar jadi keunggulan utama BMJ.", initials: "BS" },
    ]),
});
export type OverviewTestimonialsData = z.infer<typeof overviewTestimonialsSchema>;

// ============================================
// OVERVIEW FAQ
// ============================================

const faqItemSchema = z.object({ question: z.string(), answer: z.string() });
export const overviewFAQSchema = z.object({
    badge: z.string().default("FAQ"),
    heading: z.string().default("Pertanyaan Umum"),
    subtitle: z.string().default("Jawaban untuk pertanyaan yang sering ditanyakan oleh mitra bisnis kami."),
    items: z.array(faqItemSchema).default([
        { question: "Berapa minimum order untuk pemesanan B2B?", answer: "Untuk pemesanan B2B/proyek, minimum order mulai dari 50 unit per varietas. Untuk retail, tidak ada minimum order. Kami fleksibel menyesuaikan kebutuhan proyek Anda." },
        { question: "Berapa lama waktu pengiriman?", answer: "Estimasi pengiriman: Pulau Jawa 2-4 hari kerja, luar Jawa 5-7 hari kerja, Indonesia Timur 7-14 hari kerja. Untuk proyek besar, kami atur jadwal khusus sesuai kebutuhan." },
        { question: "Apakah ada garansi tanaman?", answer: "Ya. Kami memberikan garansi 100% untuk kerusakan akibat pengiriman. Jika tanaman tiba dalam kondisi rusak, kami ganti unit baru atau refund penuh. Klaim berlaku 24 jam setelah barang diterima." },
        { question: "Bagaimana proses pemesanan untuk proyek besar?", answer: "Hubungi tim kami via WhatsApp atau form RFQ. Kami akan: (1) Survey kebutuhan, (2) Kirim penawaran harga, (3) Siapkan sample jika diperlukan, (4) Atur jadwal pengiriman bertahap. Proses biasanya 3-5 hari kerja." },
        { question: "Apa saja metode pembayaran yang diterima?", answer: "Kami menerima transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, Dana), dan untuk proyek B2B tersedia opsi termin pembayaran sesuai kesepakatan." },
        { question: "Apakah BMJ menyediakan jasa landscaping?", answer: "BMJ fokus sebagai supplier tanaman. Namun, kami memiliki jaringan mitra kontraktor lanskap yang dapat kami referensikan. Kami juga menyediakan konsultasi pemilihan tanaman untuk proyek Anda." },
    ]),
});
export type OverviewFAQData = z.infer<typeof overviewFAQSchema>;

// ============================================
// OVERVIEW CONTACT
// ============================================

const contactInfoSchema = z.object({ icon: z.string(), label: z.string(), value: z.string(), href: z.string() });
const socialSchema = z.object({ name: z.string(), href: z.string() });
export const overviewContactSchema = z.object({
    badge: z.string().default("Hubungi Kami"),
    heading: z.string().default("Mulai Konsultasi"),
    subtitle: z.string().default("Tim kami siap membantu kebutuhan tanaman untuk proyek Anda."),
    contactInfo: z.array(contactInfoSchema).default([
        { icon: "call", label: "Telepon", value: "+62 815 8666 4516", href: "tel:+6281586664516" },
        { icon: "mail", label: "Email", value: "bumimekarsarijaya@gmail.com", href: "mailto:bumimekarsarijaya@gmail.com" },
        { icon: "pin_drop", label: "Kantor & Nursery", value: "Jl. Raya Cipanas, Cianjur, Jawa Barat 43253", href: "https://maps.google.com/?q=Cipanas+Cianjur" },
    ]),
    social: z.array(socialSchema).default([
        { name: "Instagram", href: "#" }, { name: "Facebook", href: "#" }, { name: "LinkedIn", href: "#" },
    ]),
    formTitle: z.string().default("Formulir Penawaran (RFQ)"),
    formSubtitle: z.string().default("Isi detail kebutuhan Anda, tim kami akan merespon dalam 1×24 jam."),
    projectTypes: z.array(z.string()).default(["Residensial / Perumahan", "Komersial / Perkantoran", "Hotel / Resort", "Pemerintahan", "Taman Publik", "Retail / Eceran", "Lainnya"]),
    waNumber: z.string().default("6281586664516"),
});
export type OverviewContactData = z.infer<typeof overviewContactSchema>;

// ============================================
// REGISTRY
// ============================================

export const overviewSectionSchemaRegistry = {
    overview_hero: overviewHeroSchema,
    overview_sticky_nav: overviewStickyNavSchema,
    overview_stats: overviewStatsSchema,
    overview_about: overviewAboutSchema,
    overview_network: overviewNetworkSchema,
    overview_gallery: overviewGallerySchema,
    overview_team: overviewTeamSchema,
    overview_logistics: overviewLogisticsSchema,
    overview_guarantee: overviewGuaranteeSchema,
    overview_testimonials: overviewTestimonialsSchema,
    overview_faq: overviewFAQSchema,
    overview_contact: overviewContactSchema,
} as const;

export type OverviewSectionKey = keyof typeof overviewSectionSchemaRegistry;
