/**
 * Shared skeleton primitives for loading states.
 * Used by all loading.tsx files to ensure consistent skeleton design.
 *
 * These are Server Components (no "use client") — they render
 * immediately without hydration overhead.
 */

/** Generic skeleton block with pulse animation */
export function Skeleton({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`animate-pulse rounded bg-muted ${className}`}
            {...props}
        />
    );
}

/** Product card skeleton — matches ProductCard layout */
export function ProductCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full rounded-md mt-2" />
        </div>
    );
}

/** Breadcrumb skeleton — 3 segments */
export function BreadcrumbSkeleton() {
    return (
        <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-3" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-3" />
            <Skeleton className="h-4 w-32" />
        </div>
    );
}

/** Article hero skeleton — image + title + meta */
export function ArticleHeroSkeleton() {
    return (
        <div className="space-y-4 mb-8">
            <Skeleton className="aspect-[21/9] rounded-lg" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

/** Content block skeleton — simulates text paragraphs */
export function ContentBlockSkeleton({ lines = 5 }: { lines?: number }) {
    // Deterministic width pattern — avoids Math.random() which creates
    // non-deterministic server output and defeats static caching
    const widths = [100, 92, 85, 78, 95, 88, 82, 75, 97, 90];
    return (
        <div className="space-y-3">
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton
                    key={i}
                    className="h-4"
                    style={{ width: `${widths[i % widths.length]}%` }}
                />
            ))}
        </div>
    );
}
