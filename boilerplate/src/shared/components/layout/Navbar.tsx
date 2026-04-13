"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { MobileMenu } from "./MobileMenu";
import { MobileMenuGlass } from "./MobileMenuGlass";
import { MobileSearchOverlay } from "./MobileSearchOverlay";
import { MobileNavbar } from "./MobileNavbar";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { CartButton } from "@/shared/components/cart/CartButton";
import { WishlistNavButton } from "@/shared/components/wishlist/WishlistNavButton";
import { NavbarSearchDropdown } from "./NavbarSearchDropdown";
import { ROLE_IDS } from "@/shared/lib/constants/roles";
import type { NavbarSettingsData } from "@/shared/lib/schemas/global-sections";

export interface NavbarProps {
    settings?: NavbarSettingsData;
}

export function Navbar({ settings }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [heroInView, setHeroInView] = useState(true);
    const [navHidden, setNavHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    // ── Track viewport: phone (≤767px) vs tablet+ ──
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        setIsPhone(mq.matches);
        const handler = (e: MediaQueryListEvent) => {
            setIsPhone(e.matches);
            setMobileOpen(false);
            setSearchOpen(false);
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    // ── Desktop scroll shrink: compact navbar after scrolling 60px ──
    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Scroll-aware navbar: IntersectionObserver on Hero ──
    const isHomepage = pathname === "/";
    useEffect(() => {
        if (!isHomepage || !isPhone) {
            setHeroInView(true);
            return;
        }
        const hero = document.getElementById("hero");
        if (!hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => setHeroInView(entry.isIntersecting),
            { threshold: 0.05 }
        );
        observer.observe(hero);
        return () => observer.disconnect();
    }, [isHomepage, isPhone]);

    // ── Smart navbar: hide on scroll down, show on scroll up / idle ──
    useEffect(() => {
        if (!isPhone) {
            setNavHidden(false);
            return;
        }

        let lastY = window.scrollY;
        let idleTimer: ReturnType<typeof setTimeout>;

        const onScroll = () => {
            const y = window.scrollY;

            if (mobileOpen || searchOpen || heroInView) {
                setNavHidden(false);
                lastY = y;
                return;
            }

            if (y > lastY + 5) setNavHidden(true);
            if (y < lastY - 5) setNavHidden(false);

            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => setNavHidden(false), 400);

            lastY = y;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            clearTimeout(idleTimer);
        };
    }, [isPhone, heroInView, mobileOpen, searchOpen]);

    // ── Listen for bottom-bar Menu tab ──
    useEffect(() => {
        const handler = () => setMobileOpen(true);
        window.addEventListener("mobile-menu-open", handler);
        return () => window.removeEventListener("mobile-menu-open", handler);
    }, []);

    // ── Extract data from settings ──
    const s = settings || ({} as NavbarSettingsData);
    const links = s.links || [];
    const loginUrl = s.loginUrl || "/login";
    const registerUrl = s.registerUrl || "/register";
    const siteName = s.siteName || "BMJ";
    const logoUrl = s.logoUrl || "";

    // ── Navbar class logic ──
    const navbarClasses = [
        "navbar-root",
        isHomepage ? "navbar--hero-overlay" : "",
        isHomepage && isPhone && !heroInView ? "navbar--scrolled" : "",
        navHidden ? "navbar--hidden" : "",
        isScrolled && !isPhone ? "navbar--shrunk" : "",
    ].filter(Boolean).join(" ");

    return (
        <>
            <header id="global-navbar" className={navbarClasses}>
                <div className="navbar-inner">
                    {/* 1. Logo */}
                    <Link href="/"
                        className="navbar-logo"
                        aria-label={`${siteName} — Beranda`}
                    >
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={siteName}
                                width={120}
                                height={40}
                                className="navbar-logo__img"
                            />
                        ) : (
                            <>
                                <span className="material-symbols-outlined navbar-logo__icon">
                                    eco
                                </span>
                                <span className="navbar-logo__text">
                                    {siteName.split(" ")[0]}<span className="navbar-logo__dot">.</span>
                                </span>
                            </>
                        )}
                    </Link>

                    {/* 2. Main Navigation Links */}
                    <nav className="navbar-nav" aria-label="Main navigation">
                        {links.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`navbar-nav__link ${isActive ? "navbar-nav__link--active" : ""}`}
                                >
                                    {link.icon && (
                                        <span className="material-symbols-outlined navbar-nav__icon">
                                            {link.icon}
                                        </span>
                                    )}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 3. Search Bar with Autocomplete */}
                    <NavbarSearchDropdown />

                    {/* 4. Action Buttons (Desktop ≥1024px) */}
                    <div className="navbar-actions">
                        {status === "loading" ? (
                            /* Shimmer placeholder while session loads */
                            <div className="navbar-auth-skeleton" aria-hidden="true">
                                <span className="navbar-auth-skeleton__pill" />
                            </div>
                        ) : session?.user ? (
                            /* Authenticated — User dropdown */
                            <NavbarUserMenu
                                userName={session.user.name || "Akun"}
                                userEmail={session.user.email || ""}
                                isAdmin={session.user.roleId === ROLE_IDS.ADMIN}
                                isCustomer={session.user.roleId === ROLE_IDS.CUSTOMER}
                                onSignOut={() => signOut({ callbackUrl: "/" })}
                            />
                        ) : (
                            /* Unauthenticated — Login/Register buttons */
                            <>
                                <Link href={loginUrl} className="navbar-btn navbar-btn--login">
                                    Masuk
                                </Link>
                                <Link href={registerUrl} className="navbar-btn navbar-btn--register">
                                    Daftar
                                </Link>
                            </>
                        )}
                        <WishlistNavButton className="navbar-wishlist-btn" />
                        <CartButton
                            className="navbar-cart-btn"
                            variant="ghost"
                            size="icon"
                        />
                    </div>

                    {/* 5. Mobile/Tablet Actions (below 1024px) */}
                    <MobileNavbar
                        onMenuOpen={() => setMobileOpen(true)}
                        onSearchOpen={() => setSearchOpen(true)}
                    />
                </div>
            </header>

            {/* ── Fullscreen Overlays ── */}
            <MobileMenuGlass
                isOpen={mobileOpen && isPhone}
                onClose={() => setMobileOpen(false)}
                settings={settings}
            />
            <MobileMenu
                isOpen={mobileOpen && !isPhone}
                onClose={() => setMobileOpen(false)}
                settings={settings}
            />
            <MobileSearchOverlay
                isOpen={searchOpen && isPhone}
                onClose={() => setSearchOpen(false)}
            />
        </>
    );
}
