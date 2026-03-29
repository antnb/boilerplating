"use client";

import Link from "next/link";
import Image from "next/image";
import { Portal } from "@/shared/components/ui/portal";
import { useOverlay } from "@/shared/hooks/useOverlay";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ShoppingCart, Star, ChevronRight, X } from "lucide-react";
import { useCart } from "@/shared/hooks/useCart";
import { useCartDrawer } from "@/shared/components/cart/CartDrawerContext";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import WishlistButton from "@/shared/components/pdp/WishlistButton";

interface QuickViewPlant {
  id: string;
  name: string;
  slug: string;
  scientificName: string | null;
  price: number;
  image: string | null;
  stock: number;
  description?: string;
  labels?: string[];
  rating?: number;
  reviewCount?: number;
  specs?: Record<string, string>;
}

interface QuickViewModalProps {
  plant: QuickViewPlant | null;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({ plant, open, onClose }: QuickViewModalProps) {
  const stableClose = useCallback(() => onClose(), [onClose]);
  useOverlay(open, stableClose);

  const { addItem } = useCart();
  const { openCart } = useCartDrawer();
  const [isAdding, setIsAdding] = useState(false);

  if (!open || !plant) return null;

  const handleAdd = async () => {
    setIsAdding(true);
    await addItem(plant.id, 1);
    setIsAdding(false);
    toast.success(`${plant.name} ditambahkan!`, {
      action: { label: "Lihat", onClick: () => { onClose(); openCart(); } },
    });
  };

  return (
    <Portal>
      <div className="fixed top-0 left-0 w-screen z-[100] flex items-center justify-center p-4" style={{ height: '100dvh' }} role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Modal */}
        <div className="relative w-full max-w-2xl max-h-[90dvh] bg-background rounded-xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square bg-muted relative overflow-hidden">
              {plant.image ? (
                <Image
                  src={plant.image}
                  alt={plant.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-muted-foreground/30">eco</span>
                </div>
              )}
              {plant.labels && plant.labels.length > 0 && (
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {plant.labels.slice(0, 3).map((l) => (
                    <Badge key={l} variant="secondary" className="text-xs bg-background/90 backdrop-blur">
                      {l}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col bg-background">
              <div className="flex-1">
                {plant.scientificName && (
                  <p className="text-xs text-muted-foreground italic mb-1">{plant.scientificName}</p>
                )}
                <h2 className="font-serif text-xl font-bold mb-2 text-foreground">{plant.name}</h2>

                {plant.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{plant.rating}</span>
                    {plant.reviewCount && (
                      <span className="text-xs text-muted-foreground">({plant.reviewCount} ulasan)</span>
                    )}
                  </div>
                )}

                <p className="text-2xl font-bold text-primary mb-4">
                  Rp {new Intl.NumberFormat("id-ID").format(plant.price)}
                </p>

                {plant.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {plant.description}
                  </p>
                )}

                {plant.specs && (
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    {Object.entries(plant.specs).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground capitalize">{k}</span>
                        <p className="font-medium truncate">{v}</p>
                      </div>
                    ))}
                  </div>
                )}

                <p className={`text-xs font-medium ${plant.stock > 0 ? "text-emerald-600" : "text-destructive"}`}>
                  {plant.stock > 0 ? `Stok: ${plant.stock} tersedia` : "Stok habis"}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t mt-4">
                <Button className="w-full" size="lg" disabled={plant.stock <= 0 || isAdding} onClick={handleAdd}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isAdding ? "Menambahkan..." : "Tambah ke Keranjang"}
                </Button>
                <div className="flex gap-2">
                  <WishlistButton plantId={plant.id} className="flex-1 !rounded-md border border-input bg-background hover:bg-accent" />
                  <Button variant="outline" size="sm" className="flex-1" asChild onClick={onClose}>
                    <Link href={`/product/${plant.slug}`}>
                      Detail <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
