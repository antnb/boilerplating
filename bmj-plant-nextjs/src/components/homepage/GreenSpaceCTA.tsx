/* Section 6: Green Space CTA */

import type { GreenSpaceCtaData } from "@/lib/schemas/homepage-sections";

type Props = { data?: GreenSpaceCtaData };

export function GreenSpaceCTA({ data }: Props) {
    const heading = data?.heading ?? "Planning a Green Space?";
    const description = data?.description ?? "Discuss your interior landscaping needs directly with our project leads via WhatsApp.";
    const ctaText = data?.ctaText ?? "Chat on WhatsApp";

    return (
        <section id="greenspace-cta" className="w-full">
            <div className="bento-card bg-brand-dark text-white rounded-2xl p-6 md:p-8 lg:p-12 border border-brand-dark relative overflow-hidden flex flex-col md:flex-row items-center justify-between cta-content text-center md:text-left">
                {/* SVG cross pattern background */}
                <div
                    className="absolute inset-0 bg-white/5 opacity-20 pattern-crosses"
                />
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif italic mb-2">
                        {heading}
                    </h2>
                    <p className="text-white/80 font-light text-sm md:text-lg">
                        {description}
                    </p>
                </div>
                <div className="relative z-10 w-full md:w-auto">
                    <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold rounded-full flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg text-sm md:text-base">
                        <span className="material-icons text-lg md:text-2xl">chat</span>
                        {ctaText}
                    </button>
                </div>
            </div>
        </section>
    );
}
