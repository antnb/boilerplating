/* Section: Partner logos — social proof bar
   Desktop: centered horizontal flex
   Mobile: horizontal scroll with icon + text pairs */

import type { LayananPartnersData } from "@/shared/lib/schemas/layanan-sections";

type Props = { data?: LayananPartnersData };

const defaultPartners = [
    { icon: "apartment", name: "CIPUTRA" },
    { icon: "domain", name: "PAKUWON" },
    { icon: "hotel", name: "MARRIOTT" },
    { icon: "location_city", name: "SUMMARECON" },
    { icon: "corporate_fare", name: "AGUNG PODOMORO" },
];

export function LayananPartners({ data }: Props) {
    const label = data?.label ?? "Dipercaya Partner Nasional";
    const partners = data?.partners ?? defaultPartners;

    return (
        <section className="border-y border-brand-dark/10 py-8 bg-white/50">
            <p className="text-center text-xs font-bold text-brand-dark/60 uppercase tracking-widest mb-6">
                {label}
            </p>

            {/* Desktop: centered wrap */}
            <div className="hidden md:flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {partners.map((p) => (
                    <span
                        key={p.name}
                        className="text-xl font-serif font-bold text-brand-dark"
                    >
                        {p.name}
                    </span>
                ))}
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden overflow-x-auto gap-6 px-5 scrollbar-hide items-center">
                {partners.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-1 shrink-0">
                        {i > 0 && (
                            <div className="w-[1px] h-4 bg-brand-dark/10 shrink-0 mr-5" />
                        )}
                        <span className="material-symbols-outlined text-2xl opacity-50 grayscale">
                            {p.icon}
                        </span>
                        <span className="text-sm font-bold tracking-tighter text-brand-dark opacity-50">
                            {p.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
