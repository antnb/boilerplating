"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";
import { useMobileBottomBar } from "./MobileBottomBarContext";

const TABS = [
    { id: "home", label: "Beranda", icon: "home", href: "/" },
    { id: "products", label: "Produk", icon: "storefront", href: "/product" },
    { id: "cart", label: "Keranjang", icon: "shopping_bag", href: null },
    { id: "chat", label: "Chat", icon: "chat", href: null },
    { id: "menu", label: "Menu", icon: "menu", href: null },
] as const;

export function MobileBottomBar() {
    const pathname = usePathname();
    const { itemCount } = useCart();
    const { openCart } = useCartDrawer();
    const { override } = useMobileBottomBar();

    const handleTabClick = (tabId: string) => {
        if (tabId === "cart") {
            openCart();
        } else if (tabId === "chat") {
            window.open("https://wa.me/6281586664516", "_blank", "noopener,noreferrer");
        } else if (tabId === "menu") {
            // Dispatch custom event — Navbar.tsx listens for this
            window.dispatchEvent(new CustomEvent("mobile-menu-open"));
        }
    };

    const isActive = (tab: typeof TABS[number]) => {
        if (!tab.href) return false;
        if (tab.href === "/") return pathname === "/";
        return pathname?.startsWith(tab.href);
    };

    return (
        <nav
            id="mobile-bottom-bar"
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            aria-label="Mobile navigation"
        >
            {override ? (
                <div className="mobile-bottom-bar__override">{override}</div>
            ) : (
                <div className="mobile-bottom-bar__tabs">
                    {TABS.map((tab) => {
                        const active = isActive(tab);
                        if (tab.href) {
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`mobile-bottom-bar__tab ${active ? "mobile-bottom-bar__tab--active" : ""}`}
                                >
                                    <span className="material-symbols-outlined mobile-bottom-bar__icon">
                                        {tab.icon}
                                    </span>
                                    <span className="mobile-bottom-bar__label">{tab.label}</span>
                                </Link>
                            );
                        }
                        return (
                            <button
                                key={tab.id}
                                className="mobile-bottom-bar__tab"
                                onClick={() => handleTabClick(tab.id)}
                            >
                                {tab.id === "cart" && itemCount > 0 && (
                                    <span className="mobile-bottom-bar__badge">
                                        {itemCount > 99 ? "99+" : itemCount}
                                    </span>
                                )}
                                <span className="material-symbols-outlined mobile-bottom-bar__icon">
                                    {tab.icon}
                                </span>
                                <span className="mobile-bottom-bar__label">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
