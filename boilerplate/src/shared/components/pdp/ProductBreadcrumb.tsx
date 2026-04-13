import Link from "next/link";
import MaterialIcon from "./MaterialIcon";

type BreadcrumbItem = {
    label: string;
    href: string;
};

type ProductBreadcrumbProps = {
    items: BreadcrumbItem[];
};

export default function ProductBreadcrumb({ items }: ProductBreadcrumbProps) {
    return (
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 overflow-x-auto" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                        {i > 0 && <MaterialIcon name="chevron_right" size={14} />}
                        {item.href ? (
                            <Link href={item.href} className="hover:text-foreground transition-colors shrink-0">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium truncate">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
