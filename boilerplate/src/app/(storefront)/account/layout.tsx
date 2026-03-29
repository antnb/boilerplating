// Server Component — provides SEO metadata for account pages
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Akun Saya",
    description: "Kelola akun, alamat pengiriman, dan pengaturan profil Anda.",
};

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
