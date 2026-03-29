"use client";



import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { useCartDrawer } from "./CartDrawerContext";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { spawnFlyingParticle } from "@/lib/utils/cart-animation";

interface AddToCartButtonProps {
    plantId: string;
    quantity?: number;
    className?: string;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    children?: React.ReactNode;
}

export function AddToCartButton({
    plantId,
    quantity = 1,
    className,
    variant = "default",
    size = "default",
    showIcon = true,
    children,
}: AddToCartButtonProps) {
    const { openCart } = useCartDrawer();
    const { addItem } = useCart();
    const [state, setState] = useState<"idle" | "adding" | "success">("idle");
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleClick = async () => {
        setState("adding");

        // Spawn flying particle
        if (btnRef.current) {
            spawnFlyingParticle(btnRef.current);
        }

        try {
            await addItem(plantId, quantity);

            setState("success");
            // Dispatch event for cart badge bounce
            window.dispatchEvent(new Event("cart-item-added"));

            toast.success("Produk ditambahkan ke keranjang");

            setTimeout(() => {
                openCart();
                setState("idle");
            }, 600);
        } catch {
            toast.error("Gagal menambahkan ke keranjang");
            setState("idle");
        }
    };

    return (
        <Button
            ref={btnRef}
            variant={variant}
            size={size}
            className={cn(
                "gap-2 transition-all duration-300",
                state === "success" && "bg-emerald-600 hover:bg-emerald-600 text-white scale-[1.03]",
                className,
            )}
            onClick={handleClick}
            disabled={state !== "idle"}
        >
            {state === "adding" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : state === "success" ? (
                <Check className="w-4 h-4 animate-scale-in" />
            ) : showIcon ? (
                <ShoppingCart className="w-4 h-4" />
            ) : null}
            {state === "success"
                ? "Ditambahkan!"
                : children || "Tambah ke Keranjang"}
        </Button>
    );
}
