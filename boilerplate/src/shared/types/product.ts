// ============================================
// Product Types — Single Source of Truth
// ============================================
// Used by: ProductForm, ProductDetailClient, DAL, Server Actions, seed.ts

/** Extended specs stored in Product.specs JSON column.
 *  First 6 fields are REQUIRED (existing seed data).
 *  All new fields are OPTIONAL — admin fills progressively. */
export interface ProductSpecs {
  // ── Core care (existing, required) ──
  light: string;        // "Bright Indirect"
  water: string;        // "Moderate (Keringkan topsoil 2cm)"
  soil: string;         // "Chunky Aroid Mix"
  humidity: string;     // "60% - 80%"
  temperature: string;  // "18°C - 28°C"
  toxicity: string;     // "Toxic to Pets" | "Non-toxic"

  // ── Identity (auto-computed or admin override) ──
  family?: string;      // "Araceae" — defaults derived from category
  genus?: string;       // Auto-parsed from scientificName

  // ── Physical specs ──
  height?: string;      // "40-60cm"
  potSize?: string;     // "20cm"
  growthRate?: string;  // "Lambat" | "Sedang" | "Cepat"

  // ── Care details ──
  careTips?: string;    // "Bersihkan daun secara berkala"
  fertilizing?: string; // "NPK 20-20-20 setiap 2 minggu"
  careDetails?: {
    light?: string;     // Extended description
    water?: string;
    humidity?: string;
    difficulty?: string;
  };

  // ── Safety ──
  childrenSafe?: boolean;
  handling?: string;    // "Gunakan sarung tangan"

  // ── Origin ──
  originRegions?: string[];  // ["Kolombia", "Ekuador"]
  habitat?: string;          // "Hutan Hujan Tropis"

  // ── Usage & Benefits ──
  usageTags?: { icon: string; label: string }[];
  benefits?: { icon: string; label: string; description: string }[];

  // ── Commerce ──
  packagingType?: string;       // "BARE_ROOT" | "POTTED" | "TISSUE_CULTURE"
  acclimationGuide?: string;    // Markdown text
}

/** Shape used by admin Product form (new version) */
export interface ProductFormData {
  name: string;
  sku: string;
  categoryId: string;       // FK to Category — replaced hardcoded string
  scientificName: string;
  price: number;
  compareAtPrice?: number;
  discountPct: number;
  stock: number;
  careDifficulty: number;
  description: string;
  sizeOptions: string[];
  labels: string[];
  specs: ProductSpecs;
  faqs: { q: string; a: string }[];
  curatorId?: string;       // FK to StaffProfile
  isActive: boolean;
  // Images handled separately via upload API
}


/** Minimal product listing (for catalog/search) */
export interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  scientificName: string | null;
  price: number;
  compareAtPrice: number | null;
  discountPct: number;
  stock: number;
  careDifficulty: number;
  labels: string[];
  sizeOptions: string[];
  isActive: boolean;
  images: { url: string; alt: string }[];
  category: { name: string; slug: string };
}
