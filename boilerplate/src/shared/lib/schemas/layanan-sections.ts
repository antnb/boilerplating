/**
 * Zod Schemas — Layanan Page Section Data Validation
 *
 * Mirror of homepage-sections.ts architecture.
 * Each schema defines the expected JSON structure for a layanan section's
 * `data` field in the `PageSection` model.
 */

import { z } from "zod";

// ============================================
// LAYANAN HERO
// ============================================

export const layananHeroSchema = z.object({
    badgeIcon: z.string().default("verified"),
    badgeText: z.string().default("Kelompok Tani Cipanas"),
    headingLine1: z.string().default("SUPPLIER TANAMAN"),
    headingLine2: z.string().default("LANGSUNG DARI PETANI"),
    subtitle: z.string().default(
        "Kami menghubungkan Anda langsung dengan jaringan petani spesialis. Tanpa perantara berlapis, jaminan kualitas kurasi, dan harga tangan pertama."
    ),
});

export type LayananHeroData = z.infer<typeof layananHeroSchema>;

// ============================================
// LAYANAN USP
// ============================================

const uspCardSchema = z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
});

export const layananUSPSchema = z.object({
    cards: z.array(uspCardSchema).default([
        { icon: "sell", title: "Langsung dari Petani", desc: "Harga tangan pertama tanpa markup berlapis — transaksi langsung dengan kelompok tani." },
        { icon: "warehouse", title: "Kapasitas Besar", desc: "Kapasitas suplai ribuan tanaman melalui jaringan ratusan petani mitra." },
        { icon: "public", title: "Pengiriman Nasional", desc: "Pengiriman aman ke seluruh wilayah Indonesia via logistik terpercaya." },
    ]),
});

export type LayananUSPData = z.infer<typeof layananUSPSchema>;

// ============================================
// LAYANAN QUICK CONTACT
// ============================================

export const layananQuickContactSchema = z.object({
    heading: z.string().default("Butuh Respon Cepat?"),
    subtitle: z.string().default("Hubungi tim penjualan kami langsung."),
    phoneNumber: z.string().default("081586664516"),
    phoneDisplay: z.string().default("0815-8666-4516"),
    waButtonText: z.string().default("Chat WhatsApp"),
});

export type LayananQuickContactData = z.infer<typeof layananQuickContactSchema>;

// ============================================
// LAYANAN CARA KERJA
// ============================================

const caraKerjaStepSchema = z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
});

export const layananCaraKerjaSchema = z.object({
    sectionTitle: z.string().default("Cara Kerja Kami"),
    steps: z.array(caraKerjaStepSchema).default([
        { icon: "chat", title: "1. Hubungi", desc: "Konsultasikan kebutuhan jenis, jumlah, dan timeline via WhatsApp." },
        { icon: "checklist", title: "2. Kurasi", desc: "Tim kami koordinasi dengan petani mitra untuk memilih tanaman terbaik." },
        { icon: "inventory_2", title: "3. Kemas", desc: "Standar packing kayu dan media khusus untuk perjalanan jauh." },
        { icon: "local_shipping", title: "4. Terima", desc: "Tanaman tiba dengan garansi kondisi sehat sampai tujuan." },
    ]),
});

export type LayananCaraKerjaData = z.infer<typeof layananCaraKerjaSchema>;

// ============================================
// LAYANAN PARTNERS
// ============================================

const partnerSchema = z.object({
    icon: z.string(),
    name: z.string(),
});

export const layananPartnersSchema = z.object({
    label: z.string().default("Dipercaya Partner Nasional"),
    partners: z.array(partnerSchema).default([
        { icon: "apartment", name: "CIPUTRA" },
        { icon: "domain", name: "PAKUWON" },
        { icon: "hotel", name: "MARRIOTT" },
        { icon: "location_city", name: "SUMMARECON" },
        { icon: "corporate_fare", name: "AGUNG PODOMORO" },
    ]),
});

export type LayananPartnersData = z.infer<typeof layananPartnersSchema>;

