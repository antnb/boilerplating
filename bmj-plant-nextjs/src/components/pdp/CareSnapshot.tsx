import MaterialIcon from "./MaterialIcon";
import type { CareItem } from "@/types/pdp";

type CareSnapshotProps = {
    items: CareItem[];
};

export default function CareSnapshot({ items }: CareSnapshotProps) {
    return (
        <aside className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative" aria-label="Ringkasan perawatan">
            {/* Decorative top accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent/50 to-transparent" />

            <div className="px-6 pt-5 pb-0 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MaterialIcon name="spa" className="text-primary" size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Perawatan
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">Ringkasan Perawatan</h2>
                </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 p-6">
                {items.map(({ icon, label, value }, idx) => (
                    <div key={label} className="relative overflow-hidden bg-secondary/40 rounded-xl p-3.5 border border-border hover:border-primary/30 transition-colors">
                        <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${idx % 2 === 0 ? "bg-primary" : "bg-accent"}`} />
                        <div className="pl-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx % 2 === 0 ? "bg-primary/10" : "bg-accent/10"}`}>
                                <MaterialIcon name={icon} className={idx % 2 === 0 ? "text-primary" : "text-accent"} size={20} aria-hidden="true" />
                            </div>
                            <dt className="text-[9px] uppercase tracking-widest text-muted-foreground/70 mt-2">{label}</dt>
                            <dd className="text-[15px] font-bold text-foreground mt-0.5 leading-tight">{value}</dd>
                        </div>
                    </div>
                ))}
            </dl>

            {/* Decorative watermark */}
            <div className="absolute bottom-2 right-2 opacity-[0.03] pointer-events-none">
                <MaterialIcon name="forest" size={64} className="text-primary" />
            </div>
        </aside>
    );
}
