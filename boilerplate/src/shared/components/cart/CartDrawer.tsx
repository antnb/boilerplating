"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCartDrawer } from "./CartDrawerContext";
import { useCart } from "@/shared/hooks/useCart";
import { formatPrice } from "@/shared/lib/utils/format";
import { EmptyCart } from "@/shared/components/ui/empty-states";
import { CartItemSkeleton } from "@/shared/components/ui/skeletons";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
    const { isOpen, closeCart } = useCartDrawer();
    const router = useRouter();
    const { data: session } = useSession();
    const {
        items, isLoading, itemCount, subtotal,
        updateQuantity, removeItem, clearCart, isUpdating,
    } = useCart();

    const handleCheckout = () => {
        if (!session?.user) {
            closeCart();
            router.push("/login?callbackUrl=/checkout");
            return;
        }
        closeCart();
        router.push("/checkout");
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            await removeItem(itemId);
            toast.success("Produk dihapus dari keranjang");
        } else {
            await updateQuantity(itemId, newQuantity);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        await removeItem(itemId);
        toast.success("Produk dihapus dari keranjang");
    };

    const handleClearCart = async () => {
        await clearCart();
        toast.success("Keranjang dikosongkan");
    };

    const freeShippingThreshold = 2000000;
    const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    const remainingForFreeShipping = freeShippingThreshold - subtotal;

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
                <SheetHeader className="px-6 pt-6 pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Keranjang Belanja
                        {itemCount > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                {itemCount}
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex-1 space-y-4 py-4 px-6">
                        {Array.from({ length: 3 }).map((_, i) => <CartItemSkeleton key={i} />)}
                    </div>
                ) : items.length === 0 ? (
                    <EmptyCart onBrowse={closeCart} />
                ) : (
                    <>
                        {/* Free shipping progress */}
                        {subtotal > 0 && (
                            <div className="px-6 pb-3">
                                <div className="bg-muted rounded-lg p-3">
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <span className="text-muted-foreground font-medium">
                                            {remainingForFreeShipping > 0
                                                ? `Belanja IDR ${formatPrice(remainingForFreeShipping)} lagi untuk gratis ongkir!`
                                                : "🎉 Gratis ongkir!"
                                            }
                                        </span>
                                        <span className="material-symbols-outlined text-sm" style={{ color: progressPercent >= 100 ? "var(--color-brand-success)" : "var(--color-brand-text-muted)" }}>
                                            {progressPercent >= 100 ? "check_circle" : "local_shipping"}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: progressPercent >= 100 ? "var(--color-brand-success)" : "var(--color-brand-accent)" }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <Separator />

                        <ScrollArea className="flex-1">
                            <AnimatePresence mode="popLayout">
                                <div className="space-y-0 px-6">
                                    {items.map((item) => {
                                        const imageUrl = item.plant?.images?.[0]?.src;
                                        const lineTotal = (item.plant?.price || 0) * item.quantity;
                                        return (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex gap-3 py-4 border-b border-border last:border-b-0"
                                            >
                                                {/* Image */}
                                                <Link href={`/product/${item.plant?.slug || item.plantId}`}
                                                    onClick={closeCart}
                                                    className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 hover:opacity-80 transition-opacity"
                                                >
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={item.plant?.name || ""}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-8 h-8 text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/product/${item.plant?.slug || item.plantId}`}
                                                        onClick={closeCart}
                                                        className="font-medium text-sm hover:text-primary line-clamp-2 transition-colors"
                                                    >
                                                        {item.plant?.name || "Unknown Plant"}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        IDR {formatPrice(item.plant?.price || 0)} / item
                                                    </p>

                                                    {/* Quantity controls + line total */}
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-none border-r border-border"
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                disabled={isUpdating}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </Button>
                                                            <span className="w-8 text-center text-sm font-semibold tabular-nums">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-none border-l border-border"
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                disabled={
                                                                    isUpdating ||
                                                                    (item.plant?.stock !== undefined &&
                                                                        item.quantity >= (item.plant?.stock ?? Infinity))
                                                                }
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold tabular-nums">
                                                                IDR {formatPrice(lineTotal)}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                disabled={isUpdating}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </AnimatePresence>
                        </ScrollArea>

                        <Separator />

                        {/* Footer */}
                        <div className="px-6 py-4 space-y-3 bg-muted/30">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Subtotal ({itemCount} item)</span>
                                <span className="text-lg font-bold tabular-nums">IDR {formatPrice(subtotal)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ongkos kirim dihitung saat checkout
                            </p>

                            <Button
                                className="w-full h-11 font-semibold gap-2"
                                onClick={handleCheckout}
                            >
                                Lanjut ke Checkout
                                <ArrowRight className="w-4 h-4" />
                            </Button>

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-xs text-muted-foreground hover:text-destructive"
                                    onClick={handleClearCart}
                                    disabled={isUpdating}
                                >
                                    Kosongkan Keranjang
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={closeCart}
                                >
                                    Lanjut Belanja
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
