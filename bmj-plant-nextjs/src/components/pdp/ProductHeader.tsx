"use client";

import MaterialIcon from "./MaterialIcon";
import { formatRupiah } from "@/lib/utils/format";
import { useState } from "react";

interface ProductHeaderProps {
    category: string;
    name: string;
    cultivarName?: string;
    scientificName?: string;
    price: number;
    originalPrice?: number;
    stock: number;
    isToxic?: boolean;
    petSafe?: boolean;
}



export default function ProductHeader({
    category,
    name,
    cultivarName,
    scientificName,
    price,
    originalPrice,
    stock,
    isToxic,
    petSafe,
}: ProductHeaderProps) {
    const [wishlisted, setWishlisted] = useState(false);
    const inStock = stock > 0;
    const hasDiscount = originalPrice && originalPrice > price;

    return (
        <section aria-label="Informasi produk" className="space-y-0">
            {/* ── ZONE 1: Header ── */}
            <header className="pb-4">
                <span className="text-[10px] font-bold tracking-[0.25em] text-accent uppercase">{category}</span>
                <div className="flex items-start justify-between gap-3 mt-0.5">
                    <h1 className="font-serif text-3xl lg:text-[2.5rem] font-bold text-foreground leading-[1.1]" itemProp="name">
                        {name}
                        {cultivarName && <><br className="hidden sm:block" /> <span className="text-2xl italic font-normal text-foreground/60">'{cultivarName}'</span></>}
                    </h1>
                    <button
                        onClick={() => setWishlisted(!wishlisted)}
                        className={`mt-1 shrink-0 p-2.5 rounded-full transition-all ${wishlisted ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"}`}
                        aria-label={wishlisted ? "Hapus dari wishlist" : "Simpan ke wishlist"}
                        aria-pressed={wishlisted}
                    >
                        <MaterialIcon name="favorite" size={22} filled={wishlisted} />
                    </button>
                </div>
                {scientificName && (
                    <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed italic" itemProp="description">
                        {scientificName}
                    </p>
                )}
            </header>

            {/* ── ZONE 2: Price + Scarcity ── */}
            <div className="border-t border-border pt-4 pb-4" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2.5">
                        <p className="font-serif text-[1.75rem] sm:text-3xl font-bold text-foreground tracking-tight">
                            <data itemProp="price" value={price}>{formatRupiah(price)}</data>
                        </p>
                        <meta itemProp="priceCurrency" content="IDR" />
                        {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatRupiah(originalPrice)}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-plant-green-light uppercase tracking-wide">
                            <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-plant-green-light" : "bg-destructive"}`} aria-hidden="true" />
                            <link itemProp="availability" href={inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                            {inStock ? "Tersedia" : "Habis"}
                        </span>
                    </div>
                    {inStock && stock <= 10 && (
                        <span className="inline-flex items-center gap-1 bg-destructive/10 text-destructive text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0" role="status">
                            <MaterialIcon name="local_fire_department" size={12} />
                            Sisa {stock}
                        </span>
                    )}
                </div>

                {/* Alert Badges */}
                <div className="flex items-center gap-3 mt-2">
                    {isToxic && (
                        <span className="text-[11px] text-destructive inline-flex items-center gap-1 font-semibold">
                            <MaterialIcon name="warning" size={13} />
                            Beracun
                        </span>
                    )}
                    {petSafe === true && (
                        <span className="text-[11px] text-primary inline-flex items-center gap-1 font-semibold">
                            <MaterialIcon name="pets" size={13} />
                            Pet Safe
                        </span>
                    )}
                </div>

                {/* Payment methods */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-border/60">
                    <MaterialIcon name="account_balance_wallet" size={14} className="text-muted-foreground/50 shrink-0" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                            { label: "QRIS", icon: "qr_code_2" },
                            { label: "DANA", icon: "account_balance" },
                            { label: "BCA", icon: "account_balance" },
                            { label: "Mandiri", icon: "account_balance" },
                        ].map(({ label, icon }) => (
                            <span key={label} className="inline-flex items-center gap-1 bg-secondary/80 border border-border/50 px-2 py-0.5 rounded-md text-[9px] text-muted-foreground font-semibold">
                                <MaterialIcon name={icon} size={10} className="text-primary/50" />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
