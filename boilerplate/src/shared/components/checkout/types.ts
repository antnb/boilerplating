// Checkout types — extracted from source useCheckout.ts
// These will be replaced with Prisma models later

export type CheckoutStep = "cart" | "shipping" | "payment" | "success";

export interface ShippingOption {
    id: string;
    name: string;
    description: string;
    estimatedDays: string;
    price: number;
}

export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: "bank_transfer" | "e_wallet" | "credit_card" | "cod";
}

export interface CartItem {
    id: string;
    plant_id: string;
    quantity: number;
    plant?: {
        name: string;
        slug: string;
        price: number;
        image_url: string | null;
        stock: number | null;
    };
}

export interface Address {
    id: string;
    label: string;
    recipient_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
}

export interface AddressFormData {
    label: string;
    recipient_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
}
