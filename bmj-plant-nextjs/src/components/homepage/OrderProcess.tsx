/* Section 4: Order Process — Step by step delivery process */

import type { OrderProcessData } from "@/lib/schemas/homepage-sections";
import { StaggerChildren } from "@/components/layout/StaggerChildren";

type Props = { data?: OrderProcessData };

const defaultSteps = [
    {
        icon: "ads_click",
        title: "PILIH",
        desc: "Pilih spesimen terbaik dari katalog kurasi kami.",
        hasArrow: true,
    },
    {
        icon: "package_2",
        title: "DIKEMAS",
        desc: "Pengemasan khusus tanaman hidup anti-stress.",
        hasArrow: true,
    },
    {
        icon: "local_shipping",
        title: "DIKIRIM",
        desc: "Pengiriman ekspres berpendingin ke seluruh Indonesia.",
        hasArrow: true,
    },
    {
        icon: "check_circle",
        title: "DITERIMA",
        desc: "Jaminan tanaman tiba sehat atau kami kirim ulang.",
        hasArrow: false,
    },
];

export function OrderProcess({ data }: Props) {
    const sectionTitle = data?.sectionTitle ?? "Bagaimana Tanaman Sampai ke Anda";

    // We don't strictly need hasArrow anymore as we use dashed lines, 
    // but we map it just in case default data relies on it.
    const steps = data?.steps
        ? data.steps.map((step, i) => ({
            ...step,
            hasArrow: i < data.steps.length - 1,
        }))
        : defaultSteps;

    return (
        <section id="order-process" className="grid grid-cols-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-10 lg:p-12 border border-brand-dark/15 shadow-sm relative overflow-hidden group/section">

                {/* Subtle background decoration */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-dark/5 to-transparent"></div>

                <h2 className="text-center font-serif text-2xl md:text-3xl text-brand-dark mb-10 md:mb-16">
                    {sectionTitle}
                </h2>

                <div className="relative max-w-5xl mx-auto">
                    {/* ── Background Connecting Lines ── */}
                    {/* Desktop Horizontal Line */}
                    <div className="hidden md:block absolute top-[32px] left-[15%] right-[15%] h-[0px] border-t-2 border-dashed border-brand-dark/15 z-0" />

                    {/* Mobile Vertical Line */}
                    <div className="block md:hidden absolute left-[31px] top-[10%] bottom-[10%] w-[0px] border-l-2 border-dashed border-brand-dark/15 z-0" />

                    {/* ── Steps ── */}
                    <StaggerChildren stagger={0.15} className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 relative z-10">
                        {steps.map((step, idx) => (
                            <div
                                key={step.icon}
                                className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center relative flex-1 group cursor-default"
                            >
                                {/* Icon Circle */}
                                <div className="w-16 h-16 shrink-0 rounded-full bg-white border-2 border-brand-dark/15 flex items-center justify-center transition-all duration-300 md:mb-5 group-hover:border-brand-dark/40 group-hover:bg-brand-sage/5 relative z-10 mr-4 md:mr-0">
                                    <span className="material-symbols-outlined text-brand-dark/80 text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110">
                                        {step.icon}
                                    </span>
                                </div>

                                {/* Text Content */}
                                <div className="flex flex-col justify-center pt-1 md:pt-0">
                                    <h3 className="text-sm font-bold text-brand-dark tracking-widest uppercase mb-1 md:mb-1.5 flex items-center gap-2 md:justify-center">
                                        <span className="text-brand-dark/30 text-xs font-mono md:hidden">{idx + 1}.</span>
                                        {step.title}
                                    </h3>
                                    <p className="text-sm md:text-xs lg:text-sm text-brand-dark/60 max-w-[220px] md:max-w-[240px] leading-relaxed mx-auto">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </StaggerChildren>
                </div>
            </div>
        </section>
    );
}
