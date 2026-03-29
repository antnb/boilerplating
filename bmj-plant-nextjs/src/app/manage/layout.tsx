// Server Component — provides SEO metadata for admin panel
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "Panel administrasi BMJ Plant Store — kelola produk, pesanan, dan pelanggan.",
};

export default function ManageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
