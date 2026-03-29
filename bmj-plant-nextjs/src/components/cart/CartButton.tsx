"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartDrawer } from "./CartDrawerContext";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

interface CartButtonProps {
    className?: string;
    variant?: "default" | "ghost" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
    showCount?: boolean;
}

export function CartButton({
    className,
    variant = "ghost",
    size = "icon",
    showCount = true,
}: CartButtonProps) {
    const { openCart } = useCartDrawer();
    const { itemCount } = useCart();
    const [bouncing, setBouncing] = useState(false);

    useEffect(() => {
        const onAdded = () => {
            setBouncing(true);
            setTimeout(() => setBouncing(false), 500);
        };
        window.addEventListener("cart-item-added", onAdded);
        return () => window.removeEventListener("cart-item-added", onAdded);
    }, []);

    return (
        <Button
            variant={variant}
            size={size}
            className={cn("relative transition-transform", bouncing && "animate-bounce", className)}
            onClick={openCart}
            aria-label="Open cart"
        >
            <ShoppingCart className="w-5 h-5" />
            {showCount && itemCount > 0 && (
                <span
                    className={cn(
                        "absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium transition-transform",
                        bouncing && "animate-scale-in"
                    )}
                >
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            )}
        </Button>
    );
}
