"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { createUser, getUserProfile } from "@/shared/lib/data/users";
import { registerSchema } from "@/shared/lib/validations/auth";
import { rateLimit } from "@/shared/lib/rate-limit";
import type { ActionState } from "./types";

// ── Rate limiter for registration (3 per hour per IP) ──
const registerLimiter = rateLimit("auth-register", {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
});

// ── MUTATIONS ──

export async function registerCustomer(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
}): Promise<ActionState> {
    // Rate limit check (Server Actions bypass middleware)
    const headersList = headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "unknown";

    const rateLimitResult = registerLimiter.check(ip);
    if (!rateLimitResult.success) {
        return {
            success: false,
            error: "Terlalu banyak percobaan registrasi. Coba lagi nanti.",
        };
    }

    // Zod validation first (Rule #15)
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    // Create user via DAL (Rule #2, handles P2002 — Rule #13)
    const user = await createUser({
        email: parsed.data.email,
        name: parsed.data.name,
        hashedPassword,
        phone: parsed.data.phone || null,
    });

    if (!user) {
        return { success: false, error: "Email sudah terdaftar" };
    }

    return { success: true };
}

// ── READS ──

export async function getOrCreateCustomerProfile(userId: string) {
    if (!userId) return null;
    const profile = await getUserProfile(userId);
    if (!profile) return null;
    return {
        id: profile.id,
        userId: profile.id,
        name: profile.name || "Customer",
        phone: profile.phone || "",
    };
}

export async function getCustomerByUserId(userId: string) {
    if (!userId) return null;
    const profile = await getUserProfile(userId);
    if (!profile) return null;
    return {
        id: profile.id,
        userId: profile.id,
        name: profile.name || "Customer",
        phone: profile.phone || "",
    };
}
