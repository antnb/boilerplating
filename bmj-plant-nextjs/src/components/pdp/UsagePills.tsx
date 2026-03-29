import MaterialIcon from "./MaterialIcon";
import type { UsageTag } from "@/types/pdp";

type UsagePillsProps = {
    tags: UsageTag[];
};

export default function UsagePills({ tags }: UsagePillsProps) {
    return (
        <div id="pdp-usage" className="border-t border-border pt-4">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground/70 font-bold mb-2.5 flex items-center gap-1.5">
                <MaterialIcon name="check_circle" className="text-primary" size={12} />
                Cocok Untuk
            </p>
            <div className="flex flex-wrap gap-2">
                {tags.map(({ icon, label }, idx) => (
                    <span
                        key={label}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors hover:border-primary/40 ${idx % 2 === 0 ? "bg-primary/5 text-primary border-primary/15" : "bg-accent/5 text-accent border-accent/15"}`}
                    >
                        <MaterialIcon name={icon} size={14} />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
