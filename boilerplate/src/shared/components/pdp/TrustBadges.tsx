import MaterialIcon from "./MaterialIcon";

const badges = [
    { icon: "local_shipping", label: "Pengiriman Aman", sub: "Packing premium", accent: "primary" as const },
    { icon: "verified_user", label: "Garansi 7 Hari", sub: "Uang kembali", accent: "accent" as const },
    { icon: "support_agent", label: "Support 24/7", sub: "Siap membantu", accent: "primary" as const },
];

export default function TrustBadges() {
    return (
        <ul className="grid grid-cols-3 gap-2 sm:gap-4 list-none p-0 m-0" aria-label="Jaminan layanan">
            {badges.map(({ icon, label, sub, accent }) => (
                <li
                    key={label}
                    className="relative flex flex-col items-center text-center bg-card border border-border rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden"
                >
                    <div className={`absolute top-0 left-0 right-0 h-[3px] ${accent === "primary" ? "bg-gradient-to-r from-primary/70 to-primary/20" : "bg-gradient-to-r from-accent/70 to-accent/20"}`} />
                    <div className={`${accent === "primary" ? "bg-primary/10 border-primary/20" : "bg-accent/10 border-accent/20"} border rounded-full p-2.5 mb-2`} aria-hidden="true">
                        <MaterialIcon name={icon} className={accent === "primary" ? "text-primary" : "text-accent"} size={20} />
                    </div>
                    <strong className="text-[11px] font-bold text-foreground uppercase tracking-wide">{label}</strong>
                    <small className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</small>
                </li>
            ))}
        </ul>
    );
}
