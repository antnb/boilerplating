"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Package, ShoppingCart, Trash2 } from "lucide-react";
import { getWishlist, removeFromWishlist } from "@/shared/lib/actions/wishlist-actions";
import { addToCart } from "@/shared/lib/actions/cart-actions";
import { toast } from "sonner";
import { formatPrice } from "@/shared/lib/utils/format";
import { EmptyWishlist } from "@/shared/components/ui/empty-states";
import { WishlistCardSkeleton } from "@/shared/components/ui/skeletons";

interface WishlistItemData {
    id: string;
    plantId: string;
    plant: {
        id: string; slug: string; name: string; scientificName: string | null;
        price: number; stock: number; stockStatus: string | null;
        images: { src: string }[]; plantType: { name: string } | null;
    };
}

export function WishlistSection() {
    const [wishlist, setWishlist] = useState<WishlistItemData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getWishlist().then((data) => { setWishlist(data as unknown as WishlistItemData[]); setIsLoading(false); });
    }, []);

    const handleRemove = async (plantId: string) => {
        await removeFromWishlist(plantId);
        setWishlist((prev) => prev.filter((item) => item.plantId !== plantId));
        toast.success("Dihapus dari wishlist");
    };

    const handleAddToCart = async (plantId: string) => {
        const result = await addToCart(plantId);
        if (result.error) { toast.error(result.error); } else { toast.success("Ditambahkan ke keranjang"); }
    };

    if (isLoading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <WishlistCardSkeleton key={i} />)}
        </div>
    );

    if (wishlist.length === 0) return <EmptyWishlist />;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => {
                const imageUrl = item.plant?.images?.[0]?.src;
                return (
                    <Card key={item.id} className="overflow-hidden group">
                        <Link href={`/product/${item.plant?.slug || item.plantId}`}>
                            <div className="aspect-square relative overflow-hidden bg-muted">
                                {imageUrl ? <Image src={imageUrl} alt={item.plant.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-muted-foreground/50" /></div>}
                            </div>
                        </Link>
                        <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">{item.plant?.plantType?.name || "Tanaman"}</p>
                            <Link href={`/product/${item.plant?.slug || item.plantId}`} className="font-medium text-sm hover:text-primary line-clamp-2 block mb-2">{item.plant?.name}</Link>
                            {item.plant?.price > 0 && <p className="font-semibold text-foreground mb-3"><span className="text-xs font-normal text-muted-foreground">IDR </span>{formatPrice(item.plant.price)}</p>}
                            <div className="flex gap-2">
                                <Button size="sm" className="flex-1 gap-1.5" onClick={() => handleAddToCart(item.plantId)}><ShoppingCart className="w-3.5 h-3.5" />Keranjang</Button>
                                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleRemove(item.plantId)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
