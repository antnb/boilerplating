import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MaterialIcon from "./MaterialIcon";

const sectionStyles: Record<string, { iconBg: string; iconColor: string; iconBorder: string }> = {
    checklist: { iconBg: "bg-primary/10", iconColor: "text-primary", iconBorder: "border-primary/20" },
    fingerprint: { iconBg: "bg-accent/10", iconColor: "text-accent", iconBorder: "border-accent/20" },
    gpp_maybe: { iconBg: "bg-destructive/10", iconColor: "text-destructive", iconBorder: "border-destructive/20" },
    eco: { iconBg: "bg-primary/10", iconColor: "text-primary", iconBorder: "border-primary/20" },
    public: { iconBg: "bg-accent/10", iconColor: "text-accent", iconBorder: "border-accent/20" },
    package_2: { iconBg: "bg-primary/10", iconColor: "text-primary", iconBorder: "border-primary/20" },
    favorite: { iconBg: "bg-primary/10", iconColor: "text-primary", iconBorder: "border-primary/20" },
    science: { iconBg: "bg-primary/10", iconColor: "text-primary", iconBorder: "border-primary/20" },
};

interface AccordionSection {
    icon: string;
    title: string;
    content: React.ReactNode;
}

interface ProductDetailsAccordionProps {
    identity: {
        commonName: string;
        scientificName: string;
        family?: string;
        localName?: string;
        cultivarName?: string;
        commonNames?: string[];
        sku?: string;
    };
    care: {
        careLevel: string;
        sunlight: string;
        watering: string;
        humidity?: string;
        soilType?: string;
        growthRate?: string;
        careTips?: string;
    };
    safety: {
        toxic?: string;
        petSafe?: boolean;
        childrenSafe?: boolean;
        handling?: string;
    };
    shipping: {
        risk?: string;
        methods?: string[];
        description?: string;
    };
    fullSpecs: { label: string; value: string }[];
    origin: {
        regions?: string[];
        habitat?: string;
    };
    benefits: { icon: string; label: string; description: string }[];
}

function Field({ label, value, italic = false }: { label: string; value: string; italic?: boolean }) {
    return (
        <div className="flex justify-between items-baseline">
            <dt className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">{label}</dt>
            <dd className={`text-sm font-bold text-foreground ${italic ? "italic" : ""}`}>{value}</dd>
        </div>
    );
}

