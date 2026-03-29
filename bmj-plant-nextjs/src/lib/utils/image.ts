import type { StaticImageData } from "next/image";

/** Image source type — string URL, static import, or nullish */
export type ImageSrc = string | StaticImageData | { src: string } | undefined | null;

/**
 * Resolves an image source to a URL string.
 * Handles both string URLs and webpack StaticImageData imports.
 *
 * USE THIS everywhere instead of `(x as any)?.src || x`
 */
export function resolveImageSrc(src: ImageSrc): string {
    if (!src) return "";
    if (typeof src === "string") return src;
    if (typeof src === "object" && "src" in src) return src.src;
    return "";
}

/**
 * Generates a placeholder blur data URL for next/image.
 * Uses a tiny SVG with the brand color.
 */
export function getBlurPlaceholder(color = "#1F5038"): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="${color}" width="1" height="1"/></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Constructs a CDN image URL with optimization parameters.
 * TODO: Replace with actual CDN transformation URL pattern.
 */
export function getCdnImageUrl(
    path: string,
    options?: { width?: number; height?: number; quality?: number }
): string {
    const cdn = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.bmjplantstore.com";
    const params = new URLSearchParams();
    if (options?.width) params.set("w", String(options.width));
    if (options?.height) params.set("h", String(options.height));
    if (options?.quality) params.set("q", String(options.quality));
    const query = params.toString();
    return `${cdn}/${path}${query ? `?${query}` : ""}`;
}
