import 'server-only';
import crypto from "crypto";
import { prisma } from "@/shared/lib/prisma";

// ══════════════════════════════════════
// Password Reset Token — Data Access Layer
// ══════════════════════════════════════
// Rule #2:  All Prisma calls live here.
// Rule #13: Known errors handled gracefully.
// Rule #14: findUnique for token lookups (unique index).

const TOKEN_EXPIRY_HOURS = 1; // Token valid for 1 hour

// ── WRITES ──

/** Generate a cryptographically secure reset token and store it.
 *  Invalidates any existing unused tokens for the same email. */
export async function createPasswordResetToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Invalidate existing unused tokens for this email (mark as used)
    await prisma.passwordResetToken.updateMany({
        where: { email, usedAt: null },
        data: { usedAt: new Date() },
    });

    await prisma.passwordResetToken.create({
        data: { token, email, expiresAt },
    });

    return token;
}

/** Mark token as used — returns true if valid token was consumed */
export async function consumePasswordResetToken(
    token: string
): Promise<{ valid: true; email: string } | { valid: false; error: string }> {
    const record = await prisma.passwordResetToken.findUnique({
        where: { token },
        select: { id: true, email: true, expiresAt: true, usedAt: true },
    });

    if (!record) {
        return { valid: false, error: "Token tidak valid" };
    }

    if (record.usedAt) {
        return { valid: false, error: "Token sudah digunakan" };
    }

    if (record.expiresAt < new Date()) {
        return { valid: false, error: "Token sudah kadaluarsa" };
    }

    // Mark as consumed
    await prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
    });

    return { valid: true, email: record.email };
}

// ── READS ──

/** Verify a token is valid without consuming it (for page-level validation) */
export async function verifyPasswordResetToken(
    token: string
): Promise<boolean> {
    const record = await prisma.passwordResetToken.findUnique({
        where: { token },
        select: { expiresAt: true, usedAt: true },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
        return false;
    }

    return true;
}
