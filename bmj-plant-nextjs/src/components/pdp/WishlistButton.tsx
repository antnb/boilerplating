"use client";

import { useWishlist } from "@/hooks/useWishlist";
import MaterialIcon from "./MaterialIcon";
import { toast } from "sonner";

interface WishlistButtonProps {
    plantId: string;
    className?: string;
}

export default function WishlistButton({ plantId, className = "" }: WishlistButtonProps) {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(plantId);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        toggleWishlist(plantId);
        toast.success(wishlisted ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist");
    };

    return (
        <button
            onClick={handleToggle}
            className={`shrink-0 p-2.5 rounded-full transition-all ${wishlisted ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"} ${className}`}
            aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        >
            <MaterialIcon name="favorite" size={22} filled={wishlisted} />
        </button>
    );
}
