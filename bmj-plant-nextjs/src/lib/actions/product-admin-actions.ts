"use server";

import { productFormSchema } from "@/lib/validations/product";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "@/lib/data/products";
import { requireAdmin } from "@/lib/auth-helpers";

type ActionResult =
  | { success: true; data?: { id: string; slug: string } }
  | { success: false; error: string };

export async function createProductAction(
  input: unknown,
  imageUrls: { url: string; alt: string }[]
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data tidak valid",
    };
  }

  try {
    const result = await createProduct(parsed.data, imageUrls);
    return { success: true, data: result };
  } catch (error) {
    console.error("createProductAction error:", error);
    return { success: false, error: "Gagal membuat produk" };
  }
}

export async function updateProductAction(
  id: string,
  input: unknown,
  imageUrls?: { url: string; alt: string }[]
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productFormSchema.partial().safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data tidak valid",
    };
  }

  const result = await updateProduct(id, parsed.data, imageUrls);
  return result;
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const result = await deleteProduct(id);
  return result;
}

export async function updateStockAction(
  id: string,
  stock: number
): Promise<ActionResult> {
  await requireAdmin();

  if (stock < 0) {
    return { success: false, error: "Stok tidak boleh negatif" };
  }

  await updateProductStock(id, stock);
  return { success: true };
}
