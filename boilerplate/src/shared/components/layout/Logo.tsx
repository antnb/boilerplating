import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
    return (
        <Link href="/"
            className={cn(
                "font-serif font-bold tracking-tight hover:opacity-80 transition-opacity",
                sizeClasses[size],
                className
            )}
        >
            BMJ<span className="text-brand-accent">.</span>
        </Link>
    );
}
