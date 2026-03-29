import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi").max(100),
    email: z.string().email("Email tidak valid").max(191),
    password: z.string().min(8, "Password minimal 8 karakter").max(72), // bcrypt max input
    phone: z
        .string()
        .regex(/^08\d{8,12}$/, "Format: 08xxxxxxxxxx")
        .optional()
        .or(z.literal("")),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi").max(100),
    phone: z
        .string()
        .regex(/^08\d{8,12}$/, "Format: 08xxxxxxxxxx")
        .optional()
        .or(z.literal("")),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter").max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