// ============================================
// LAYANAN SEGMEN
// ============================================

const segmenItemSchema = z.object({
    label: z.string(),
    labelColor: z.string().default("bg-brand-accent text-brand-dark"),
    title: z.string(),
    desc: z.string(),
    cta: z.string(),
    href: z.string().default("/product"),
    image: z.string(),
});

export const layananSegmenSchema = z.object({
    segments: z.array(segmenItemSchema).default([
        {
            label: "Grosir", labelColor: "bg-brand-accent text-brand-dark",
            title: "Suplai Proyek", desc: "Solusi pengadaan tanaman skala besar untuk kontraktor, hotel, dan pengembang properti.",
            cta: "Lihat Katalog Grosir", href: "/product",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIQ33E8YnJWlGyZgBOFJuN5jGmYObUlIk4nCjBaC8tQf-4OFWWeRLIGtEkzRSyE7dtIuxSrOG7Nh3RpTxIqmKq2r82P9HMnuNHWu1Nn3MMqyWS8u8ZPU5mZAFzcwqQMDtg6PGZXgr-ZSdTz_dVEZY4b9dYQ73XvmKOahbtWf6dWjxbr4xQlJlkP3OdiyJNFkiQQQD6Ce0z5hvq3Xdt7eLcDEKIwQNLUsjx2xDVLWtLAeZvXxZ6_iBJZ24YT-DLzWDR-bPivdiZv84",
        },
        {
            label: "Retail", labelColor: "bg-white text-brand-dark",
            title: "Koleksi Exotic", desc: "Spesimen langka dan tanaman hias premium untuk kolektor.",
            cta: "Lihat Koleksi Langka", href: "/product",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb_JT-OMpbAARjw_I_adszrso-iPVZWlKbawSsOPZCqyY9B3xlQtv1n40kO5hAazielNI18ahoL9WaVfEJSp4C57SZ6yTN2l54qn2_PPwAp5hvJBlmbjlkNTUM_CPjdhWwS_5eE-RIYwzbZpkBlAgeVA1WTmt1W6cDFmadogdN87YfXsY_oRKA1I49yqNQAEysWkL5E2BJ_bV6Ry-odk5q4SXiKAr2rbFnGPmSo55kdZIT3OtqK-2WlCcEKLR_dVUxQrVUxfBvIH0",
        },
    ]),
});

export type LayananSegmenData = z.infer<typeof layananSegmenSchema>;

// ============================================
// LAYANAN GALERI
// ============================================

const galeriItemSchema = z.object({
    name: z.string(),
    info: z.string(),
    tag: z.string().optional(),
    image: z.string(),
    span: z.string().default("col-span-1 row-span-1"),
});

