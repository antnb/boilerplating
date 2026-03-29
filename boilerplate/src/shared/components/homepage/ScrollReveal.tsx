"use client";

import { useScrollReveal } from "@/shared/hooks/useScrollReveal";
import { cn } from "@/shared/lib/utils";
import type { ReactNode, CSSProperties } from "react";

type Direction = "up" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
}

const directionStyles: Record<Direction, CSSProperties> = {
  up: { transform: "translateY(28px)" },
  left: { transform: "translateX(-28px)" },
  right: { transform: "translateX(28px)" },
  none: { transform: "none" },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.75,
  className,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.06, rootMargin: "0px 0px -60px 0px" });

  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  const hiddenStyle: CSSProperties = {
    opacity: 0,
    ...directionStyles[direction],
    transition: `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`,
    willChange: "opacity, transform",
  };

  const visibleStyle: CSSProperties = {
    opacity: 1,
    transform: "translate3d(0,0,0)",
    transition: `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`,
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={isVisible ? visibleStyle : hiddenStyle}
    >
      {children}
    </div>
  );
}
