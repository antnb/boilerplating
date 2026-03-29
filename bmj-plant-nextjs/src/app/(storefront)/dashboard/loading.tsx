/** Buyer dashboard loading — reflects profile card + tabs with content */
export default function Loading() {
    return (
        <div className="container-page py-8 max-w-5xl mx-auto">
            {/* Profile card */}
            <div className="animate-pulse rounded-2xl border border-border bg-card p-6 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-5 bg-muted rounded w-40" />
                    <div className="h-3 bg-muted rounded w-56" />
                    <div className="h-3 bg-muted rounded w-32" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-lg h-10 w-28" />
                ))}
            </div>

            {/* Tab content — order cards */}
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-48" />
                            <div className="h-3 bg-muted rounded w-32" />
                            <div className="h-3 bg-muted rounded w-24" />
                        </div>
                        <div className="h-8 bg-muted rounded-lg w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}
