"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";

interface NavbarSearchDropdownProps {
  className?: string;
}

export function NavbarSearchDropdown({ className }: NavbarSearchDropdownProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    query, setQuery, suggestions, recentSearches,
    activeIndex, addRecentSearch, handleKeyDown,
  } = useSearchSuggestions();

  const handleSubmit = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      addRecentSearch(trimmed);
      router.push(`/product?q=${encodeURIComponent(trimmed)}`);
      setQuery("");
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [router, setQuery, addRecentSearch]
  );

  const handleSelect = useCallback(
    (label: string, slug?: string) => {
      addRecentSearch(label);
      if (slug) {
        router.push(`/product/${slug}`);
      } else {
        router.push(`/product?q=${encodeURIComponent(label)}`);
      }
      setQuery("");
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [router, setQuery, addRecentSearch]
  );

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = isFocused && (query.trim().length > 0 || recentSearches.length > 0);

  return (
    <div ref={containerRef} className={`navbar-search ${className || ""}`} style={{ position: "relative" }}>
      <label htmlFor="navbar-search-input" className="sr-only">Cari produk</label>
      <span className="material-icons navbar-search__icon">search</span>
      <input
        ref={inputRef}
        id="navbar-search-input"
        type="text"
        placeholder="Cari produk, kategori, dan lainnya"
        className="navbar-search__input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && activeIndex < 0) {
            handleSubmit(query);
          } else if (e.key === "Escape") {
            setIsFocused(false);
            inputRef.current?.blur();
          } else {
            handleKeyDown(e, handleSelect);
          }
        }}
      />

      {/* Dropdown */}
      {showDropdown && (
        <div className="navbar-search-dropdown">
          {/* Live suggestions */}
          {query.trim().length > 0 && suggestions.length > 0 && (
            <div className="nsd__section">
              {suggestions.map((s, i) => (
                <button
                  key={`${s.type}-${s.label}`}
                  className={`nsd__item ${i === activeIndex ? "nsd__item--active" : ""}`}
                  onClick={() => handleSelect(s.label, s.slug)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {s.image ? (
                    <Image src={s.image} alt="" className="nsd__item-img" width={40} height={40} />
                  ) : (
                    <div className="nsd__item-icon">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {s.type === "category" ? "category" : "potted_plant"}
                      </span>
                    </div>
                  )}
                  <div className="nsd__item-body">
                    <span className="nsd__item-name">{s.label}</span>
                    {s.price && <span className="nsd__item-price">{s.price}</span>}
                  </div>
                  <span className="material-symbols-outlined nsd__item-arrow">north_west</span>
                </button>
              ))}
              <button
                className="nsd__view-all"
                onClick={() => handleSubmit(query)}
                onMouseDown={(e) => e.preventDefault()}
              >
                Lihat semua hasil untuk "{query}" →
              </button>
            </div>
          )}

          {/* No results */}
          {query.trim().length > 0 && suggestions.length === 0 && (
            <div className="nsd__section">
              <p className="nsd__empty">Tidak ada saran. Tekan Enter untuk mencari.</p>
            </div>
          )}

          {/* Recent searches (when no query) */}
          {query.trim().length === 0 && recentSearches.length > 0 && (
            <div className="nsd__section">
              <div className="nsd__section-title">Pencarian Terakhir</div>
              {recentSearches.slice(0, 3).map((text) => (
                <button
                  key={text}
                  className="nsd__item"
                  onClick={() => handleSelect(text)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="nsd__item-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>history</span>
                  </div>
                  <div className="nsd__item-body">
                    <span className="nsd__item-name">{text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
