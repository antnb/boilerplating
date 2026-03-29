// Server Component — CSS-only scroll reveal (zero JS!)
import { cn } from "@/lib/utils";
import type { ReactNode, CSSProperties } from "react";

type Direction = "up" | "left" | "right" | "none";

interface ScrollRevealCSSProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
}

const directionMap: Record<Direction, string> = {
  up: "scroll-reveal-up",
  left: "scroll-reveal-left",
  right: "scroll-reveal-right",
  none: "scroll-reveal-none",
};

export function ScrollRevealCSS({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealCSSProps) {
  return (
    <div
      className={cn("scroll-reveal", directionMap[direction], className)}
      style={{ animationDelay: `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
