"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface NavbarUserMenuProps {
    userName: string;
    userEmail: string;
    isAdmin: boolean;
    isCustomer: boolean;
    onSignOut: () => void;
}

export function NavbarUserMenu({
    userName,
    userEmail,
    isAdmin,
    isCustomer,
    onSignOut,
}: NavbarUserMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);

    // Initials for avatar
    const initials = userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="navbar-user-menu" ref={menuRef}>
            <button
                className="navbar-user-menu__trigger"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Menu akun"
            >
                <span className="navbar-user-menu__avatar">{initials}</span>
                <span className="navbar-user-menu__name">{userName.split(" ")[0]}</span>
                <span className="material-symbols-outlined navbar-user-menu__chevron">
                    {open ? "expand_less" : "expand_more"}
                </span>
            </button>

            {open && (
                <div className="navbar-user-menu__dropdown" role="menu">
                    <div className="navbar-user-menu__header">
                        <span className="navbar-user-menu__header-name">{userName}</span>
                        <span className="navbar-user-menu__header-email">{userEmail}</span>
                    </div>
                    <div className="navbar-user-menu__divider" />

                    {/* Customer links — /dashboard is customer-only portal */}
                    {isCustomer && (
                        <>
                            <Link
                                href="/dashboard"
                                className="navbar-user-menu__item"
                                role="menuitem"
                                onClick={() => setOpen(false)}
                            >
                                <span className="material-symbols-outlined">dashboard</span>
                                Dashboard
                            </Link>
                            <Link
                                href="/account"
                                className="navbar-user-menu__item"
                                role="menuitem"
                                onClick={() => setOpen(false)}
                            >
                                <span className="material-symbols-outlined">person</span>
                                Akun Saya
                            </Link>
                            <Link
                                href="/account?tab=orders"
                                className="navbar-user-menu__item"
                                role="menuitem"
                                onClick={() => setOpen(false)}
                            >
                                <span className="material-symbols-outlined">shopping_bag</span>
                                Pesanan
                            </Link>
                        </>
                    )}

                    {/* Staff/Admin links — /manage is staff-only portal */}
                    {!isCustomer && (
                        <>
                            <Link
                                href="/manage"
                                className="navbar-user-menu__item navbar-user-menu__item--admin"
                                role="menuitem"
                                onClick={() => setOpen(false)}
                            >
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                                {isAdmin ? "Admin Panel" : "Staff Panel"}
                            </Link>
                        </>
                    )}

                    <div className="navbar-user-menu__divider" />
                    <button
                        className="navbar-user-menu__item navbar-user-menu__item--logout"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            onSignOut();
                        }}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Keluar
                    </button>
                </div>
            )}
        </div>
    );
}
