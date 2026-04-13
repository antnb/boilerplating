"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/shared/hooks/useWishlist";
import { cn } from "@/shared/lib/utils";

interface WishlistNavButtonProps {
    className?: string;
}

export function WishlistNavButton({ className }: WishlistNavButtonProps) {
    const { count } = useWishlist();

    return (
        <Link
            href="/wishlist"
            className={cn(
                "relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-accent",
                className
            )}
            aria-label="Wishlist"
        >
            <Heart className="w-5 h-5" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </Link>
    );
}
