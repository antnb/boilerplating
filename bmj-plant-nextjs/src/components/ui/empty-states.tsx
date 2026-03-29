"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

/**
 * Reusable illustrated empty state with plant-themed SVG illustration.
 * Uses Material Symbols for the icon.
 */
export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Decorative circle with icon */}
      <div className="relative mb-6">
        {/* Organic blob background */}
        <svg viewBox="0 0 120 120" className="w-28 h-28 text-primary/10" fill="currentColor">
          <path d="M60 10 C90 10,110 30,110 60 C110 90,90 110,60 110 C30 110,10 90,10 60 C10 30,30 10,60 10Z" />
        </svg>
        {/* Floating leaf decorations */}
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-28 h-28 text-primary/20">
          <path d="M25 20 Q30 10,35 20 Q30 25,25 20Z" fill="currentColor" />
          <path d="M90 85 Q95 75,100 85 Q95 90,90 85Z" fill="currentColor" />
          <path d="M15 70 Q20 60,25 70 Q20 75,15 70Z" fill="currentColor" />
        </svg>
        {/* Main icon */}
        <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-4xl text-primary/50">
          {icon}
        </span>
      </div>

      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>

      {actionLabel && actionHref && (
        <Button asChild variant="default" size="sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="default" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/* ── Pre-built empty states ── */

export function EmptyCart({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon="shopping_bag"
      title="Keranjang Kosong"
      description="Belum ada tanaman di keranjang Anda. Yuk temukan tanaman impian!"
      actionLabel="Lihat Produk"
      actionHref="/product"
      onAction={onBrowse}
    />
  );
}

export function EmptyWishlist() {
  return (
    <EmptyState
      icon="favorite"
      title="Wishlist Kosong"
      description="Simpan tanaman favorit Anda di sini agar mudah ditemukan kembali."
      actionLabel="Jelajahi Produk"
      actionHref="/product"
    />
  );
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon="receipt_long"
      title="Belum Ada Pesanan"
      description="Anda belum pernah melakukan pemesanan. Mulai belanja sekarang!"
      actionLabel="Mulai Belanja"
      actionHref="/product"
    />
  );
}

export function EmptySearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      icon="search_off"
      title="Tidak Ditemukan"
      description={
        query
          ? `Tidak ada hasil untuk "${query}". Coba kata kunci lain atau jelajahi kategori kami.`
          : "Tidak ada produk yang cocok dengan filter Anda. Coba ubah filter."
      }
      actionLabel="Reset Filter"
      actionHref="/product"
    />
  );
}

export function EmptyArticles() {
  return (
    <EmptyState
      icon="article"
      title="Belum Ada Artikel"
      description="Konten jurnal sedang disiapkan. Nantikan artikel menarik seputar tanaman!"
    />
  );
}
