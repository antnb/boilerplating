"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import type { NavbarSettingsData } from "@/shared/lib/schemas/global-sections";
import { ROLE_IDS } from "@/shared/lib/constants/roles";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    settings?: NavbarSettingsData;
}

export function MobileMenu({ isOpen, onClose, settings }: MobileMenuProps) {
    const s = settings || ({} as NavbarSettingsData);
    const links = s.links || [];
    const loginUrl = s.loginUrl || "/login";
    const registerUrl = s.registerUrl || "/register";
    const siteName = s.siteName || "BMJ";
    const logoUrl = s.logoUrl || "";
    const { data: session } = useSession();

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-brand-bg">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <Link href="/"
                            onClick={onClose}
                            className="text-2xl font-serif font-bold text-brand-dark tracking-tight flex items-center"
                        >
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={siteName}
                                    width={120}
                                    height={40}
                                    className="object-contain h-8 w-auto"
                                />
                            ) : (
                                <>
                                    {siteName.split(" ")[0]}<span className="text-brand-accent">.</span>
                                </>
                            )}
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <span className="material-icons text-xl">close</span>
                        </button>
                    </div>

                    <nav className="flex-1 px-2" aria-label="Mobile navigation">
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 py-3 px-4 text-lg font-medium text-brand-dark hover:text-brand-accent hover:bg-brand-off-white rounded-xl transition-all"
                                    >
                                        {link.icon && (
                                            <span className="material-symbols-outlined text-[20px]">
                                                {link.icon}
                                            </span>
                                        )}
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="pt-6 border-t border-brand-dark/10 px-2 space-y-3">
                        {session?.user ? (
                            <>
                                <div className="flex items-center gap-3 px-2 mb-3">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-accent text-white font-bold text-sm">
                                        {(session.user.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                                    </span>
                                    <div>
                                        <div className="font-semibold text-brand-dark text-sm">{session.user.name}</div>
                                        <div className="text-xs text-brand-dark/50">{session.user.email}</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {session.user.roleId === ROLE_IDS.CUSTOMER ? (
                                        <Link href="/dashboard" onClick={onClose} className="flex-1">
                                            <button className="w-full px-4 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-dark/90 transition-colors">
                                                Dashboard
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href="/manage" onClick={onClose} className="flex-1">
                                            <button className="w-full px-4 py-2.5 border-2 border-brand-accent text-brand-accent text-sm font-semibold rounded-full hover:bg-brand-accent/10 transition-colors">
                                                {session.user.roleId === ROLE_IDS.ADMIN ? "Admin" : "Staff"}
                                            </button>
                                        </Link>
                                    )}
                                </div>
                                <button
                                    onClick={() => { onClose(); signOut({ callbackUrl: "/" }); }}
                                    className="w-full px-4 py-2.5 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-full hover:bg-red-50 transition-colors"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link href={loginUrl} onClick={onClose} className="flex-1">
                                    <button className="w-full px-4 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-dark/90 transition-colors">
                                        Masuk
                                    </button>
                                </Link>
                                <Link href={registerUrl} onClick={onClose} className="flex-1">
                                    <button className="w-full px-4 py-2.5 border-2 border-brand-dark text-brand-dark text-sm font-semibold rounded-full hover:bg-brand-off-white transition-colors">
                                        Daftar
                                    </button>
                                </Link>
                            </div>
                        )}
                        <Link href="/checkout" onClick={onClose}>
                            <button className="w-full px-6 py-3 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-dark/90 transition-colors flex items-center justify-center gap-2">
                                <span className="material-icons text-base">
                                    shopping_bag
                                </span>
                                View Cart
                            </button>
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
