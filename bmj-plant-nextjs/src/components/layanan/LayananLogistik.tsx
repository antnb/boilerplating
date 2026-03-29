/* Section 7: Logistik Terintegrasi — shipping coverage
   Desktop: horizontal flex with shipping partner logos
   Mobile: stacked layout

   Data: BMJ uses third-party logistics (NOT internal fleet) */

import type { LayananLogistikData } from "@/lib/schemas/layanan-sections";

type Props = { data?: LayananLogistikData };

export function LayananLogistik({ data }: Props) {
    const heading = data?.heading ?? "Logistik Terintegrasi";
    const description = data?.description ?? "Pengiriman aman ke seluruh Indonesia via partner logistik terpercaya.";
    const guarantee = data?.guarantee ?? 'Garansi "Death on Arrival" 100%';

    return (
        <section className="w-full">
            <div className="bg-brand-dark rounded-xl p-8 border border-brand-dark flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: icon + description */}
                <div className="flex items-center gap-6 md:w-1/3">
                    <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center border border-brand-accent/30 flex-shrink-0">
                        <span className="material-icons text-brand-accent text-3xl">
                            local_shipping
                        </span>
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-xl">
                            {heading}
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Right: logos + guarantee */}
                <div className="flex flex-col md:flex-row items-center gap-6 md:w-2/3 justify-end">
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-4 py-2 bg-white rounded flex items-center justify-center shadow-md">
                            <span className="text-brand-dark font-extrabold tracking-tighter text-lg italic">
                                JNE
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-[#d40511] rounded flex items-center justify-center shadow-md">
                            <span className="text-white font-extrabold tracking-wide text-lg italic">
                                DHL
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-brand-accent rounded flex items-center justify-center shadow-md">
                            <span className="text-brand-dark font-bold text-sm uppercase tracking-wider flex items-center gap-1">
                                <span className="material-icons text-sm">
                                    local_shipping
                                </span>
                                CARGO
                            </span>
                        </div>
                    </div>
                    <p className="text-white/40 text-xs italic md:text-right w-full md:w-auto mt-2 md:mt-0">
                        {guarantee}
                    </p>
                </div>
            </div>
        </section>
    );
}
