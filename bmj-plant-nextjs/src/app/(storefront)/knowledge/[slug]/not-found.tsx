import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

/**
 * Knowledge article-specific 404 page.
 * Triggered when `notFound()` is called from knowledge/[slug]/page.tsx.
 */
export default function KnowledgeNotFound() {
    return (
        <div className="container-page py-20 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-3">
                    Artikel Tidak Ditemukan
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    Artikel yang Anda cari mungkin telah dipindahkan 
                    atau URL tidak valid.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link href="/knowledge">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Lihat Jurnal
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Ke Beranda
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
