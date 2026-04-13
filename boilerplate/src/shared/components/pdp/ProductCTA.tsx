"use client";

import MaterialIcon from "./MaterialIcon";
import { Button } from "@/shared/components/ui/button";
import { AddToCartButton } from "@/shared/components/cart";
import { useState } from "react";

interface ProductCTAProps {
    plantId: string;
    price: number;
    stock: number;
    shippingRisk?: string;
}

export default function ProductCTA({ plantId, price: _price, stock, shippingRisk: _shippingRisk }: ProductCTAProps) {
    const [notifyMe, setNotifyMe] = useState(false);
    const inStock = stock > 0;

    return (
        <div className="border-t border-border pt-4 pb-4 space-y-2.5">
            {/* Primary CTA */}
            <AddToCartButton
                plantId={plantId}
                className="w-full h-12 text-sm font-bold gap-2.5 rounded-xl bg-primary hover:bg-primary/85 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                size="lg"
            />

            {/* Secondary row */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 h-11 text-xs font-bold gap-2 rounded-xl border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all hover:shadow-md hover:shadow-primary/15"
                    disabled={!inStock}
                >
                    <MaterialIcon name="payments" size={16} />
                    Beli Sekarang
                </Button>
                <a
                    href="https://wa.me/6281234567890?text=Halo%20BMJ,%20saya%20tertarik%20dengan%20produk%20ini"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 h-11 px-5 text-xs font-bold rounded-xl bg-accent/10 text-accent border-2 border-accent/30 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all hover:shadow-md hover:shadow-accent/15"
                >
                    <MaterialIcon name="chat" size={16} />
                    WhatsApp
                </a>
            </div>

            {/* Notify Me */}
            <div className="flex items-center justify-end pt-0.5">
                <button
                    onClick={() => setNotifyMe(!notifyMe)}
                    aria-pressed={notifyMe}
                    className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${notifyMe ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
                >
                    <MaterialIcon name="notifications" size={14} filled={notifyMe} />
                    {notifyMe ? "Notif Aktif" : "Notify Me"}
                </button>
            </div>
        </div>
    );
}
