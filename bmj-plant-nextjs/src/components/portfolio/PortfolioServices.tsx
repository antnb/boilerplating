type ServiceCard = { icon: string; title: string; description: string; tag: string };

type PortfolioServicesProps = {
    services: ServiceCard[];
};

export default function PortfolioServices({
    services,
}: PortfolioServicesProps) {
    return (
        <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service, i) => (
                    <div
                        key={i}
                        className="group bg-card rounded-3xl p-6 lg:p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5 group-hover:bg-accent transition-colors duration-300">
                            <span className="material-symbols-outlined text-primary-foreground text-2xl group-hover:text-accent-foreground transition-colors duration-300">
                                {service.icon}
                            </span>
                        </div>

                        {/* Tag */}
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent mb-2">
                            {service.tag}
                        </span>

                        {/* Content */}
                        <h2 className="font-serif text-xl text-foreground mb-3 leading-tight">
                            {service.title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
