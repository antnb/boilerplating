/* Section 8: CTA — final conversion block
   "Butuh Supply Tanaman?" with WhatsApp + Katalog buttons
   Dark card with texture background */

import type { LayananCTAData } from "@/shared/lib/schemas/layanan-sections";

type Props = { data?: LayananCTAData };

export function LayananCTA({ data }: Props) {
    const heading = data?.heading ?? "Butuh Supply Tanaman?";
    const description = data?.description ?? "Konsultasikan kebutuhan tanaman Anda sekarang. Tim ahli kami siap membantu memilih spesimen terbaik.";
    const waLink = data?.waLink ?? "https://wa.me/6281586664516";
    const waButtonText = data?.waButtonText ?? "Hubungi WhatsApp";
    const catalogButtonText = data?.catalogButtonText ?? "Lihat Katalog Tanaman";
    const catalogHref = data?.catalogHref ?? "/product";

    return (
        <section className="w-full">
            <div className="bento-card bg-brand-dark rounded-2xl p-8 md:p-12 text-center border border-brand-dark relative overflow-hidden">
                {/* Texture background */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                        {heading}
                    </h2>
                    <p className="text-white/80 mb-8 text-lg">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Primary: WhatsApp */}
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-brand-accent text-brand-dark font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <span className="material-icons">chat</span>
                            {waButtonText}
                        </a>

                        {/* Secondary: Katalog */}
                        <a
                            href={catalogHref}
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white font-medium text-lg rounded-full hover:bg-white/10 transition-colors text-center"
                        >
                            {catalogButtonText}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
