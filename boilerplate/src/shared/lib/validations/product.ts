import { z } from "zod";

// ── ProductSpecs JSON validation ──
export const productSpecsSchema = z.object({
  // Core 6 — required
  light: z.string().min(1, "Cahaya wajib diisi"),
  water: z.string().min(1, "Air wajib diisi"),
  soil: z.string().min(1, "Media tanam wajib diisi"),
  humidity: z.string().min(1, "Kelembaban wajib diisi"),
  temperature: z.string().min(1, "Suhu wajib diisi"),
  toxicity: z.string().min(1, "Toksisitas wajib diisi"),

  // Extended — all optional
  family: z.string().optional(),
  genus: z.string().optional(),
  height: z.string().optional(),
  potSize: z.string().optional(),
  growthRate: z.string().optional(),
  careTips: z.string().optional(),
  fertilizing: z.string().optional(),
  careDetails: z.object({
    light: z.string().optional(),
    water: z.string().optional(),
    humidity: z.string().optional(),
    difficulty: z.string().optional(),
  }).optional(),
  childrenSafe: z.boolean().optional(),
  handling: z.string().optional(),
  originRegions: z.array(z.string()).optional(),
  habitat: z.string().optional(),
  usageTags: z.array(z.object({
    icon: z.string(),
    label: z.string(),
  })).optional(),
  benefits: z.array(z.object({
    icon: z.string(),
    label: z.string(),
    description: z.string(),
  })).optional(),
  packagingType: z.string().optional(),
  acclimationGuide: z.string().optional(),
});

// ── Product create/update validation ──
export const productFormSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(200),
  sku: z.string().min(1, "SKU wajib diisi").max(50),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  scientificName: z.string().max(200).optional().default(""),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  compareAtPrice: z.number().min(0).nullable().optional(),
  discountPct: z.number().min(0).max(100).default(0),
  stock: z.number().int().min(0).default(0),
  careDifficulty: z.number().int().min(1).max(5).default(2),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  sizeOptions: z.array(z.string()).default([]),
  labels: z.array(z.string()).default([]),
  specs: productSpecsSchema,
  faqs: z.array(z.object({
    q: z.string().min(1),
    a: z.string().min(1),
  })).default([]),
  curatorId: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
