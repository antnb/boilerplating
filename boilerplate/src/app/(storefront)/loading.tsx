/** Storefront root loading — reflects Hero + CatalogSection grid */
export default function Loading() {
    return (
        <div className="container-page page-sections">
            {/* Hero skeleton */}
            <div className="animate-pulse rounded-2xl bg-muted h-[420px] mb-8" />

            {/* Trust strip */}
            <div className="flex gap-4 justify-center mb-12">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-lg h-10 w-32" />
                ))}
            </div>

            {/* Catalog heading */}
            <div className="animate-pulse bg-muted rounded h-8 w-64 mx-auto mb-8" />

            {/* Product grid - 4 cols */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-xl bg-muted">
                        <div className="aspect-square rounded-t-xl bg-muted" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-muted-foreground/10 rounded w-3/4" />
                            <div className="h-3 bg-muted-foreground/10 rounded w-1/2" />
                            <div className="h-5 bg-muted-foreground/10 rounded w-1/3 mt-2" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Section skeletons */}
            <div className="space-y-12">
                <div className="animate-pulse bg-muted rounded-2xl h-48" />
                <div className="animate-pulse bg-muted rounded-2xl h-48" />
            </div>
        </div>
    );
}
