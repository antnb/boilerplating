import { cn } from "@/shared/lib/utils";

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

/**
 * Centralized Material Symbols Outlined icon component.
 * Replaces raw <span className="material-symbols-outlined"> across PDP.
 */
const MaterialIcon = ({ name, className, filled = false, size = 20 }: MaterialIconProps) => {
  return (
    <span
      className={cn("material-symbols-outlined leading-none select-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default MaterialIcon;
