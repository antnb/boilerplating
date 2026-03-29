"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import {
    getUserProfile,
    updateUserProfile,
    getUserHashedPassword,
    updateUserPassword,
} from "@/shared/lib/data/users";
import {
    updateProfileSchema,
    changePasswordSchema,
} from "@/shared/lib/validations/auth";
import type { ActionState } from "./types";

// ── READS ──

export async function getProfile() {
    const user = await getCurrentUser();
    if (!user) return null;

    const profile = await getUserProfile(user.id);
    if (!profile) return null;

    return {
        id: profile.id,
        name: profile.name || "",
        email: profile.email,
        phone: profile.phone || "",
    };
}

// ── MUTATIONS ──

export async function updateProfile(data: {
    name: string;
    phone: string;
}): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = updateProfileSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await updateUserProfile(user.id, {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
    });

    revalidatePath("/account");
    return { success: true };
}

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
}): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // Verify current password via DAL
    const currentHash = await getUserHashedPassword(user.id);
    if (!currentHash) return { success: false, error: "User tidak ditemukan" };

    const isValid = await bcrypt.compare(parsed.data.currentPassword, currentHash);
    if (!isValid) return { success: false, error: "Password saat ini salah" };

    // Hash and save new password
    const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await updateUserPassword(user.id, newHash);

    return { success: true };
}
