"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useCart } from "@/shared/hooks/useCart";
import { useCartDrawer } from "@/shared/components/cart/CartDrawerContext";
import { Eye } from "lucide-react";
import { spawnFlyingParticle } from "@/shared/lib/utils/cart-animation";
import WishlistButton from "@/shared/components/pdp/WishlistButton";

interface ProductCardProps {
  plantId: string;
  name: string;
  scientificName: string | null;
  price: number;
  slug: string;
  image: string | null;
  imageAlt: string | null;
  stock: number;
  badge?: { label: string; color: "red" | "gold" | "green" } | null;
  family?: string | null;
  usageIndoor?: boolean;
  usageOutdoor?: boolean;
  usageAirPurifier?: boolean;
  usageHanging?: boolean;
  usageTerrarium?: boolean;
  usageGift?: boolean;
  onQuickView?: () => void;
}

function formatPrice(price: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(price)}`;
}

function getUsageTag(props: Pick<ProductCardProps, "usageIndoor" | "usageOutdoor" | "usageAirPurifier" | "usageHanging" | "usageTerrarium" | "usageGift">): string | null {
  if (props.usageAirPurifier) return "Pembersih Udara";
  if (props.usageIndoor) return "Indoor";
  if (props.usageOutdoor) return "Outdoor";
  if (props.usageHanging) return "Gantung";
  if (props.usageTerrarium) return "Terrarium";
  if (props.usageGift) return "Gift";
  return null;
}

export default function ProductCard({
  plantId, name, scientificName, price, slug, image, imageAlt, stock,
  badge, family, usageIndoor, usageOutdoor, usageAirPurifier, usageHanging, usageTerrarium, usageGift,
  onQuickView,
}: ProductCardProps) {
  const isOutOfStock = stock <= 0;
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addItem } = useCart();
  const { openCart } = useCartDrawer();
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const usageTag = getUsageTag({ usageIndoor, usageOutdoor, usageAirPurifier, usageHanging, usageTerrarium, usageGift });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAdding(true);

    // Spawn flying particle from the button
    if (addBtnRef.current) {
      spawnFlyingParticle(addBtnRef.current);
    }

    await addItem(plantId, 1);
    setIsAdding(false);
    setIsSuccess(true);

    // Trigger cart badge bounce
    window.dispatchEvent(new Event("cart-item-added"));

    toast.success(`${name} ditambahkan ke keranjang!`, {
      action: { label: "Lihat", onClick: () => openCart() },
    });

    setTimeout(() => setIsSuccess(false), 900);
  };

  return (
    <article className={`product-card group bg-white rounded-3xl border border-brand-border overflow-hidden cursor-pointer flex flex-col h-full relative shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all duration-200 ${isOutOfStock ? "opacity-60" : ""}`}>
      <Link href={`/product/${slug}`} className="flex flex-col flex-1">
        <div className="relative h-[160px] sm:h-[200px] md:h-[260px] w-full bg-product-bg-light/50 shrink-0 border-b border-product-green/20">
          {image ? (
            <Image
              src={image}
              alt={imageAlt || name}
              fill
              className="object-cover p-2 rounded-[20px] lg:rounded-3xl group-hover:scale-105 transition-transform duration-300 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-dark/20 p-2">
              <div className="w-full h-full rounded-[20px] bg-brand-gray/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">eco</span>
              </div>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
              <span className="text-3xs md:text-3xs font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full border shadow-sm uppercase tracking-wider bg-brand-dark/90 backdrop-blur text-white border-white/20">Habis</span>
            </div>
          )}
          <div className="absolute inset-2 rounded-[20px] lg:rounded-3xl bg-black/0 group-hover:bg-black/5 transition-colors duration-200 pointer-events-none" />
          {/* Wishlist heart overlay — always visible on mobile, hover-reveal on desktop */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
            <WishlistButton
              plantId={plantId}
              className="!p-1.5 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
            />
          </div>
          {badge && !isOutOfStock && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
              <span className={`text-3xs md:text-2xs font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full border shadow-sm uppercase tracking-wider backdrop-blur ${badge.color === "red" ? "bg-brand-danger/90 text-white border-white/20" : badge.color === "gold" ? "bg-brand-accent/90 text-white border-white/20" : "bg-brand-dark/90 text-white border-white/20"}`}>
                {badge.label}
              </span>
            </div>
          )}
          {/* Quick View button */}
          {onQuickView && (
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onQuickView(); }}
              className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4 text-brand-dark" />
            </button>
          )}
        </div>
        <div className="p-2.5 sm:p-3 md:p-4 flex flex-col justify-between h-[100px] sm:h-[110px] md:h-[120px] flex-1">
          <div>
            <h3 className="text-sm md:text-base font-serif font-bold text-brand-dark leading-tight group-hover:text-product-green-dark transition-colors line-clamp-2">{name}</h3>
            {scientificName && (
              <p className="text-2xs md:text-xs text-brand-dark/50 italic font-serif leading-none mt-0.5 line-clamp-1">{scientificName}</p>
            )}
          </div>
          {(family || usageTag) && (
            <p className="text-2xs md:text-xs text-product-green-dark font-medium mt-1.5 leading-tight truncate">
              {family && <span className="italic">{family}</span>}
              {family && usageTag && <span className="mx-1 opacity-40">·</span>}
              {usageTag && <span>{usageTag}</span>}
            </p>
          )}
        </div>
      </Link>
      <div className="px-2.5 pb-2.5 sm:px-3 sm:pb-3">
        <button
          ref={addBtnRef}
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`w-full py-2 px-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-between whitespace-nowrap overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${isSuccess
              ? "bg-emerald-600 text-white scale-[1.02]"
              : "bg-brand-dark text-white hover:bg-brand-forest-dark"
            }`}
        >
          <span className="truncate">
            {isAdding ? "Menambahkan..." : isSuccess ? "Ditambahkan ✓" : formatPrice(price)}
          </span>
          <span className="material-symbols-outlined text-base md:text-lg shrink-0 ml-1.5">
            {isAdding ? "hourglass_empty" : isSuccess ? "check_circle" : "add_shopping_cart"}
          </span>
        </button>
      </div>
    </article>
  );
}
