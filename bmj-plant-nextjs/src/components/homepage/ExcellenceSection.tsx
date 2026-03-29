/* Section 10: Excellence + Guarantee */

import type { ExcellenceSectionData } from "@/lib/schemas/homepage-sections";
import { StaggerChildren } from "@/components/layout/StaggerChildren";

type Props = {
    data: ExcellenceSectionData;
};

export function ExcellenceSection({ data }: Props) {
    return (
        <StaggerChildren stagger={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* 10A: Excellence Card */}
            <div className="bento-card lg:col-span-2 bg-brand-dark rounded-2xl p-6 md:p-8 lg:p-10 border border-brand-dark text-white relative overflow-hidden flex flex-col justify-between min-h-[250px] md:min-h-[300px]">
                <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 pointer-events-none">
                    <span className="material-icons text-[120px] md:text-[200px] leading-none">spa</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif mb-2">
                        {data.heading} <br />
                        <span className="text-brand-accent italic">
                            {data.headingHighlight}
                        </span>
                    </h2>
                    <p className="text-white/70 max-w-md text-sm md:text-base">
                        {data.subtitle}
                    </p>
                </div>
                <div className="relative z-10 mt-6 md:mt-8 flex items-center gap-4 md:gap-6">
                    <div className="flex -space-x-3 md:-space-x-4">
                        {/* Avatar placeholders with icons */}
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-dark bg-brand-forest flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">person</span>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-dark bg-brand-forest-light flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">person</span>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-dark bg-brand-muted flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">person</span>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-dark bg-brand-accent flex items-center justify-center text-brand-dark font-bold text-2xs md:text-xs">
                            {data.partnerCount}
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-base md:text-lg">{data.partnerLabel}</p>
                        <p className="text-2xs md:text-xs text-white/50 uppercase tracking-widest">
                            {data.partnerSublabel}
                        </p>
                    </div>
                </div>
            </div>

            {/* 10B: Guarantee Card */}
            <div className="bento-card bg-brand-surface rounded-2xl p-6 md:p-8 border border-brand-dark flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-accent/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                <span className="material-icons text-brand-accent text-4xl md:text-6xl mb-3 md:mb-4 relative z-10">
                    verified_user
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-1 md:mb-2 relative z-10">
                    {data.guaranteeValue}
                </h2>
                <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-dark/60 mb-2 md:mb-4 relative z-10">
                    {data.guaranteeLabel}
                </p>
                <p className="text-xs md:text-sm text-brand-dark/80 italic relative z-10">
                    &quot;{data.guaranteeDescription}&quot;
                </p>
            </div>
        </StaggerChildren>
    );
}
