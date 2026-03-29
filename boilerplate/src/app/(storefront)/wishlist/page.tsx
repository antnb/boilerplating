// Server Component — wraps client WishlistContent in Suspense boundary
import type { Metadata } from "next";
import { Suspense } from "react";
import WishlistContent from "@/shared/components/wishlist/WishlistContent";
import { BreadcrumbJsonLd } from "@/shared/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
    title: "Wishlist Saya",
    description: "Daftar tanaman hias favorit Anda di BMJ Plant Store.",
    alternates: { canonical: "/wishlist" },
    openGraph: {
        title: "Wishlist Saya | BMJ Plant Store",
        description: "Daftar tanaman hias favorit Anda.",
        url: "/wishlist",
    },
};

export default function WishlistPage() {
    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Beranda", url: "https://bmjplantstore.com" },
                { name: "Wishlist", url: "https://bmjplantstore.com/wishlist" },
            ]} />
            <div className="container-page py-8">
                <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6">Wishlist Saya</h1>
                <Suspense>
                    <WishlistContent />
                </Suspense>
            </div>
        </>
    );
}
