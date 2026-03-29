"use client";

import Image from "next/image";
import type { ArticleExpert } from "@/shared/types/article";

type ArticleSidebarProps = {
    content: string;
    expert: ArticleExpert;
};

/** Parse heading tags from HTML to build auto-TOC */
function extractTOC(html: string): { id: string; label: string; level: number }[] {
    const matches = html.matchAll(/<h([23])[^>]*>(.*?)<\/h[23]>/gi);
    return Array.from(matches).map((m, i) => {
        const label = m[2].replace(/<[^>]*>/g, "");
        const id = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || `heading-${i}`;
        return { level: parseInt(m[1]), id, label };
    });
}

export default function ArticleSidebar({ content, expert }: ArticleSidebarProps) {
    const toc = extractTOC(content);

    return (
        <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
                {/* ── Table of Contents ── */}
                {toc.length > 0 && (
                    <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm">
                        <h3 className="font-serif text-lg mb-4 text-foreground font-semibold flex items-center gap-2 border-b border-border/50 pb-2">
                            <span className="material-symbols-outlined text-accent">toc</span>
                            Daftar Isi
                        </h3>
                        <nav className="flex flex-col gap-1 text-sm" aria-label="Table of contents">
                            {toc.map((item, i) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.getElementById(item.id);
                                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                    className={`group flex items-center gap-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all ${item.level === 3 ? "pl-6" : "px-3"}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full transition-transform ${i === 0 ? "bg-accent group-hover:scale-125" : "bg-border group-hover:bg-foreground"}`} />
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}

                {/* ── Expert Verification Card ── */}
                <div className="bg-primary text-primary-foreground rounded-2xl p-6 border border-primary shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary-foreground/20 p-0.5">
                            <Image src={expert.avatar} alt={expert.shortName} width={48} height={48} className="rounded-full object-cover" />
                        </div>
                        <div>
                            <p className="text-2xs font-bold uppercase tracking-widest text-accent">Diverifikasi Oleh</p>
                            <p className="font-serif text-lg leading-tight">{expert.shortName}</p>
                        </div>
                    </div>
                    <div className="text-xs text-primary-foreground/70 bg-primary-foreground/5 p-3 rounded-lg border border-primary-foreground/10 mb-4">
                        <span className="material-symbols-outlined text-sm align-middle mr-1">verified_user</span>
                        {expert.verificationNote}
                    </div>
                    <button className="w-full py-2 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 transition-colors">
                        Tanya Ahli
                    </button>
                </div>

                {/* ── Newsletter ── */}
                <div className="bg-muted rounded-2xl p-6 border border-border/50 text-center">
                    <span className="material-symbols-outlined text-3xl text-foreground mb-2">mail</span>
                    <h4 className="font-serif text-lg text-foreground mb-2">Jurnal Mingguan</h4>
                    <p className="text-xs text-muted-foreground mb-4">Tips perawatan tanaman langka langsung ke inbox Anda.</p>
                    <input type="email" placeholder="Email Anda" className="w-full text-xs p-3 rounded-lg border-none bg-background mb-2 focus:ring-1 focus:ring-accent" />
                    <button className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors">
                        Langganan
                    </button>
                </div>
            </div>
        </aside>
    );
}