export const layananGaleriSchema = z.object({
    sectionTitle: z.string().default("Galeri Spesimen"),
    ctaText: z.string().default("Lihat Semua"),
    ctaHref: z.string().default("/product"),
    items: z.array(galeriItemSchema).default([
        { name: "Aroid", info: "Stok: 50+", tag: "Varigata", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJJDMPmed-xPvcMhNayfWX3oUsoARf771oyTkye2xyzFdifpdK-NHjVi05Jy2cBS3hODKwF8eqxoOlvDrj0Ljd1rqa1KNBINOGfTzbVwqCXAJRFsP5qbymgkf6F8PkXf0HWl-Xv9L0q0XnAW9hXyuZx3pRYHGJc3D4mvwd55PsXGOmP-gtP1ddTwfL9SWnMMuRz77MXdrFSo1pR3mLCAtf90I4_9CNTUJYsGWl9Cvk_BGKL4lVIVjVFGdUskjUlNdqVC6os6B9tQs", span: "col-span-1 row-span-2" },
        { name: "Sikas", info: "Tinggi: 80-120cm", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjzsqMjlAjnrFKQBRcN1MejCx-AKqKnlFCroch7d9XrVqyyQKwuZdf9YeMZqrlr_m-iFeAfaPEeZ1FlMgbXUwvduY5vTaqWA3LA7EUf27vcFfmzF44XDbR3cKxt7RVDj8JBBspzth4MGhRkbyQfxhpsLQAw5IMsJzvzDoGpzMSCpD3_oGcvKg1sFownt-ljJZKMLU3uczHvuN-rSIIeOE01htSWHZ8NTrCwJrnVrxFAYDmLza2JuLvwKhaOh8kOhFYpO32VhhzP5Y", span: "col-span-1 row-span-1" },
        { name: "Aglaonema", info: "Stok: 200+ pot", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKxIlI7sYLKHXHB4JB0m0BDPGRiXnb6dNdCITDISfVadR3ZknoDL40q-R_SNQe74lr7tNFP7F9CI5T1WBT6-dHm7R7tp_Pil7itVvP9YhfSqr0Oa8xP-PJtZ2bsjplq6yld69tSPMdWOG85S9m8FQjozelGvrmcWsyB61LFBdl4ca4aiWrtBuR0UqtVINMvpAKqz08T6HFcA6_HpoqEpAt98HDT359nSiB-w9v_tNxbElXXIV3brruLC72lnhR5UxTzYq6Iw2O7bk", span: "col-span-1 row-span-1" },
        { name: "Palms", info: "3-5m", tag: "Project Grade", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8m7SARRxYWix1sKa_ppCrfZiojz976VWxL5CFPZ_pe9OnztElQaymFkeYPCrqgHIcOrLAY7nGNdQgSAlPBZf-x8Bm9pQXT-Txu1D6lwj7WRLv5vyVuqdYAgLJmPhPJLGZmU_LxjYaAxiBjvk3ykU3BlrB_aCv-6QVXlOKDJSEsO29QzBcsDdYLWmiZkYCRjr-p7n23anBfM4MP2NfvcPqSLsTjOjiaswqHzHt33ZRI3PMv8wf-Jc5p_4GuzOoa4jj8PUgTf6iRfs", span: "col-span-1 row-span-2" },
        { name: "Bonsai", info: "Usia: 15+ Tahun", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIHUO7E4i8QO_ak9Ctv1saKMuW5bqnpt7WwRuCTNpcmFMVr2bMqi-TYNENpTtEg8Cr3b4uBk0pPCR3_gdYGVePVrNKnt5eIQDvgNSVxRJrtNjuh78x_6Z4Fpsx6b3GVhAQU_SFpvkQhzcraG1lDtKpgP2rR8UU11qD437WvVnYtsqeaYaA5myOer96C5om0nrOaDJu0UfQZ1ql8mOaWVBUNhsknYTX6_p1CGPJR0vFSKOAigXH9lzuyTbSfWILoWgtZPzm1d11zBQ", span: "col-span-1 row-span-1" },
        { name: "Indoor", info: "Low Maintenance", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJjNcWE8Szy3a04FUi2F2K8vl_gjBhVXBTP1Lx-wr0d_t74V6m3Vazysb6_IS-CE26i4LNNfmEa_RPiFZz8_GE0r44SMVkGEVz6pey9_nGfOuUwmqhUEmmVNJc-prr76-lJREHRBsmWO2srsYCtxEIPaxYCuqOt7Y3D8dFa-NSb1cVpQQNA1sop_NnToROVKv-0q5f_nM9sfTYGRx-TODPCzNYR9tLBSqUwC_XTo1dNi7jm5TiL0fjoOkFzsOksOSZ9MUiWzz9WM8", span: "col-span-1 row-span-1" },
    ]),
});

export type LayananGaleriData = z.infer<typeof layananGaleriSchema>;

// ============================================
// LAYANAN PELANGGAN
// ============================================

const personaSchema = z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    solution: z.string(),
});

export const layananPelangganSchema = z.object({
    sectionTitle: z.string().default("Siapa yang Kami Layani?"),
    personas: z.array(personaSchema).default([
        { icon: "storefront", title: "Toko Tanaman & Nursery", desc: "Reseller yang membutuhkan stok rutin berkualitas stabil dengan harga grosir.", solution: "Restok Mingguan & Konsinyasi" },
        { icon: "architecture", title: "Kontraktor & Arsitek", desc: "Pengadaan tanaman lanskap sesuai spesifikasi proyek dan RAB.", solution: "Penawaran Project & Faktur Pajak" },
        { icon: "potted_plant", title: "Kolektor Tanaman", desc: "Pencinta tanaman yang mencari spesies unik, varigata, dan langka.", solution: "Video Call Selection & Real-Pict" },
    ]),
});

export type LayananPelangganData = z.infer<typeof layananPelangganSchema>;

// ============================================
// LAYANAN LOGISTIK
// ============================================

export const layananLogistikSchema = z.object({
    heading: z.string().default("Logistik Terintegrasi"),
    description: z.string().default("Pengiriman aman ke seluruh Indonesia via partner logistik terpercaya."),
    guarantee: z.string().default('Garansi "Death on Arrival" 100%'),
});

export type LayananLogistikData = z.infer<typeof layananLogistikSchema>;

// ============================================
// LAYANAN FAQ
// ============================================

const faqItemSchema = z.object({
    q: z.string(),
    a: z.string(),
});

export const layananFAQSchema = z.object({
    sectionTitle: z.string().default("Pertanyaan Umum (FAQ)"),
    items: z.array(faqItemSchema).default([
        { q: "Apakah ada garansi tanaman mati?", a: 'Ya, kami memberikan garansi 100% "Death on Arrival". Jika tanaman diterima dalam kondisi mati atau rusak parah, kami ganti baru atau refund penuh.' },
        { q: "Berapa minimum order grosir?", a: "Untuk tanaman proyek grosir, minimum order mulai dari 10.000 pohon. Untuk tanaman exotic retail, bisa dibeli satuan." },
        { q: "Apakah ada diskon partai besar?", a: "Tentu. Kami menawarkan tier diskon khusus untuk pembelian volume tinggi atau kontrak suplai rutin. Hubungi tim sales untuk penawaran." },
        { q: "Berapa lama pengiriman?", a: "1-2 hari proses karantina dan treatment akar, ditambah waktu ekspedisi reguler 2-4 hari tergantung lokasi tujuan Anda." },
        { q: "Apakah bisa kirim ke luar Jawa?", a: "Ya, kami melayani pengiriman ke seluruh Indonesia — Sumatera, Kalimantan, Sulawesi, Bali, dan lainnya — via logistik pihak ketiga dengan surat karantina resmi." },
    ]),
});

export type LayananFAQData = z.infer<typeof layananFAQSchema>;

// ============================================
// LAYANAN CTA
// ============================================

export const layananCTASchema = z.object({
    heading: z.string().default("Butuh Supply Tanaman?"),
    description: z.string().default("Konsultasikan kebutuhan tanaman Anda sekarang. Tim ahli kami siap membantu memilih spesimen terbaik."),
    waLink: z.string().default("https://wa.me/6281586664516"),
    waButtonText: z.string().default("Hubungi WhatsApp"),
    catalogButtonText: z.string().default("Lihat Katalog Tanaman"),
    catalogHref: z.string().default("/product"),
});

export type LayananCTAData = z.infer<typeof layananCTASchema>;

// ============================================
// REGISTRY — section key → schema mapping
// ============================================

export const layananSectionSchemaRegistry = {
    layanan_hero: layananHeroSchema,
    layanan_usp: layananUSPSchema,
    layanan_quick_contact: layananQuickContactSchema,
    layanan_cara_kerja: layananCaraKerjaSchema,
    layanan_partners: layananPartnersSchema,
    layanan_segmen: layananSegmenSchema,
    layanan_galeri: layananGaleriSchema,
    layanan_pelanggan: layananPelangganSchema,
    layanan_logistik: layananLogistikSchema,
    layanan_faq: layananFAQSchema,
    layanan_cta: layananCTASchema,
} as const;

export type LayananSectionKey = keyof typeof layananSectionSchemaRegistry;
