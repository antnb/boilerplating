type SegmentItem = {
    label: string;
    description: string;
    icon: string;
    percentage: string;
    examples: string[];
};

type PortfolioSegmentsProps = {
    title: string;
    items: SegmentItem[];
};

export default function PortfolioSegments({
    title,
    items,
}: PortfolioSegmentsProps) {
    return (
        <section className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center">
                {title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="bg-primary rounded-3xl p-8 text-primary-foreground relative overflow-hidden group"
                    >
                        {/* Subtle background accent */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/8 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/15 transition-all duration-500" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-accent">
                                                {item.icon}
                                            </span>
                                        </div>
                                        <h3 className="font-serif text-xl italic">{item.label}</h3>
                                    </div>
                                    <p className="text-primary-foreground/60 text-sm">{item.description}</p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="text-4xl font-serif font-bold text-accent leading-none">
                                        {item.percentage}
                                    </p>
                                    <p className="text-[9px] uppercase tracking-[0.12em] text-primary-foreground/40 font-bold">
                                        Revenue
                                    </p>
                                </div>
                            </div>

                            {/* Examples */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.examples.map((ex, j) => (
                                    <span
                                        key={j}
                                        className="text-xs px-3 py-1 rounded-full border border-primary-foreground/15 text-primary-foreground/70 bg-primary-foreground/5"
                                    >
                                        {ex}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
