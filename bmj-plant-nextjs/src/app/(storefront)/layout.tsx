// Server Component — layout shell (no hooks, no state)

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { getPageContent } from "@/lib/data/page-content";
import { navbarSettingsSchema } from "@/lib/schemas/global-sections";

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const rawNavbar = await getPageContent<Record<string, any>>("navbar");
    // Parse through Zod schema — applies defaults for missing fields
    const navbarSettings = rawNavbar ? navbarSettingsSchema.parse(rawNavbar) : undefined;

    return (
        <div className="flex min-h-screen flex-col relative w-full" style={{ overflowX: 'clip' }}>
            <OrganizationJsonLd />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-brand-dark focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
            >
                Langsung ke konten utama
            </a>
            <Navbar settings={navbarSettings} />
            <main id="main-content" className="flex-1 w-full relative z-0">
                {children}
            </main>
            <Footer />
            <MobileBottomBar />
            <CartDrawer />
            <WhatsAppFAB />
        </div>
    );
}
