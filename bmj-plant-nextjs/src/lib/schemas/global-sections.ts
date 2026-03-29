import { z } from "zod";

// ============================================
// UNIFIED NAVBAR SETTINGS
// ============================================

// Sub-schema: Navigation link
export const navLinkSchema = z.object({
    label: z.string().min(1, "Label diperlukan"),
    href: z.string().min(1, "URL diperlukan"),
    icon: z.string().optional(),
});

// Main schema: Everything navbar-related in one place
export const navbarSettingsSchema = z.object({
    // ── Identity ──
    siteName: z.string().default("Bumi Mekarsari Jaya"),
    logoUrl: z.string().default(""),

    // ── Navigation ──
    links: z.array(navLinkSchema).default([
        { label: "Produk", href: "/product", icon: "inventory_2" },
        { label: "Portofolio", href: "/portfolio", icon: "cases" },
        { label: "Layanan", href: "/layanan", icon: "build" },
        { label: "Jurnal", href: "/knowledge", icon: "history_edu" },
        { label: "Tentang", href: "/overview", icon: "info" },
    ]),
    loginUrl: z.string().default("/login"),
    registerUrl: z.string().default("/register"),

    // ── Styling: Nav Links ──
    navLinkFontSize: z.string().default("0.8125rem"),
    navLinkFontWeight: z.string().default("600"),
    navLinkLetterSpacing: z.string().default("0.05em"),
    navLinkBorderRadius: z.string().default("4px"),
    navLinkPadding: z.string().default("0.375rem 0.75rem"),
    navLinkColor: z.string().default("#1b3a2d"),
    navLinkHoverBg: z.string().default("#d8d4cd"),
    navLinkActiveBg: z.string().default("#1b3a2d"),
    navLinkActiveColor: z.string().default("#faf9f6"),

    // ── Styling: CTA Buttons ──
    ctaBtnWidth: z.string().default("112px"),
    ctaBtnHeight: z.string().default("40px"),
    ctaBtnRadius: z.string().default("4px"),
    ctaBtnFontSize: z.string().default("16px"),
    ctaBtnFontWeight: z.string().default("400"),
    loginBg: z.string().default("transparent"),
    loginColor: z.string().default("#1a5319"),
    loginBorder: z.string().default("2px solid #1a5319"),
    registerBg: z.string().default("#1a5319"),
    registerColor: z.string().default("#ffffff"),
    registerBorder: z.string().default("none"),
});

export type NavbarSettingsData = z.infer<typeof navbarSettingsSchema>;

// ============================================
// REGISTRY — section key → schema mapping
// ============================================

export const globalSectionSchemaRegistry = {
    navbar_settings: navbarSettingsSchema,
} as const;

export type GlobalSectionKey = keyof typeof globalSectionSchemaRegistry;
