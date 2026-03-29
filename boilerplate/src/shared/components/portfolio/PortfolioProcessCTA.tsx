type ProcessStep = {
    number: string;
    title: string;
    description: string;
    icon: string;
};

type PortfolioProcessCTAProps = {
    process: {
        title: string;
        steps: ProcessStep[];
    };
    cta: {
        title: string;
        subtitle: string;
        primaryLabel: string;
        secondaryLabel: string;
    };
};

export default function PortfolioProcessCTA({
    process,
    cta,
}: PortfolioProcessCTAProps) {
    return (
        <>
            {/* ── Process ── */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center">
                    {process.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {process.steps.map((step, i) => (
                        <div key={i} className="relative">
                            {/* Connector line (desktop) */}
                            {i < process.steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 right-0 w-4 h-0.5 bg-accent/30 translate-x-2 z-20" />
                            )}

                            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm h-full flex flex-col items-center text-center">
                                {/* Number */}
                                <div className="w-14 h-14 rounded-2xl bg-primary text-accent flex items-center justify-center mb-4 relative">
                                    <span className="material-symbols-outlined text-xl">
                                        {step.icon}
                                    </span>
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="font-serif text-lg text-foreground mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="mb-8 bg-primary rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="material-symbols-outlined text-accent text-4xl mb-4 block">
                        handshake
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground italic leading-tight mb-4">
                        {cta.title}
                    </h2>
                    <p className="text-primary-foreground/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                        {cta.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="px-8 py-3.5 bg-accent text-accent-foreground font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg">
                            <span className="material-symbols-outlined text-lg">chat</span>
                            {cta.primaryLabel}
                        </button>
                        <button className="px-8 py-3.5 border border-primary-foreground/20 text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-primary-foreground/10 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">inventory_2</span>
                            {cta.secondaryLabel}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
