"use client";



import { CartButton } from "@/shared/components/cart/CartButton";

/* ═══════════════════════════════════════════════════════════
   MobileNavbar — SINGLE SOURCE OF TRUTH for mobile navigation

   Renders below lg breakpoint (lg:hidden).
   Desktop navbar is FINAL and untouched.

   Structure:
   ┌──────────────────────────────────────────────────┐
   │  (logo from parent Navbar)   [🔍] [🛒 n] [☰]    │
   └──────────────────────────────────────────────────┘

   Styling modes:
   - Homepage: glass buttons via .navbar--hero-overlay (CSS)
   - Other pages: solid dark buttons (CSS default)
   ═══════════════════════════════════════════════════════════ */

interface MobileNavbarProps {
    onMenuOpen: () => void;
    onSearchOpen?: () => void;
}

export function MobileNavbar({ onMenuOpen, onSearchOpen }: MobileNavbarProps) {
    return (
        <div className="mobile-navbar-actions lg:hidden">
            {/* Search */}
            <button
                className="mobile-navbar__btn"
                onClick={onSearchOpen}
                aria-label="Search"
            >
                <span className="material-icons text-lg">search</span>
            </button>

            {/* Cart — real count from useCart, opens CartDrawer */}
            <CartButton
                className="mobile-navbar__btn mobile-navbar__cart-phone-hide"
                variant="ghost"
                size="icon"
            />

            {/* Hamburger */}
            <button
                className="mobile-navbar__btn mobile-navbar__hamburger"
                onClick={onMenuOpen}
                aria-label="Open menu"
            >
                <span /><span /><span />
            </button>
        </div>
    );
}
