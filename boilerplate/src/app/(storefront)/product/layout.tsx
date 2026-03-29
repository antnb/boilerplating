import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Katalog Tanaman Hias Premium",
    description:
        "Jelajahi koleksi tanaman hias premium. Filter berdasarkan kategori, harga, dan tingkat perawatan.",
    openGraph: {
        title: "Katalog Tanaman Hias Premium — BMJ Plant Store",
        description:
            "Koleksi Monstera, Philodendron, Alocasia, dan tanaman tropis langka.",
    },
};

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
