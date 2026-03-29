// Server Component — provides SEO metadata for checkout page
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout",
    description: "Selesaikan pembelian tanaman hias premium Anda dengan aman.",
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
