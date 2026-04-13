import type { OverviewStatsData } from "@/shared/lib/schemas/overview-sections";

type Props = { data?: OverviewStatsData };

const DEFAULT_STATS = [
    { value: '1995', label: 'Tahun Berdiri', icon: 'calendar_month', accent: false },
    { value: '500+', label: 'Varietas Tanaman', icon: 'potted_plant', accent: false },
    { value: '150+', label: 'Petani Mitra', icon: 'groups', accent: true },
    { value: '34', label: 'Provinsi Diantar', icon: 'local_shipping', accent: true },
];

export function OverviewStats({ data }: Props) {
    const stats = data?.stats ?? DEFAULT_STATS;
    const nibText = data?.nibText ?? 'NIB: 0712240010385 — Terdaftar di OSS (7 Desember 2024)';

    return (
        <section id="statistik">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {stats.map((stat: any) => (
                    <div
                        key={stat.label}
                        className="bg-card rounded-2xl p-5 lg:p-8 border border-border flex flex-col items-center text-center"
                    >
                        <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl ${stat.accent ? 'bg-accent/10 text-accent' : 'bg-muted text-foreground'} flex items-center justify-center mb-3 lg:mb-4`}>
                            <span className="material-symbols-outlined text-xl lg:text-2xl">{stat.icon}</span>
                        </div>
                        <span className="font-serif text-2xl lg:text-4xl font-bold text-foreground mb-1">
                            {stat.value}
                        </span>
                        <span className="text-xs lg:text-sm text-muted-foreground font-medium">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* NIB badge */}
            <div className="mt-3 lg:mt-4 bg-primary rounded-2xl p-4 lg:p-6 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-accent text-lg">verified</span>
                <span className="text-primary-foreground text-xs lg:text-sm font-medium">
                    {nibText}
                </span>
            </div>
        </section>
    );
}
