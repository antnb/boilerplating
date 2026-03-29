"use client";

import { SessionProvider } from "next-auth/react";
import { CartDrawerProvider } from "@/components/cart/CartDrawerContext";
import { MobileBottomBarProvider } from "@/components/layout/MobileBottomBarContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartDrawerProvider>
                <MobileBottomBarProvider>
                    {children}
                </MobileBottomBarProvider>
            </CartDrawerProvider>
        </SessionProvider>
    );
}
