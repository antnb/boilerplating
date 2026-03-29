"use client";

import { useEffect } from "react";
import { useMobileBottomBar } from "@/components/layout/MobileBottomBarContext";
import MaterialIcon from "./MaterialIcon";
import { Button } from "@/components/ui/button";

interface MobileBottomBarProps {
    plantId: string;
    price: number;
}

function formatShortIDR(amount: number): string {
    if (amount >= 1000000) return `IDR ${(amount / 1000000).toFixed(1)}jt`;
    if (amount >= 1000) return `IDR ${(amount / 1000).toFixed(0)}k`;
    return `IDR ${amount}`;
}

/**
 * PDP-specific mobile bottom bar that overrides the global layout bar
 * via MobileBottomBarContext. Shows price + Keranjang + Beli buttons.
 */
export default function MobileBottomBar({ plantId: _plantId, price }: MobileBottomBarProps) {
    const { setOverride, clearOverride } = useMobileBottomBar();

    useEffect(() => {
        setOverride(
            <div className="flex items-center gap-2 px-4 py-3 bg-card/95 backdrop-blur-md border-t border-border shadow-lg"
                 style={{ paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))` }}>
                <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-bold text-primary truncate">{formatShortIDR(price)}</p>
                    <p className="text-[10px] text-muted-foreground">Pengiriman aman • Garansi 7 hari</p>
                </div>
                <Button size="sm" className="gap-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold px-3">
                    <MaterialIcon name="shopping_cart" size={16} />
                    Keranjang
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 rounded-lg border-primary text-primary text-xs font-semibold px-3 hover:bg-primary hover:text-primary-foreground">
                    <MaterialIcon name="credit_card" size={16} />
                    Beli
                </Button>
            </div>
        );

        return () => clearOverride();
    }, [price, setOverride, clearOverride]);

    return null;
}
