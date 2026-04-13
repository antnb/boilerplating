"use client";

import { useEffect } from "react";

/**
 * Shared overlay behaviour:
 * 1. Locks body scroll while open
 * 2. Closes on Escape key
 *
 * Call at the TOP of every custom overlay component (before any early returns)
 * so Hooks execute in consistent order.
 */
export function useOverlay(isOpen: boolean, onClose: () => void) {
  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}
