import type { OverviewLogisticsData } from "@/lib/schemas/overview-sections";

type Props = { data?: OverviewLogisticsData };

const DEFAULT_STEPS = [
    { icon: "inventory_2", title: "Seleksi & Packaging", desc: "Inspeksi kualitas ketat sebelum pengiriman. Packaging khusus tanaman hidup.", step: "01" },
    { icon: "local_shipping", title: "Kurir Darat", desc: "Armada khusus untuk pengiriman antar kota dengan kontrol suhu.", step: "02" },
    { icon: "flight_takeoff", title: "Cargo Udara", desc: "Express delivery via kargo udara untuk pesanan prioritas.", step: "03" },
    { icon: "sailing", title: "Ekspedisi Laut", desc: "Pengiriman kontainer untuk volume besar antar pulau.", step: "04" },
];
const DEFAULT_PARTNERS = ["JNE", "J&T", "SiCepat", "POS Indonesia", "DHL", "TIKI"];

export function OverviewLogistics({ data }: Props) {
    const badge = data?.badge ?? "Sistem Logistik";
    const heading = data?.heading ?? "Sistem Pengiriman Terintegrasi";
    const subtitle = data?.subtitle ?? "Dari nursery langsung ke lokasi proyek Anda — dengan jaminan kualitas di setiap tahap.";
    const steps = data?.steps ?? DEFAULT_STEPS;
    const partnersLabel = data?.partnersLabel ?? "Mitra Ekspedisi";
    const partners = data?.partners ?? DEFAULT_PARTNERS;

    return (
        <section id="logistik" className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-block px-3 py-1.5 bg-muted text-foreground rounded-full text-2xs lg:text-xs font-bold uppercase tracking-wider mb-3 lg:mb-4">
                    {badge}
                </span>
                <h2 className="text-xl lg:text-3xl font-serif font-bold text-foreground mb-2">
                    {heading}
                </h2>
                <p className="text-muted-foreground text-sm lg:text-base max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            {/* Step cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {steps.map((step: any) => (
                    <div
                        key={step.step}
                        className="bg-card rounded-2xl p-4 lg:p-6 border border-border flex flex-col"
                    >
                        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                            <span className="text-xs font-bold text-accent">{step.step}</span>
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
                                <span className="material-symbols-outlined text-base lg:text-lg">{step.icon}</span>
                            </div>
                        </div>
                        <h3 className="font-serif font-bold text-foreground text-sm lg:text-base mb-1 lg:mb-2">
                            {step.title}
                        </h3>
                        <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* Partners bar */}
            <div className="bg-card rounded-2xl border border-border p-4 lg:p-6">
                <p className="text-xs lg:text-sm text-muted-foreground text-center mb-4 font-medium uppercase tracking-wide">
                    {partnersLabel}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
                    {partners.map((name: string) => (
                        <div key={name} className="w-16 h-10 lg:w-20 lg:h-12 flex items-center justify-center rounded-lg bg-muted px-3 py-2">
                            <span className="text-xs lg:text-sm font-bold text-muted-foreground">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
