export default function GuaranteeBanner() {
    return (
        <>
            {/* Desktop: Cream card */}
            <div className="hidden md:flex mt-4 md:mt-8 mb-8 p-6 bg-[#FDFBF7] rounded-[24px] border border-brand-border flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-[120px] text-brand-dark">
                        verified_user
                    </span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                    <span className="text-4xl">🛡️</span>
                    <div>
                        <h3 className="text-lg font-bold font-serif text-brand-dark mb-1">
                            100% GARANSI TANAMAN HIDUP
                        </h3>
                        <p className="text-sm text-brand-dark/70">
                            Tanaman tidak sampai sehat? Gratis penggantian.{" "}
                            <span className="underline hover:text-brand-dark font-bold text-xs ml-1 cursor-pointer">
                                S&K berlaku
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile: Dark gradient card */}
            <div className="md:hidden bg-gradient-to-r from-brand-dark to-brand-dark-light rounded-[20px] p-5 text-white flex items-center justify-between shadow-[var(--shadow-soft)]">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🛡️</span>
                        <h3 className="text-base font-serif font-bold">100% Garansi</h3>
                    </div>
                    <p className="text-xs text-white/80 max-w-[200px]">
                        Ganti baru jika tanaman mati saat pengiriman (Maks 5 hari).
                    </p>
                </div>
                <span className="material-symbols-outlined text-brand-accent text-3xl opacity-80">
                    verified_user
                </span>
            </div>
        </>
    );
}
