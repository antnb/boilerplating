import MaterialIcon from "./MaterialIcon";

interface QuickSpec {
    icon?: string;
    label: string;
    value: string;
}

interface ProductQuickSpecsProps {
    specs: QuickSpec[];
}

const shadeMap: Record<number, string> = {
    0: "bg-gradient-to-r from-primary/60 to-accent/60",
    1: "bg-gradient-to-r from-primary/80 to-primary/40",
    2: "bg-gradient-to-r from-accent/70 to-primary/70",
};

const ICON_MAP: Record<string, string> = {
    cahaya: "light_mode", light: "light_mode",
    air: "water_drop", water: "water_drop", siram: "water_drop",
    suhu: "thermostat", temperature: "thermostat",
    keamanan: "pets", toxicity: "pets",
    pertumbuhan: "trending_up", growth: "trending_up",
    asal: "pin_drop", origin: "pin_drop",
};

function getIcon(spec: QuickSpec): string {
    if (spec.icon) return spec.icon;
    const lower = spec.label.toLowerCase();
    for (const [key, icon] of Object.entries(ICON_MAP)) {
        if (lower.includes(key)) return icon;
    }
    return "eco";
}

export default function ProductQuickSpecs({ specs }: ProductQuickSpecsProps) {
    if (specs.length === 0) return null;

    return (
        <div className="border-t border-border pt-4 pb-4">
            <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <MaterialIcon name="dashboard" className="text-primary" size={16} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary/60 uppercase">Spesifikasi Cepat</span>
            </div>
            <dl className="grid grid-cols-3 gap-2">
                {specs.slice(0, 3).map((spec, idx) => (
                    <div
                        key={spec.label}
                        className="relative overflow-hidden rounded-xl p-3 text-center bg-card border border-border group hover:border-primary/30 transition-colors"
                    >
                        {/* Top accent line */}
                        <div className={`absolute top-0 left-0 right-0 h-[3px] ${shadeMap[idx % 3]}`} />
                        <div className="w-9 h-9 rounded-full mx-auto flex items-center justify-center bg-primary/10">
                            <MaterialIcon name={getIcon(spec)} className="text-primary" size={20} aria-hidden="true" />
                        </div>
                        <dt className="text-[9px] uppercase tracking-widest text-muted-foreground/70 mt-2">{spec.label}</dt>
                        <dd className="text-[13px] font-bold text-foreground mt-0.5">{spec.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
