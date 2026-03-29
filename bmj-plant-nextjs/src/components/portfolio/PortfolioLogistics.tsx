type IslandCoverage = { name: string; active: boolean };
type LogisticsDestination = { city: string };

type PortfolioLogisticsProps = {
    title: string;
    subtitle: string;
    islands: IslandCoverage[];
    destinations: LogisticsDestination[];
    shippingNote: string;
};

export default function PortfolioLogistics({
    title,
    subtitle,
    islands,
    destinations,
    shippingNote,
}: PortfolioLogisticsProps) {
    return (
        <section className="mb-12 bg-card rounded-3xl p-8 lg:p-10 border border-border shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left — Title + Islands */}
                <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                        {title}
                    </h2>
                    <p className="text-accent font-serif italic text-lg mb-6">
                        {subtitle}
                    </p>

                    {/* Island pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {islands.map((island, i) => (
                            <span
                                key={i}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                    island.active
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground border border-border"
                                }`}
                            >
                                {island.name}
                            </span>
                        ))}
                    </div>

                    {/* Shipping note */}
                    <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl border border-border">
                        <span className="material-symbols-outlined text-accent mt-0.5">
                            info
                        </span>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {shippingNote}
                        </p>
                    </div>
                </div>

                {/* Right — Destinations */}
                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent mb-4">
                        Destinasi Utama
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {destinations.map((dest, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 py-3 px-4 bg-muted/30 rounded-xl border border-border hover:bg-muted transition-colors"
                            >
                                <span className="material-symbols-outlined text-muted-foreground text-sm">
                                    location_on
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {dest.city}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
