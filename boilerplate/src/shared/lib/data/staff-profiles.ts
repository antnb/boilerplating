import 'server-only';
import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

// ══════════════════════════════════════
// StaffProfile Data Access Layer
// ══════════════════════════════════════
// Rule #2:  All Prisma calls live here.
// Rule #3:  Every query uses explicit `select`.
// Rule #14: findUnique for id lookups.

// ── READS ──

/** Get all visible team members for homepage/overview */
export async function getVisibleTeamMembers() {
  return prisma.staffProfile.findMany({
    where: { isTeamVisible: true },
    orderBy: { teamSortOrder: "asc" },
    select: {
      id: true,
      shortName: true,
      title: true,
      bio: true,
      avatar: true,
      badge: true,
      staffRole: true,
      user: { select: { name: true } },
    },
  });
}

/** Cached version for public pages — invalidated via revalidateTag("staff") in admin actions */
export const getCachedTeamMembers = unstable_cache(
  async () => {
    return prisma.staffProfile.findMany({
      where: { isTeamVisible: true },
      orderBy: { teamSortOrder: "asc" },
      select: {
        id: true,
        shortName: true,
        title: true,
        bio: true,
        avatar: true,
        badge: true,
        staffRole: true,
        user: { select: { name: true } },
      },
    });
  },
  ["team-members"],
  { revalidate: 900, tags: ["staff"] }
);

/** Get single staff profile by user ID — for public profile page */
export async function getStaffProfileById(userId: string) {
  return prisma.staffProfile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      shortName: true,
      title: true,
      bio: true,
      avatar: true,
      badge: true,
      verificationNote: true,
      staffRole: true,
      isTeamVisible: true,
      teamSortOrder: true,
      user: { select: { name: true, email: true } },
      articles: {
        where: { isPublished: true },
        select: { slug: true, title: true, category: true },
        take: 5,
      },
      curatedProducts: {
        where: { isActive: true },
        select: { slug: true, name: true },
        take: 5,
      },
    },
  });
}

/** Get all staff profiles for admin listing */
export async function getAllStaffProfiles() {
  return prisma.staffProfile.findMany({
    orderBy: { teamSortOrder: "asc" },
    select: {
      id: true,
      shortName: true,
      title: true,
      avatar: true,
      staffRole: true,
      isTeamVisible: true,
      teamSortOrder: true,
      user: { select: { name: true, email: true } },
      _count: { select: { articles: true, curatedProducts: true } },
    },
  });
}

// ── WRITES ──

/** Create staff profile — must have existing User with non-customer role */
export async function createStaffProfile(data: {
  userId: string;
  shortName: string;
  title: string;
  bio: string;
  avatar?: string | null;
  badge?: string | null;
  verificationNote?: string | null;
  staffRole: string;
  isTeamVisible?: boolean;
  teamSortOrder?: number;
}) {
  try {
    return await prisma.staffProfile.create({
      data: {
        id: data.userId,  // SHARED PK
        shortName: data.shortName,
        title: data.title,
        bio: data.bio,
        avatar: data.avatar || null,
        badge: data.badge || null,
        verificationNote: data.verificationNote || null,
        staffRole: data.staffRole,
        isTeamVisible: data.isTeamVisible ?? true,
        teamSortOrder: data.teamSortOrder ?? 0,
      },
      select: { id: true, shortName: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null; // Profile already exists
    }
    throw error;
  }
}

/** Update staff profile */
export async function updateStaffProfile(
  userId: string,
  data: Partial<{
    shortName: string;
    title: string;
    bio: string;
    avatar: string | null;
    badge: string | null;
    verificationNote: string | null;
    staffRole: string;
    isTeamVisible: boolean;
    teamSortOrder: number;
  }>
) {
  try {
    return await prisma.staffProfile.update({
      where: { id: userId },
      data,
      select: { id: true, shortName: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null; // Not found
    }
    throw error;
  }
}
