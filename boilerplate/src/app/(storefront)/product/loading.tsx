/** Product listing loading — reflects filter sidebar + product grid */
export default function Loading() {
    return (
        <div className="container-page py-8">
            {/* Breadcrumb */}
            <div className="animate-pulse bg-muted rounded h-4 w-48 mb-6" />

            {/* Title + filters row */}
            <div className="flex items-center justify-between mb-6">
                <div className="animate-pulse bg-muted rounded h-8 w-56" />
                <div className="flex gap-2">
                    <div className="animate-pulse bg-muted rounded-lg h-10 w-24" />
                    <div className="animate-pulse bg-muted rounded-lg h-10 w-24" />
                </div>
            </div>

            {/* Product grid - 3 cols */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
                        <div className="aspect-square rounded-t-xl bg-muted" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                            <div className="h-5 bg-muted rounded w-1/3 mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
