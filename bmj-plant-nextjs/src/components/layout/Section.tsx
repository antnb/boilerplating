import { cn } from "@/lib/utils";

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "dark" | "accent";
    id?: string;
}

const variantClasses = {
    default: "bg-background text-foreground",
    dark: "bg-brand-dark text-white",
    accent: "bg-brand-bg text-foreground",
};

export function Section({
    children,
    className,
    variant = "default",
    id,
}: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "py-12 md:py-24",
                variantClasses[variant],
                className
            )}
        >
            <div className="container-page">
                {children}
            </div>
        </section>
    );
}
