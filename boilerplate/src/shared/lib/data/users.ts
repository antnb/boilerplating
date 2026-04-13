import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

// ══════════════════════════════════════
// User Data Access Layer
// ══════════════════════════════════════
// Rule #2:  All Prisma calls live here, never in actions/components.
// Rule #3:  Every query uses explicit `select`.
// Rule #13: Known errors (P2002, P2025) handled with user-facing messages.
// Rule #14: `findUnique` for email/id lookups (uses unique index).

// ── READS ──

/** Get user by email for authentication — includes hashedPassword */
export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
            roleId: true,
            role: { select: { name: true } },
        },
    });
}

/** Get user profile — NEVER returns hashedPassword */
export async function getUserProfile(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: { select: { name: true } },
            createdAt: true,
        },
    });
}

/** Check if email exists (registration guard) */
export async function emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
    return user !== null;
}

/** Get hashed password for verification (password change flow) */
export async function getUserHashedPassword(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { hashedPassword: true },
    });
    return user?.hashedPassword ?? null;
}

// ── WRITES ──

/** Create new user — returns null if email already exists (P2002) */
export async function createUser(data: {
    email: string;
    name: string;
    hashedPassword: string;
    phone?: string | null;
    roleId?: number;
}) {
    try {
        return await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                hashedPassword: data.hashedPassword,
                phone: data.phone || null,
                roleId: data.roleId ?? 5, // 5 = customer (ROLE_IDS.CUSTOMER)
            },
            select: { id: true, email: true, name: true, role: { select: { name: true } } },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return null; // Email already exists — caller handles messaging
        }
        throw error; // Re-throw unexpected errors
    }
}

/** Update user profile fields */
export async function updateUserProfile(
    userId: string,
    data: { name?: string; phone?: string | null }
) {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, name: true, phone: true },
    });
}

/** Update user password */
export async function updateUserPassword(
    userId: string,
    hashedPassword: string
) {
    return prisma.user.update({
        where: { id: userId },
        data: { hashedPassword },
        select: { id: true },
    });
}

/** Get users eligible for staff profile (non-customer, no existing profile) */
export async function getEligibleStaffUsers() {
    return prisma.user.findMany({
        where: {
            roleId: { not: 5 }, // ROLE_IDS.CUSTOMER — avoid circular import
            staffProfile: null,
        },
        select: { id: true, name: true, email: true, roleId: true },
        orderBy: { name: "asc" },
    });
}

/** Get user's role data by ID — for JWT callback self-healing */
export async function getUserRoleById(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: { roleId: true, role: { select: { name: true } } },
    });
}
