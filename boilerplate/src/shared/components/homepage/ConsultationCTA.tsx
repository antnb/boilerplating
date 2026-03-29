/* Section 9: Private Consultation CTA */

import type { ConsultationCtaData } from "@/shared/lib/schemas/homepage-sections";

type Props = { data?: ConsultationCtaData };

export function ConsultationCTA({ data }: Props) {
    const icon = data?.icon ?? "psychology_alt";
    const heading = data?.heading ?? "Private Consultation";
    const description = data?.description ?? "Schedule a session with our senior botanists for your personal project.";
    const ctaText = data?.ctaText ?? "Book Consultation";

    return (
        <section id="consultation-cta" className="grid grid-cols-1 lg:grid-cols-4">
            <div className="bento-card col-span-1 lg:col-span-4 bg-white rounded-2xl p-5 md:p-6 lg:p-8 border border-brand-dark flex flex-col md:flex-row items-center justify-between cta-content">
                <div className="flex flex-col md:flex-row items-center md:items-center cta-content px-2 md:px-4 text-center md:text-left">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-off-white border border-brand-dark/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons text-brand-dark text-2xl md:text-3xl">
                            {icon}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-brand-dark">
                            {heading}
                        </h3>
                        <p className="text-brand-dark/80 text-xs md:text-sm mt-0.5 md:mt-1 max-w-lg">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto px-2 md:px-0">
                    <button className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-dark/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                        {ctaText}
                        <span className="material-icons text-sm md:text-base">
                            calendar_month
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
