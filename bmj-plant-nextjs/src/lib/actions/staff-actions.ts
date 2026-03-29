"use server";

import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  getAllStaffProfiles,
  createStaffProfile,
  updateStaffProfile,
  getStaffProfileById,
} from "@/lib/data/staff-profiles";
import { getEligibleStaffUsers as getEligibleUsers } from "@/lib/data/users";
import {
  createStaffProfileSchema,
  updateStaffProfileSchema,
} from "@/lib/validations/staff";

// ══════════════════════════════════════
// Staff Admin Server Actions
// ══════════════════════════════════════
// Bridge: StaffDashboard "Tim & Expert" tab → Server Action → DAL → Prisma

/** Fetch all staff profiles for admin listing */
export async function fetchStaffProfiles() {
  await requireAdmin();
  return getAllStaffProfiles();
}

/** Fetch single staff profile for editing */
export async function fetchStaffProfileForEdit(userId: string) {
  await requireAdmin();
  return getStaffProfileById(userId);
}

/** Fetch users eligible for staff profile (non-customer, no existing profile) */
export async function fetchEligibleStaffUsers() {
  await requireAdmin();
  return getEligibleUsers();
}

/** Create new staff profile */
export async function createStaffProfileAction(
  data: Record<string, unknown>
) {
  await requireAdmin();

  const parsed = createStaffProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const result = await createStaffProfile(parsed.data);
  if (!result) {
    return { success: false, error: "Profil sudah ada untuk user ini" };
  }

  revalidateTag("staff");
  return { success: true };
}

/** Update existing staff profile */
export async function updateStaffProfileAction(
  userId: string,
  data: Record<string, unknown>
) {
  await requireAdmin();

  const parsed = updateStaffProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const result = await updateStaffProfile(userId, parsed.data);
  if (!result) {
    return { success: false, error: "Profil tidak ditemukan" };
  }

  revalidateTag("staff");
  return { success: true };
}
