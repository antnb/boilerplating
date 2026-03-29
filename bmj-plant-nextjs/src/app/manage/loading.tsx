/** Admin dashboard loading — reflects sidebar + stat cards + table */
export default function Loading() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="hidden md:block w-56 border-r border-border p-4 space-y-2 shrink-0">
                <div className="animate-pulse bg-muted rounded-lg h-10 w-full mb-6" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted rounded h-9 w-full" />
                ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6 space-y-6">
                {/* Header */}
                <div className="animate-pulse bg-muted rounded h-8 w-48" />

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-5 space-y-2">
                            <div className="h-3 bg-muted rounded w-20" />
                            <div className="h-7 bg-muted rounded w-24" />
                            <div className="h-3 bg-muted rounded w-16" />
                        </div>
                    ))}
                </div>

                {/* Table / content area */}
                <div className="animate-pulse rounded-xl border border-border bg-card p-6 space-y-3">
                    <div className="h-5 bg-muted rounded w-36 mb-4" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="h-4 bg-muted rounded flex-1" />
                            <div className="h-4 bg-muted rounded w-20" />
                            <div className="h-4 bg-muted rounded w-16" />
                            <div className="h-4 bg-muted rounded w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
