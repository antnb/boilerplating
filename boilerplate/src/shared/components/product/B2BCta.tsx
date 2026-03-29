export default function B2BCta() {
    return (
        <>
            {/* Desktop: Dark card with texture */}
            <div className="hidden md:flex mb-4 bg-brand-dark rounded-[24px] p-8 md:p-10 text-white flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 dot-grid opacity-10" />
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl group-hover:bg-brand-accent/30 transition-all duration-700" />
                <div className="relative z-10 text-center md:text-left">
                    <span className="inline-block px-3 py-1 mb-3 text-2xs font-bold tracking-widest bg-brand-accent/20 text-brand-accent border border-brand-accent/30 rounded-full uppercase">
                        B2B & Projects
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                        🏗️ Butuh untuk proyek lanskap?
                    </h2>
                    <p className="text-white/70 text-sm md:text-base max-w-xl">
                        Supply 100+ unit · Konsultasi Gratis · Harga Grosir Spesial
                    </p>
                </div>
                <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                    <a
                        href="https://wa.me/6281586664516"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto px-8 py-4 bg-white text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group/btn"
                    >
                        Chat via WhatsApp
                        <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </a>
                </div>
            </div>

            {/* Mobile: White card with gold CTA */}
            <div className="md:hidden px-4 mb-8">
                <div className="bg-white rounded-[24px] p-6 text-center border border-brand-border shadow-[var(--shadow-soft)]">
                    <h3 className="text-lg font-serif font-bold text-brand-dark mb-2">
                        Proyek Lanskap & Grosir?
                    </h3>
                    <p className="text-xs text-brand-dark/70 mb-4 px-2">
                        Dapatkan penawaran khusus untuk arsitek, desainer interior, dan
                        reseller.
                    </p>
                    <a
                        href="https://wa.me/6281586664516"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-full bg-brand-accent text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">chat</span>
                        Hubungi Tim B2B
                    </a>
                </div>
            </div>
        </>
    );
}
