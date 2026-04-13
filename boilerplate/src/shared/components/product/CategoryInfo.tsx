interface CategoryInfoProps {
    name?: string | null;
    description?: string | null;
}

export default function CategoryInfo({ name, description }: CategoryInfoProps) {
    if (!name || !description) return null;

    return (
        <div className="mt-4 md:mt-8 mb-4 border border-brand-border bg-white rounded-[24px] p-5 md:p-8 shadow-[var(--shadow-soft)] relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2 md:block">
                    <span className="text-lg md:hidden">📖</span>
                    <h3 className="font-serif font-bold text-base md:text-2xl text-brand-dark">
                        <span className="hidden md:inline">📖 </span>Tentang Tanaman {name}
                    </h3>
                </div>
                <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed max-w-4xl">
                    {description}
                </p>
            </div>
        </div>
    );
}
