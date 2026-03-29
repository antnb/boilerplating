import { z } from "zod";

export const createStaffProfileSchema = z.object({
  userId: z.string().min(1, "User ID wajib diisi"),
  shortName: z.string().min(1, "Nama pendek wajib diisi").max(50),
  title: z.string().min(1, "Jabatan wajib diisi").max(200),
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  avatar: z.string().max(500).nullable().optional(),
  badge: z.string().max(50).nullable().optional(),
  verificationNote: z.string().nullable().optional(),
  staffRole: z.string().min(1, "Staff role wajib diisi").max(30),
  isTeamVisible: z.boolean().default(true),
  teamSortOrder: z.number().int().min(0).default(0),
});

export const updateStaffProfileSchema = createStaffProfileSchema.partial().omit({ userId: true });

export type CreateStaffProfileInput = z.infer<typeof createStaffProfileSchema>;
export type UpdateStaffProfileInput = z.infer<typeof updateStaffProfileSchema>;
