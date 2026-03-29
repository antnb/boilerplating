import 'server-only';
import { prisma } from "@/shared/lib/prisma";

// ══════════════════════════════════════
// Address Data Access Layer
// ══════════════════════════════════════
// Rule #5: $transaction for setDefaultAddress (unset others + set one).

// ── READS ──

/** Get all addresses for a user, default first */
export async function getAddressesByUser(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, label: true, recipientName: true, phone: true,
      streetAddress: true, district: true, city: true,
      province: true, postalCode: true, isDefault: true,
    },
  });
}

// ── WRITES ──

/** Create a new address — optionally set as default */
export async function createAddressInDb(userId: string, data: {
  label: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  district?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}) {
  if (data.isDefault) {
    return prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      return tx.address.create({
        data: { ...data, userId },
        select: { id: true },
      });
    });
  }
  return prisma.address.create({
    data: { ...data, userId },
    select: { id: true },
  });
}

/** Update an existing address */
export async function updateAddressInDb(
  addressId: string,
  userId: string,
  data: {
    label?: string;
    recipientName?: string;
    phone?: string;
    streetAddress?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    isDefault?: boolean;
  }
) {
  return prisma.address.update({
    where: { id: addressId, userId },
    data,
    select: { id: true },
  });
}

/** Delete an address */
export async function deleteAddressInDb(addressId: string, userId: string) {
  return prisma.address.delete({
    where: { id: addressId, userId },
  });
}

/** Set a specific address as default — transaction to unset others */
export async function setDefaultAddressInDb(addressId: string, userId: string) {
  return prisma.$transaction([
    prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId, userId },
      data: { isDefault: true },
    }),
  ]);
}
