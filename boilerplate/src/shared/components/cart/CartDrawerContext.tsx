"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface CartDrawerContextValue {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null);

export function CartDrawerProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <CartDrawerContext.Provider
            value={{
                isOpen,
                openCart: () => setIsOpen(true),
                closeCart: () => setIsOpen(false),
            }}
        >
            {children}
        </CartDrawerContext.Provider>
    );
}

export function useCartDrawer() {
    const ctx = useContext(CartDrawerContext);
    if (!ctx) throw new Error("useCartDrawer must be used within CartDrawerProvider");
    return ctx;
}
