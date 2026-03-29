import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "BMJ Plant Store — Toko Tanaman Hias Premium",
        template: "%s | BMJ Plant Store",
    },
    description:
        "Toko tanaman hias premium — koleksi Monstera, Philodendron, Alocasia, dan tanaman tropis langka.",
    metadataBase: new URL("https://bmjplantstore.com"),
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
