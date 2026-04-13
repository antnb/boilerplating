"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckoutSuccess } from "@/shared/components/checkout/CheckoutSuccess";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const orderNumber = searchParams.get("order");
    const paymentMethod = searchParams.get("payment");

    // Redirect to product page if no order number (guard)
    useEffect(() => {
        if (!orderNumber) {
            router.replace("/product");
        }
    }, [orderNumber, router]);

    // Show nothing while redirecting
    if (!orderNumber) {
        return null;
    }

    return (
        <div className="container-page py-12">
            <CheckoutSuccess
                orderNumber={orderNumber}
                orderId=""
                paymentMethod={paymentMethod || undefined}
                onContinueShopping={() => router.push("/product")}
            />
        </div>
    );
}
