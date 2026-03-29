import Link from "next/link";
import Image from "next/image";
import type { ArticleExpert } from "@/types/article";

type MobileArticleFooterProps = {
    expert: ArticleExpert;
};

export default function MobileArticleFooter({ expert }: MobileArticleFooterProps) {
    return (
        <section className="lg:hidden mt-6 mb-8 flex flex-col gap-4">
            {/* Expert card */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-4 mb-3 relative z-10">
                    <Image
                        src={expert.avatar}
                        alt={expert.shortName}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-accent object-cover"
                    />
                    <div>
                        <p className="text-[8px] uppercase tracking-widest text-accent font-bold">Diverifikasi Oleh</p>
                        <p className="font-serif text-lg italic leading-tight">{expert.shortName}</p>
                        <p className="text-[10px] text-primary-foreground/60">{expert.title}</p>
                    </div>
                </div>
                <div className="text-xs text-primary-foreground/70 bg-primary-foreground/5 p-3 rounded-lg border border-primary-foreground/10 relative z-10">
                    <span className="material-symbols-outlined text-sm align-middle mr-1">verified_user</span>
                    {expert.verificationNote}
                </div>
            </div>

            {/* CTA buttons */}
            <Link href="/products"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-4 px-6 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm"
            >
                Buka Katalog Terkait
                <span className="material-symbols-outlined">arrow_forward</span>
            </Link>

            {/* Editorial note */}
            <div className="pt-4 border-t border-border/10 text-center">
                <div className="flex justify-center gap-1 mb-2">
                    <span className="material-symbols-outlined text-muted-foreground text-sm">local_library</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Editorial Board Approved</span>
                </div>
                <p className="text-[10px] text-muted-foreground/50 max-w-[280px] mx-auto leading-relaxed">
                    Konten diverifikasi oleh BMJ Horticultural Dept.
                    <br />© 2024 PT Bumi Mekarsari Jaya.
                </p>
            </div>
        </section>
    );
}
