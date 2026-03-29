import type { ShippingOption, PaymentMethod } from "@/components/checkout/types";

export const SHIPPING_OPTIONS: ShippingOption[] = [
    {
        id: "regular",
        name: "Pengiriman Reguler",
        description: "JNE/J&T/SiCepat",
        estimatedDays: "3-5 hari kerja",
        price: 25000,
    },
    {
        id: "express",
        name: "Pengiriman Express",
        description: "JNE YES/SiCepat BEST",
        estimatedDays: "1-2 hari kerja",
        price: 50000,
    },
    {
        id: "same_day",
        name: "Same Day (Jabodetabek)",
        description: "Gosend/GrabExpress",
        estimatedDays: "Hari ini",
        price: 75000,
    },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: "bca",
        name: "Transfer Bank BCA",
        description: "No. Rek: 123-456-789-0 a.n. PT BMJ Indonesia",
        icon: "🏦",
        type: "bank_transfer",
    },
    {
        id: "mandiri",
        name: "Transfer Bank Mandiri",
        description: "No. Rek: 987-654-321-0 a.n. PT BMJ Indonesia",
        icon: "🏦",
        type: "bank_transfer",
    },
    {
        id: "bni",
        name: "Transfer Bank BNI",
        description: "No. Rek: 111-222-333-4 a.n. PT BMJ Indonesia",
        icon: "🏦",
        type: "bank_transfer",
    },
];

// BANK_DETAILS — shown on success page after order placement
// TODO: Ganti dengan rekening asli sebelum production
export const BANK_DETAILS: Record<string, { bank: string; number: string; holder: string }> = {
    bca: { bank: "Bank BCA", number: "123-456-789-0", holder: "PT BMJ Indonesia" },
    mandiri: { bank: "Bank Mandiri", number: "987-654-321-0", holder: "PT BMJ Indonesia" },
    bni: { bank: "Bank BNI", number: "111-222-333-4", holder: "PT BMJ Indonesia" },
};

