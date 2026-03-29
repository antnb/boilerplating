"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Home, Search, ArrowLeft, Leaf } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Leaf className="w-16 h-16 text-primary/40" />
          </div>
          <span className="absolute -top-2 -right-2 text-6xl font-black text-primary/20">4</span>
          <span className="absolute -bottom-2 -left-2 text-6xl font-black text-primary/20">4</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sepertinya tanaman yang Anda cari belum tumbuh di sini.
          Coba kembali ke beranda atau jelajahi koleksi kami.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ke Beranda
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/product">
              <Search className="w-4 h-4 mr-2" />
              Lihat Produk
            </Link>
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="mt-6" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke halaman sebelumnya
        </Button>
      </div>
    </div>
  );
}
