/* Section: Quick Contact — gold gradient card
   Desktop: horizontal layout with phone number + WhatsApp CTA
   Mobile: compact card with phone + WA icon button */

import type { LayananQuickContactData } from "@/shared/lib/schemas/layanan-sections";

type Props = { data?: LayananQuickContactData };

export function LayananQuickContact({ data }: Props) {
    const heading = data?.heading ?? "Butuh Respon Cepat?";
    const subtitle = data?.subtitle ?? "Hubungi tim penjualan kami langsung.";
    const phoneNumber = data?.phoneNumber ?? "081586664516";
    const phoneDisplay = data?.phoneDisplay ?? "0815-8666-4516";
    const waButtonText = data?.waButtonText ?? "Chat WhatsApp";

    const WA_LINK = `https://wa.me/62${phoneNumber.slice(1)}`;

    return (
        <section className="w-full">
            <div className="bg-gradient-to-r from-brand-accent to-yellow-600 rounded-2xl p-6 border border-brand-accent shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: icon + text */}
                <div className="flex items-center gap-4 text-brand-dark">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <span className="material-icons text-3xl text-white">
                            support_agent
                        </span>
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-xl">
                            {heading}
                        </h2>
                        <p className="text-brand-dark font-medium text-sm">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Right: phone number + WhatsApp button */}
                <div className="flex items-center gap-4">
                    <a
                        className="hidden md:flex flex-col items-end text-right mr-2"
                        href={`tel:+62${phoneNumber.slice(1)}`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/70">
                            Telepon
                        </span>
                        <span className="text-2xl font-bold text-white font-mono tracking-tight">
                            {phoneDisplay}
                        </span>
                    </a>
                    <a
                        className="px-6 py-3 bg-white text-brand-dark font-bold rounded-full hover:shadow-lg transition-all flex items-center gap-2 group"
                        href={WA_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="material-icons text-green-600 group-hover:scale-110 transition-transform">
                            chat
                        </span>
                        {waButtonText}
                    </a>
                </div>
            </div>
        </section>
    );
}
