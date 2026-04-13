/* Section 3: Cara Kerja — 4 steps
   Desktop: 4-col grid with circle icons + horizontal connector line
   Mobile: vertical timeline with connecting line */

import type { LayananCaraKerjaData } from "@/shared/lib/schemas/layanan-sections";

type Props = { data?: LayananCaraKerjaData };

const defaultSteps = [
    { icon: "chat", title: "1. Hubungi", desc: "Konsultasikan kebutuhan jenis, jumlah, dan timeline via WhatsApp." },
    { icon: "checklist", title: "2. Kurasi", desc: "Tim kami koordinasi dengan petani mitra untuk memilih tanaman terbaik." },
    { icon: "inventory_2", title: "3. Kemas", desc: "Standar packing kayu dan media khusus untuk perjalanan jauh." },
    { icon: "local_shipping", title: "4. Terima", desc: "Tanaman tiba dengan garansi kondisi sehat sampai tujuan." },
];

export function LayananCaraKerja({ data }: Props) {
    const sectionTitle = data?.sectionTitle ?? "Cara Kerja Kami";
    const steps = data?.steps ?? defaultSteps;

    return (
        <section className="w-full">
            <div className="bento-card bg-brand-off-white rounded-2xl p-8 border border-brand-dark">
                {/* Section title */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <h2 className="text-2xl font-serif font-bold text-brand-dark">
                        {sectionTitle}
                    </h2>
                    <div className="h-0.5 w-12 bg-brand-accent mt-2" />
                </div>

                {/* Desktop: 4-col grid */}
                <div className="hidden md:grid grid-cols-4 gap-6 relative">
                    {/* Connector line */}
                    <div className="absolute top-[48px] left-[12%] right-[12%] h-[2px] bg-brand-dark/10 -z-0" />

                    {steps.map((step) => (
                        <div
                            key={step.title}
                            className="flex flex-col items-center text-center relative z-10 group"
                        >
                            <div className="w-24 h-24 bg-brand-surface border border-brand-dark rounded-full flex items-center justify-center mb-4 shadow-[var(--shadow-soft)] group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl text-brand-dark">
                                    {step.icon}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-brand-dark mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-brand-dark/60 max-w-[200px]">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Mobile: vertical timeline */}
                <div className="md:hidden relative space-y-0 ml-2">
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-brand-dark/20" />

                    {steps.map((step, i) => (
                        <div
                            key={step.title}
                            className={`relative flex gap-5 ${i < steps.length - 1 ? "pb-8" : ""} group`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full z-10 flex items-center justify-center shrink-0 ${i === steps.length - 1
                                    ? "bg-brand-dark text-white"
                                    : "bg-brand-surface border-2 border-brand-dark"
                                    }`}
                            >
                                {i === steps.length - 1 ? (
                                    <span className="material-icons text-sm">
                                        check
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold">
                                        {i + 1}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-brand-dark">
                                    {step.title.replace(/^\d+\.\s/, "")}
                                </h3>
                                <p className="text-xs text-brand-dark/60 mt-1">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
