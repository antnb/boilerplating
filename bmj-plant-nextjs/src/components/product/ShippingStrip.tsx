const DESKTOP_STEPS = [
    { emoji: "🌿", title: "Dipilih", description: "Langsung dari nurseri, dipilih oleh ahli." },
    { emoji: "📦", title: "Dikemas", description: "Standar perlindungan bungkus ganda." },
    { emoji: "🚛", title: "Dikirim", description: "Pengiriman kilat 1-3 hari area Jawa." },
    { emoji: "✅", title: "Sampai", description: "Garansi tiba sehat dalam 24 jam." },
];

const MOBILE_STEPS = [
    { icon: "check_circle", title: "1. Seleksi", description: "Sortir ketat QC" },
    { icon: "science", title: "2. Treatmen", description: "Vitamin B1 & Fungisida" },
    { icon: "inventory_2", title: "3. Packing", description: "4-Layer Protection" },
    { icon: "local_shipping", title: "4. Kirim", description: "Ekspedisi Kilat" },
];

export default function ShippingStrip() {
    return (
        <div className="mt-6 md:mt-8 mb-4 border-t border-brand-border/10 pt-6 md:pt-10">
            {/* Desktop heading */}
            <div className="hidden md:flex mb-6 flex-row items-center justify-between gap-4">
                <h3 className="text-xl font-serif font-bold text-brand-dark">
                    Pengiriman Tanaman Hidup — Dari Cipanas
                </h3>
                <div className="w-auto h-[1px] bg-brand-border/20 flex-grow ml-4" />
            </div>

            {/* Mobile heading */}
            <h3 className="md:hidden text-xs font-bold uppercase tracking-widest text-brand-dark/60 ml-1 mb-3">
                Proses Logistik
            </h3>

            {/* Desktop: 4-col grid with emoji */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DESKTOP_STEPS.map((step) => (
                    <div
                        key={step.title}
                        className="bg-white rounded-[16px] border border-brand-border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-xl flex-shrink-0">
                            {step.emoji}
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                                {step.title}
                            </h4>
                            <p className="text-xs text-brand-dark/60 leading-tight">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile: horizontal scroll with material icons */}
            <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide pb-2">
                {MOBILE_STEPS.map((step) => (
                    <div
                        key={step.title}
                        className="min-w-[140px] bg-white rounded-[16px] p-4 border border-brand-border/10 flex flex-col items-center text-center gap-2 shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-dark">
                            <span className="material-symbols-outlined text-xl">
                                {step.icon}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-brand-dark">
                                {step.title}
                            </h4>
                            <p className="text-3xs text-brand-dark/60 mt-0.5">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
