import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center gap-2 text-sm", className)}
        >
            <Link href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Home"
            >
                <Home className="size-4" />
            </Link>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="size-4 text-muted-foreground" />
                        {item.href && !isLast ? (
                            <Link href={item.href}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={cn(
                                    isLast ? "text-foreground font-medium" : "text-muted-foreground"
                                )}
                                aria-current={isLast ? "page" : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
