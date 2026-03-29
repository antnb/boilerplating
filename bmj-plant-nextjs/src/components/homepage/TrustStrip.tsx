/* Section: Trust Strip — Desktop-only trust badges bar
   Rendered as {children} inside Hero component.
   
   Mobile trust is handled by Hero's built-in hero__trust-mobile
   glassmorphism bar — this component only renders the desktop row.
   
   Desktop (≥768px): dark bar with icon + title + subtitle */

import type { TrustStripData } from "@/lib/schemas/homepage-sections";

type Props = { data?: TrustStripData };

const defaultPills = [
    { icon: "verified", label: "Keaslian Terjamin", subtitle: "Sertifikat keaslian setiap spesimen" },
    { icon: "local_shipping", label: "Pengiriman Aman", subtitle: "Packaging khusus tanaman hidup" },
    { icon: "support_agent", label: "Dukungan Ahli 7 Hari", subtitle: "Konsultasi perawatan pasca pembelian" },
    { icon: "workspace_premium", label: "Kualitas Premium", subtitle: "Dipilih oleh ahli hortikultural" },
    { icon: "autorenew", label: "Garansi Tanaman Hidup", subtitle: "Kami ganti jika tidak survive perjalanan" },
];

export function TrustStrip({ data }: Props) {
    const pills = data?.pills ?? defaultPills;

    return (
        <section id="trust-strip" className="w-full hidden md:block">
            {/* Desktop only: flex row with icon + label + subtitle */}
            <div className="hidden md:flex trust-strip-desktop">
                {pills.map((pill) => (
                    <div
                        key={pill.icon}
                        className="trust-strip-item"
                    >
                        <span className="material-symbols-outlined trust-strip-icon">
                            {pill.icon}
                        </span>
                        <div className="trust-strip-text">
                            <span className="trust-strip-label">
                                {pill.label}
                            </span>
                            {pill.subtitle && (
                                <span className="trust-strip-subtitle">
                                    {pill.subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
