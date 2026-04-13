"use server";

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { emailExists, getUserByEmail, updateUserPassword } from "@/shared/lib/data/users";
import {
    createPasswordResetToken,
    consumePasswordResetToken,
} from "@/shared/lib/data/password-reset";
import { rateLimit } from "@/shared/lib/rate-limit";
import { sendPasswordResetEmail } from "@/shared/lib/email/send";
import type { ActionState } from "./types";

// ── Rate limiter: 5 forgot-password requests per hour per IP ──
const forgotLimiter = rateLimit("auth-forgot-password", {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
});

/** Request a password reset link.
 *  Always returns success to prevent account enumeration. */
export async function requestPasswordReset(email: string): Promise<ActionState> {
    // Rate limit by IP
    const headersList = headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "unknown";

    const rateLimitResult = forgotLimiter.check(ip);
    if (!rateLimitResult.success) {
        return {
            success: false,
            error: "Terlalu banyak permintaan. Coba lagi nanti.",
        };
    }

    // Always respond with success — even if email doesn't exist (prevent enumeration)
    const exists = await emailExists(email);
    if (!exists) {
        // Return success anyway — don't reveal whether email exists
        return { success: true };
    }

    // Generate token and store in DB
    const token = await createPasswordResetToken(email);

    // Build reset URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3002";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Send email via Resend (fire-and-forget — failure doesn't change response)
    const user = await getUserByEmail(email);
    await sendPasswordResetEmail({
        to: email,
        resetUrl,
        userName: user?.name || undefined,
    });

    return { success: true };
}

/** Reset password using a valid token */
export async function resetPasswordWithToken(data: {
    token: string;
    password: string;
}): Promise<ActionState> {
    if (!data.token || !data.password) {
        return { success: false, error: "Data tidak lengkap" };
    }

    if (data.password.length < 8) {
        return { success: false, error: "Password minimal 8 karakter" };
    }

    if (data.password.length > 72) {
        return { success: false, error: "Password maksimal 72 karakter" };
    }

    // Consume the token (single-use)
    const result = await consumePasswordResetToken(data.token);
    if (!result.valid) {
        return { success: false, error: result.error };
    }

    // Get user by email from token
    const user = await getUserByEmail(result.email);
    if (!user) {
        return { success: false, error: "Akun tidak ditemukan" };
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await updateUserPassword(user.id, hashedPassword);

    return { success: true };
}
