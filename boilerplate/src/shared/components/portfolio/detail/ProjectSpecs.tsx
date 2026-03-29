type ProjectSpecsProps = {
    clientName: string | null;
    location: string;
    scale: string;
    duration: string | null;
    completedAt: Date | null;
    category: string;
};

export default function ProjectSpecs({
    clientName,
    location,
    scale,
    duration,
    completedAt,
    category,
}: ProjectSpecsProps) {
    const specs = [
        { icon: "category", label: "Kategori", value: category },
        { icon: "location_on", label: "Lokasi", value: location },
        { icon: "forest", label: "Skala", value: scale },
        ...(clientName ? [{ icon: "business", label: "Klien", value: clientName }] : []),
        ...(duration ? [{ icon: "schedule", label: "Durasi", value: duration }] : []),
        ...(completedAt
            ? [{
                icon: "event_available",
                label: "Selesai",
                value: new Date(completedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                }),
            }]
            : []),
    ];

    return (
        <aside className="bg-brand-cream/50 rounded-2xl p-6 sticky top-24">
            <h3 className="font-serif text-lg text-brand-dark mb-4">Detail Proyek</h3>
            <dl className="space-y-4">
                {specs.map((s) => (
                    <div key={s.label} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-brand-accent text-xl mt-0.5">
                            {s.icon}
                        </span>
                        <div>
                            <dt className="text-2xs font-semibold uppercase tracking-wider text-brand-dark/50">
                                {s.label}
                            </dt>
                            <dd className="text-sm text-brand-dark font-medium">
                                {s.value}
                            </dd>
                        </div>
                    </div>
                ))}
            </dl>
        </aside>
    );
}
