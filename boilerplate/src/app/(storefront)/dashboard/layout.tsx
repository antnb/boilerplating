// Server Component — provides SEO metadata for buyer dashboard
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Pantau pesanan, kelola wishlist, dan lihat riwayat belanja Anda.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
