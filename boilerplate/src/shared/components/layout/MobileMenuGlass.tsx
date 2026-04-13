"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { Portal } from "@/shared/components/ui/portal";
import { useOverlay } from "@/shared/hooks/useOverlay";
import type { NavbarSettingsData } from "@/shared/lib/schemas/global-sections";
import { useCartDrawer } from "@/shared/components/cart/CartDrawerContext";
import { ROLE_IDS } from "@/shared/lib/constants/roles";

import "@/shared/mobile-menu-glass.css";

interface MobileMenuGlassProps {
    isOpen: boolean;
    onClose: () => void;
    settings?: NavbarSettingsData;
    className?: string;
}

/* Icon color mapping — matches prototype grid */
const ICON_COLORS: Record<string, string> = {
    inventory_2: "mmenu__grid-icon--green",
    cases: "mmenu__grid-icon--amber",
    build: "mmenu__grid-icon--blue",
    history_edu: "mmenu__grid-icon--purple",
    info: "mmenu__grid-icon--teal",
    shopping_bag: "mmenu__grid-icon--dark",
    eco: "mmenu__grid-icon--green",
    storefront: "mmenu__grid-icon--green",
    local_florist: "mmenu__grid-icon--green",
};

export function MobileMenuGlass({
    isOpen,
    onClose,
    settings,
    className,
}: MobileMenuGlassProps) {
    const stableClose = useCallback(() => onClose(), [onClose]);
    useOverlay(isOpen, stableClose);

    const { openCart } = useCartDrawer();
    const { data: session } = useSession();
    const s = settings || ({} as NavbarSettingsData);
    const links = s.links || [];
    const loginUrl = s.loginUrl || "/login";
    const registerUrl = s.registerUrl || "/register";

    // Take first 5 links for grid + always add Cart as 6th
    const gridLinks = links.slice(0, 5);

    return (
        <Portal>
        <div
            id="mobile-menu-glass"
            className={`${isOpen ? "is-open" : ""} ${className || ""}`}
            aria-hidden={!isOpen}
            {...(!isOpen ? { "data-inert": "true" } : {})}
        >
            {/* Content only mounts when open — prevents SEO crawlers
                from indexing duplicate navigation links */}
            {isOpen && (
                <>
                    {/* Background image — shared with hero */}
                    <div className="mmenu__bg">
                        <Image
                            src="/images/homepage/hero-greenhouse.jpg"
                            alt="Botanical background"
                            fill
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                    </div>

                    {/* Frosted glass screen */}
                    <div className="mmenu__screen">
                        {/* Header */}
                        <div className="mmenu__header">
                            <div>
                                <div className="mmenu__header-label">Menu Utama</div>
                                <h2 className="mmenu__header-title">Jelajahi</h2>
                            </div>
                            <button
                                className="mmenu__close"
                                onClick={onClose}
                                aria-label="Close menu"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mmenu__search">
                            <span className="material-symbols-outlined mmenu__search-icon">
                                search
                            </span>
                            <input
                                className="mmenu__search-input"
                                type="text"
                                placeholder="Cari produk, kategori, dan lainnya"
                            />
                        </div>

                        {/* Navigation Grid */}
                        <div className="mmenu__grid">
                            {gridLinks.map((link) => {
                                const iconColor =
                                    ICON_COLORS[link.icon || ""] || "mmenu__grid-icon--green";
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="mmenu__grid-item"
                                        onClick={onClose}
                                    >
                                        <div className={`mmenu__grid-icon ${iconColor}`}>
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 26 }}
                                            >
                                                {link.icon || "link"}
                                            </span>
                                        </div>
                                        <span className="mmenu__grid-label">{link.label}</span>
                                    </Link>
                                );
                            })}
                            {/* Always include Cart — opens drawer instead of navigating */}
                            <button
                                className="mmenu__grid-item"
                                onClick={() => { onClose(); openCart(); }}
                            >
                                <div className="mmenu__grid-icon mmenu__grid-icon--dark">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 26 }}
                                    >
                                        shopping_bag
                                    </span>
                                </div>
                                <span className="mmenu__grid-label">Keranjang</span>
                            </button>
                        </div>

                        {/* Footer: Auth + Social */}
                        <div className="mmenu__footer">
                            <div className="mmenu__auth">
                                {session?.user ? (
                                    <>
                                        <div className="mmenu__user-info">
                                            <span className="mmenu__user-avatar">
                                                {(session.user.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                                            </span>
                                            <div>
                                                <div className="mmenu__user-name">{session.user.name}</div>
                                                <div className="mmenu__user-email">{session.user.email}</div>
                                            </div>
                                        </div>
                                        <div className="mmenu__user-actions">
                                            {session.user.roleId === ROLE_IDS.CUSTOMER ? (
                                                <Link href="/dashboard" className="mmenu__auth-btn mmenu__auth-btn--login" onClick={onClose}>
                                                    Dashboard
                                                </Link>
                                            ) : (
                                                <Link href="/manage" className="mmenu__auth-btn mmenu__auth-btn--register" onClick={onClose}>
                                                    {session.user.roleId === ROLE_IDS.ADMIN ? "Admin" : "Staff"}
                                                </Link>
                                            )}
                                            <button
                                                className="mmenu__auth-btn mmenu__auth-btn--logout"
                                                onClick={() => { onClose(); signOut({ callbackUrl: "/" }); }}
                                            >
                                                Keluar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link href={loginUrl}
                                            className="mmenu__auth-btn mmenu__auth-btn--login"
                                            onClick={onClose}
                                        >
                                            Masuk
                                        </Link>
                                        <Link href={registerUrl}
                                            className="mmenu__auth-btn mmenu__auth-btn--register"
                                            onClick={onClose}
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="mmenu__social">
                                <a href="#" aria-label="Website">
                                    <span className="material-symbols-outlined">public</span>
                                </a>
                                <a
                                    href="https://instagram.com/bmjplantstore"
                                    aria-label="Instagram"
                                >
                                    <span className="material-symbols-outlined">
                                        photo_camera
                                    </span>
                                </a>
                                <a
                                    href="mailto:bumimekarsarijaya@gmail.com"
                                    aria-label="Email"
                                >
                                    <span className="material-symbols-outlined">
                                        alternate_email
                                    </span>
                                </a>
                            </div>
                            <p className="mmenu__version">PT BUMI MEKARSARI JAYA</p>
                        </div>
                    </div>
                </>
            )}
        </div>
        </Portal>
    );
}
