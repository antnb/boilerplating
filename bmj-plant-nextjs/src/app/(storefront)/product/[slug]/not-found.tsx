import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";

/**
 * Product-specific 404 page.
 * Triggered when `notFound()` is called from product/[slug]/page.tsx
 * (i.e., slug doesn't match any product in catalog).
 *
 * Unlike the root not-found.tsx, this provides product-specific context
 * and directs users to the product catalog instead of the homepage.
 */
export default function ProductNotFound() {
    return (
        <div className="container-page py-20 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-3">
                    Produk Tidak Ditemukan
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    Produk yang Anda cari mungkin sudah tidak tersedia, 
                    terjual habis, atau URL tidak valid.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link href="/product">
                            <Search className="w-4 h-4 mr-2" />
                            Jelajahi Katalog
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Ke Beranda
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
