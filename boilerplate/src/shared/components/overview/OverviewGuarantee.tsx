import type { OverviewGuaranteeData } from "@/shared/lib/schemas/overview-sections";

type Props = { data?: OverviewGuaranteeData };

export function OverviewGuarantee({ data }: Props) {
    const heading = data?.heading ?? "Garansi 100% Aman";
    const description = data?.description ?? "Kami menjamin setiap tanaman tiba dalam kondisi prima. Jika terjadi kerusakan saat pengiriman, kami akan mengganti dengan unit baru atau melakukan refund — tanpa syarat rumit.";
    const badgeText = data?.badgeText ?? "Terproteksi";

    return (
        <section
            id="garansi"
            className="bg-primary rounded-2xl lg:rounded-3xl p-6 lg:p-12 relative overflow-hidden"
        >
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none dot-grid" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4 lg:gap-8 text-center lg:text-left">
                {/* Icon */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-accent text-3xl lg:text-4xl">verified_user</span>
                </div>

                {/* Text */}
                <div className="flex-1">
                    <h2 className="text-xl lg:text-3xl font-serif font-bold text-primary-foreground mb-2 lg:mb-3">
                        {heading}
                    </h2>
                    <p className="text-primary-foreground/60 text-sm lg:text-base leading-relaxed max-w-2xl">
                        {description}
                    </p>
                </div>

                {/* Badge */}
                <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-bold">
                        <span className="material-symbols-outlined text-base">verified_user</span>
                        {badgeText}
                    </span>
                </div>
            </div>
        </section>
    );
}
