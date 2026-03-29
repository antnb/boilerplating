import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderOpen, ArrowLeft } from "lucide-react";

/**
 * Portfolio project-specific 404 page.
 * Triggered when `notFound()` is called from portfolio/[slug]/page.tsx.
 */
export default function PortfolioNotFound() {
    return (
        <div className="container-page py-20 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-3">
                    Proyek Tidak Ditemukan
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    Proyek yang Anda cari mungkin telah dipindahkan 
                    atau URL tidak valid.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link href="/portfolio">
                            <FolderOpen className="w-4 h-4 mr-2" />
                            Lihat Portfolio
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
