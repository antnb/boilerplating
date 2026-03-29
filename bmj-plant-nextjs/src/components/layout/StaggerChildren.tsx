"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { Children, type ReactNode, type CSSProperties } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface StaggerChildrenProps {
  children: ReactNode;
  stagger?: number;
  duration?: number;
  direction?: Direction;
  className?: string;
  distance?: number;
}

const dirMap: Record<Direction, (d: number) => string> = {
  up: (d) => `translateY(${d}px)`,
  down: (d) => `translateY(${-d}px)`,
  left: (d) => `translateX(${-d}px)`,
  right: (d) => `translateX(${d}px)`,
  none: () => "none",
};

export function StaggerChildren({
  children,
  stagger = 0.1,
  duration = 0.7,
  direction = "up",
  className,
  distance = 32,
}: StaggerChildrenProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.04,
    rootMargin: "0px 0px -60px 0px",
  });

  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <div ref={ref} className={cn(className)}>
      {Children.map(children, (child, i) => {
        const delay = i * stagger;
        const style: CSSProperties = isVisible
          ? {
              opacity: 1,
              transform: "translate3d(0,0,0)",
              transition: `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`,
            }
          : {
              opacity: 0,
              transform: dirMap[direction](distance),
              transition: `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`,
              willChange: "opacity, transform",
            };

        return (
          <div style={style} key={i}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
