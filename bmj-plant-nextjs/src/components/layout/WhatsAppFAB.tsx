"use client";

/* WhatsApp Floating Action Button — mobile only */

import { useMobileBottomBar } from "./MobileBottomBarContext";

export function WhatsAppFAB() {
    const { override } = useMobileBottomBar();

    // Hide when PDP bottom bar override is active to avoid overlap
    if (override) return null;

    return (
        <a
            href="https://wa.me/6281586664516"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-whatsapp hover:bg-whatsapp-hover text-white rounded-full flex items-center justify-center shadow-lg shadow-whatsapp/30 transition-all hover:scale-110 md:hidden"
            aria-label="Chat on WhatsApp"
        >
            <span className="material-icons text-3xl">chat</span>
        </a>
    );
}
