"use server";

import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getPageContentForAdmin, updatePageContent } from "@/shared/lib/data/page-content";
import { getSectionSchema, PAGE_REGISTRY, type PageKey } from "@/shared/lib/schemas/page-registry";
import { updatePageSectionSchema } from "@/shared/lib/validations/page-content";
import { revalidateTag } from "next/cache";

/**
 * Fetch page content for admin editor (uncached — always fresh).
 */
export async function fetchPageContentForAdmin(pageKey: string) {
  await requireAdmin();

  const page = PAGE_REGISTRY[pageKey as PageKey];
  if (!page) return { success: false as const, error: "Page tidak ditemukan" };

  const result = await getPageContentForAdmin(page.dbKey);
  return {
    success: true as const,
    content: (result?.content ?? {}) as Record<string, unknown>,
    updatedAt: result?.updatedAt?.toISOString() ?? null,
  };
}

/**
 * Update a single section within a page's content.
 * Validates against the Zod schema for that section.
 */
export async function updatePageSection(formData: FormData) {
  await requireAdmin();

  const pageKey = formData.get("pageKey") as string;
  const sectionKey = formData.get("sectionKey") as string;
  const rawData = formData.get("data") as string;

  // 1. Validate input envelope
  const envelope = updatePageSectionSchema.safeParse({
    pageKey,
    sectionKey,
    data: JSON.parse(rawData || "{}"),
  });

  if (!envelope.success) {
    return { success: false, error: envelope.error.issues[0].message };
  }

  // 2. Find section-specific schema and validate data
  const sectionSchema = getSectionSchema(pageKey, sectionKey);
  if (!sectionSchema) {
    return { success: false, error: `Section "${sectionKey}" tidak ditemukan di page "${pageKey}"` };
  }

  const sectionParsed = sectionSchema.safeParse(envelope.data.data);
  if (!sectionParsed.success) {
    return {
      success: false,
      error: `Validasi gagal: ${sectionParsed.error.issues.map(i => i.message).join(", ")}`,
    };
  }

  // 3. Get dbKey from registry
  const page = PAGE_REGISTRY[pageKey as PageKey];
  if (!page) return { success: false, error: "Page tidak ditemukan" };

  // 4. Update DB via DAL
  await updatePageContent(page.dbKey, sectionKey, sectionParsed.data);

  // 5. Bust cache — surgical tag-based invalidation
  revalidateTag(`page-content-${page.dbKey}`);
  revalidateTag("page-content");

  return { success: true };
}