export default function ProductDetailsAccordion({ identity, care, safety, shipping, fullSpecs, origin, benefits }: ProductDetailsAccordionProps) {
    const sections: AccordionSection[] = [
        {
            icon: "checklist",
            title: "Spesifikasi Lengkap",
            content: (
                <dl className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {fullSpecs.map(({ label, value }) => (
                        <div key={label}>
                            <dt className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">{label}</dt>
                            <dd className="text-sm font-bold text-foreground mt-0.5">{value}</dd>
                        </div>
                    ))}
                </dl>
            ),
        },
        {
            icon: "fingerprint",
            title: "Identitas Tanaman",
            content: (
                <dl className="space-y-3">
                    <Field label="Nama Umum" value={identity.commonName} />
                    <Field label="Nama Ilmiah" value={identity.scientificName} italic />
                    {identity.family && <Field label="Family" value={identity.family} />}
                    {identity.sku && <Field label="SKU" value={identity.sku} />}
                </dl>
            ),
        },
        {
            icon: "eco",
            title: "Panduan Perawatan",
            content: (
                <dl className="space-y-2.5">
                    <Field label="Tingkat Kesulitan" value={care.careLevel} />
                    <Field label="Cahaya" value={care.sunlight} />
                    <Field label="Penyiraman" value={care.watering} />
                    {care.humidity && <Field label="Kelembaban" value={care.humidity} />}
                    {care.soilType && <Field label="Media Tanam" value={care.soilType} />}
                    {care.growthRate && <Field label="Kecepatan Tumbuh" value={care.growthRate} />}
                    {care.careTips && (
                        <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Tips</p>
                            <p className="text-sm text-foreground leading-relaxed">{care.careTips}</p>
                        </div>
                    )}
                </dl>
            ),
        },
        {
            icon: "gpp_maybe",
            title: "Keamanan",
            content: (
                <div className="space-y-3">
                    {safety.toxic && (
                        <mark className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-bold px-3 py-1.5 rounded-full border border-destructive/20">
                            ⚠️ Toksisitas: {safety.toxic}
                        </mark>
                    )}
                    <div className="flex gap-4 flex-wrap">
                        {safety.petSafe !== undefined && (
                            <span className={`text-sm flex items-center gap-1.5 ${safety.petSafe ? "text-primary" : "text-destructive"}`}>
                                <MaterialIcon name="pets" size={16} />
                                {safety.petSafe ? "Aman hewan" : "Tidak aman hewan"}
                            </span>
                        )}
                    </div>
                    {safety.handling && (
                        <p className="text-xs text-muted-foreground bg-secondary/50 p-2.5 rounded-lg">{safety.handling}</p>
                    )}
                </div>
            ),
        },
        {
            icon: "public",
            title: "Asal-Usul",
            content: (
                <div className="space-y-2">
                    {origin.regions && origin.regions.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {origin.regions.map(r => (
                                <span key={r} className="text-xs px-2 py-1 bg-secondary border border-border rounded text-foreground">{r}</span>
                            ))}
                        </div>
                    )}
                    {origin.habitat && (
                        <p className="text-[13px] text-foreground/70 leading-relaxed">{origin.habitat}</p>
                    )}
                </div>
            ),
        },
        {
            icon: "favorite",
            title: "Manfaat",
            content: benefits.length > 0 ? (
                <div className="space-y-2.5">
                    {benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                <MaterialIcon name={b.icon} className="text-primary" size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{b.label}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{b.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-sm text-muted-foreground">Data belum tersedia.</p>,
        },
        {
            icon: "package_2",
            title: "Pengiriman & Aklimatisasi",
            content: (
                <div className="space-y-3">
                    {shipping.methods && (
                        <div className="flex gap-2 flex-wrap">
                            {shipping.methods.map(m => (
                                <span key={m} className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">{m}</span>
                            ))}
                        </div>
                    )}
                    {shipping.description && (
                        <p className="text-[13px] text-foreground/70 leading-relaxed">{shipping.description}</p>
                    )}
                    <aside className="bg-accent/10 border border-accent/20 rounded-xl p-3.5">
                        <p className="text-xs font-bold text-accent flex items-center gap-1.5">
                            <MaterialIcon name="schedule" size={14} />
                            Garansi 7 Hari
                        </p>
                        <p className="text-[12px] text-foreground/60 mt-1">Laporkan kerusakan dalam 24 jam dengan foto unboxing untuk klaim.</p>
                    </aside>
                </div>
            ),
        },
    ];

    return (
        <section aria-label="Detail produk">
            <div className="mb-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0 mt-0.5">
                    <MaterialIcon name="auto_stories" className="text-accent" size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Detail Lengkap
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">Informasi Produk</h2>
                </div>
            </div>
            <Accordion type="multiple" className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {sections.map(({ icon, title, content }, idx) => {
                    const style = sectionStyles[icon] || sectionStyles.checklist;
                    return (
                        <AccordionItem key={title} value={`item-${idx}`} className="border-border px-6">
                            <AccordionTrigger className="hover:no-underline gap-3 py-5">
                                <span className="flex items-center gap-3">
                                    <div className={`${style.iconBg} rounded-lg p-1.5 border ${style.iconBorder}`}>
                                        <MaterialIcon name={icon} className={style.iconColor} size={18} aria-hidden="true" />
                                    </div>
                                    <span className="font-bold text-foreground text-[13px]">{title}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-5">{content}</AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </section>
    );
}
