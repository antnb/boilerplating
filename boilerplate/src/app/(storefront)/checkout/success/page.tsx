import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessPage from "@/shared/components/checkout/CheckoutSuccessPage";

export const metadata: Metadata = {
    title: "Pesanan Berhasil",
    description: "Pesanan Anda berhasil dibuat di BMJ Plant Store.",
    robots: { index: false }, // Don't index confirmation pages
};

export default function Page() {
    return (
        <Suspense>
            <CheckoutSuccessPage />
        </Suspense>
    );
}
