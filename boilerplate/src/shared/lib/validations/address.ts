import { z } from "zod";

export const addressSchema = z.object({
    label: z.string().min(1, "Label wajib diisi"),
    recipientName: z.string().min(2, "Nama penerima minimal 2 karakter"),
    phone: z.string().regex(/^08\d{8,12}$/, "Format: 08xxxxxxxxxx"),
    addressLine1: z.string().min(5, "Alamat minimal 5 karakter"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "Kota wajib diisi"),
    province: z.string().min(2, "Provinsi wajib diisi"),
    postalCode: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit"),
    isDefault: z.boolean().default(false),
});

export type AddressInput = z.input<typeof addressSchema>;
