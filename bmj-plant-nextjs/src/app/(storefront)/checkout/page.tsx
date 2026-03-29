// Server Component — wraps client CheckoutContent in Suspense boundary
import { Suspense } from "react";
import CheckoutContent from "@/components/checkout/CheckoutContent";

export default function Page() {
    return (
        <Suspense>
            <CheckoutContent />
        </Suspense>
    );
}
