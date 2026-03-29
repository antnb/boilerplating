"use server";

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
    getAddressesByUser,
    createAddressInDb,
    updateAddressInDb,
    deleteAddressInDb,
    setDefaultAddressInDb,
} from "@/lib/data/addresses";
import type { ActionState } from "./types";
import { addressSchema, type AddressInput } from "@/lib/validations/address";
import { Prisma } from "@prisma/client";

// ── READS ──

export async function getAddresses() {
    const user = await getCurrentUser();
    if (!user) return [];

    return getAddressesByUser(user.id);
}

// ── MUTATIONS ──

export async function createAddress(
    data: AddressInput
): Promise<ActionState<{ id: string }> & { address?: { id: string } }> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };

    const parsed = addressSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message };
    }

    try {
        // Map Zod schema fields to DAL expected fields
        const { addressLine1, addressLine2, ...rest } = parsed.data;
        const newAddress = await createAddressInDb(user.id, {
            ...rest,
            streetAddress: addressLine1,
            district: addressLine2,
        });
        revalidateTag("addresses");
        return { success: true, data: newAddress, address: newAddress };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { success: false, error: "Alamat dengan label ini sudah ada" };
        }
        console.error("createAddress error:", error);
        return { success: false, error: "Gagal menyimpan alamat" };
    }
}

export async function updateAddress(
    id: string,
    data: Partial<AddressInput>
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };
    if (!id) return { success: false, error: "ID alamat tidak valid" };

    try {
        await updateAddressInDb(id, user.id, data);
        revalidateTag("addresses");
        return { success: true };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return { success: false, error: "Alamat tidak ditemukan" };
        }
        console.error("updateAddress error:", error);
        return { success: false, error: "Gagal memperbarui alamat" };
    }
}

export async function deleteAddress(id: string): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };
    if (!id) return { success: false, error: "ID alamat tidak valid" };

    try {
        await deleteAddressInDb(id, user.id);
        revalidateTag("addresses");
        return { success: true };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return { success: false, error: "Alamat tidak ditemukan" };
        }
        console.error("deleteAddress error:", error);
        return { success: false, error: "Gagal menghapus alamat" };
    }
}

export async function setDefaultAddress(id: string): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Anda harus login terlebih dahulu" };
    if (!id) return { success: false, error: "ID alamat tidak valid" };

    try {
        await setDefaultAddressInDb(id, user.id);
        revalidateTag("addresses");
        return { success: true };
    } catch (error) {
        console.error("setDefaultAddress error:", error);
        return { success: false, error: "Gagal mengatur alamat default" };
    }
}
