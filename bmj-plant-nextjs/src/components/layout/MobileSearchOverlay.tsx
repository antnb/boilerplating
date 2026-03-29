"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { Portal } from "@/components/ui/portal";
import { useOverlay } from "@/hooks/useOverlay";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";

import "@/mobile-search-overlay.css";

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const POPULAR_TAGS = [
    { label: "🌱 Monstera", query: "Monstera", hot: true },
    { label: "Aglonema", query: "Aglonema", hot: false },
    { label: "Philodendron", query: "Philodendron", hot: false },
    { label: "Anggrek", query: "Anggrek", hot: false },
    { label: "Alocasia", query: "Alocasia", hot: false },
    { label: "Tanaman Indoor", query: "Tanaman Indoor", hot: false },
];

export function MobileSearchOverlay({
    isOpen,
    onClose,
    className,
}: MobileSearchOverlayProps) {
    const stableClose = useCallback(() => onClose(), [onClose]);
    useOverlay(isOpen, stableClose);

    const {
        query, setQuery, suggestions, recentSearches,
        activeIndex, addRecentSearch, removeRecentSearch,
        clearRecentSearches, handleKeyDown,
    } = useSearchSuggestions();

    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when opening
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => inputRef.current?.focus(), 350);
            return () => clearTimeout(timer);
        } else {
            setQuery("");
        }
    }, [isOpen, setQuery]);

    // Handle search submit
    const handleSubmit = useCallback(
        (q: string) => {
            const trimmed = q.trim();
            if (!trimmed) return;
            addRecentSearch(trimmed);
            router.push(`/product?q=${encodeURIComponent(trimmed)}`);
            onClose();
            setQuery("");
        },
        [router, onClose, setQuery, addRecentSearch]
    );

    // Handle selecting a suggestion
    const handleSelect = useCallback(
        (label: string, slug?: string) => {
            addRecentSearch(label);
            if (slug) {
                router.push(`/product/${slug}`);
            } else {
                router.push(`/product?q=${encodeURIComponent(label)}`);
            }
            onClose();
            setQuery("");
        },
        [router, onClose, setQuery, addRecentSearch]
    );

    // Handle tag/recent click
    const handleTagClick = useCallback(
        (q: string) => {
            handleSubmit(q);
        },
        [handleSubmit]
    );

    // Handle close — clear and close
    const handleClose = useCallback(() => {
        setQuery("");
        onClose();
    }, [onClose, setQuery]);

    const hasQuery = query.trim().length > 0;

    return (
        <Portal>
        <div
            id="mobile-search-overlay"
            className={`${isOpen ? "is-open" : ""} ${className || ""}`}
            aria-hidden={!isOpen}
            {...(!isOpen ? { "data-inert": "true" } : {})}
        >
            {isOpen && (
                <div className="msearch__screen">
                    {/* Header: Input + Close */}
                    <div className="msearch__header">
                        <div className="msearch__input-wrap">
                            <span className="material-symbols-outlined msearch__input-icon">
                                search
                            </span>
                            <input
                                ref={inputRef}
                                className="msearch__input"
                                type="text"
                                placeholder="Cari produk, kategori..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && activeIndex < 0) {
                                        handleSubmit(query);
                                    } else {
                                        handleKeyDown(e, handleSelect);
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="msearch__close"
                            onClick={handleClose}
                            aria-label="Close search"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Live suggestions when typing */}
                    {hasQuery && suggestions.length > 0 && (
                        <div className="msearch__section">
                            <div className="msearch__section-title">Saran</div>
                            <div className="msearch__results">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={`${s.type}-${s.label}`}
                                        className={`msearch__result ${i === activeIndex ? "msearch__result--active" : ""}`}
                                        onClick={() => handleSelect(s.label, s.slug)}
                                    >
                                        {s.type === "product" && s.image ? (
                                            <Image
                                                src={s.image}
                                                alt={s.label}
                                                width={48}
                                                height={48}
                                                className="msearch__result-img"
                                            />
                                        ) : (
                                            <div className="msearch__result-img" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                background: "rgba(27,58,45,0.06)"
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 24, color: "rgba(27,58,45,0.3)" }}>
                                                    {s.type === "category" ? "category" : "potted_plant"}
                                                </span>
                                            </div>
                                        )}
                                        <div className="msearch__result-body">
                                            <span className="msearch__result-name">{s.label}</span>
                                            <span className="msearch__result-category">
                                                {s.type === "product" ? "Produk" : "Kategori"}
                                            </span>
                                            {s.price && (
                                                <span className="msearch__result-price">{s.price}</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                className="msearch__recent-item"
                                onClick={() => handleSubmit(query)}
                                style={{ justifyContent: "center", borderBottom: "none", marginTop: 8 }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                                <span className="msearch__recent-text">
                                    Lihat semua hasil untuk "{query}"
                                </span>
                            </button>
                        </div>
                    )}

                    {/* No results */}
                    {hasQuery && suggestions.length === 0 && (
                        <div className="msearch__section">
                            <div className="msearch__section-title">
                                Hasil untuk &ldquo;{query}&rdquo;
                            </div>
                            <div className="msearch__results">
                                <p style={{ fontSize: 14, color: "rgba(27,58,45,0.5)", textAlign: "center", padding: "20px 0" }}>
                                    Tidak ditemukan. Tekan Enter untuk cari di katalog.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Default view: Popular + Recent */}
                    {!hasQuery && (
                        <>
                            <div className="msearch__section">
                                <div className="msearch__section-title">Populer</div>
                                <div className="msearch__tags">
                                    {POPULAR_TAGS.map((tag) => (
                                        <button
                                            key={tag.query}
                                            className={`msearch__tag${tag.hot ? " msearch__tag--hot" : ""}`}
                                            onClick={() => handleTagClick(tag.query)}
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {recentSearches.length > 0 && (
                                <div className="msearch__section">
                                    <div className="msearch__section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        Pencarian Terakhir
                                        <button
                                            onClick={clearRecentSearches}
                                            style={{
                                                fontSize: 10, fontWeight: 600, color: "rgba(27,58,45,0.4)",
                                                background: "none", border: "none", cursor: "pointer",
                                                textTransform: "uppercase", letterSpacing: "0.1em"
                                            }}
                                        >
                                            Hapus Semua
                                        </button>
                                    </div>
                                    {recentSearches.map((text) => (
                                        <div key={text} className="msearch__recent-item" style={{ display: "flex" }}>
                                            <button
                                                style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}
                                                onClick={() => handleTagClick(text)}
                                            >
                                                <span className="material-symbols-outlined msearch__recent-icon">
                                                    history
                                                </span>
                                                <span className="msearch__recent-text">{text}</span>
                                            </button>
                                            <button
                                                onClick={() => removeRecentSearch(text)}
                                                style={{ background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}
                                                aria-label={`Hapus ${text}`}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(27,58,45,0.2)" }}>
                                                    close
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recentSearches.length === 0 && (
                                <div className="msearch__section">
                                    <div className="msearch__section-title">
                                        Pencarian Terakhir
                                    </div>
                                    <p style={{ fontSize: 13, color: "rgba(27,58,45,0.35)" }}>
                                        Belum ada pencarian terakhir.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
        </Portal>
    );
}
