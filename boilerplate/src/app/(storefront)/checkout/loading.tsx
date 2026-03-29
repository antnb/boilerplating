/** Checkout loading — reflects order summary + form layout */
export default function Loading() {
    return (
        <div className="container-page py-8 max-w-4xl mx-auto">
            {/* Heading */}
            <div className="animate-pulse bg-muted rounded h-8 w-40 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left: form fields */}
                <div className="md:col-span-3 space-y-6">
                    {/* Address section */}
                    <div className="animate-pulse rounded-xl border border-border bg-card p-6 space-y-4">
                        <div className="h-5 bg-muted rounded w-36" />
                        <div className="h-20 bg-muted rounded" />
                    </div>

                    {/* Payment method */}
                    <div className="animate-pulse rounded-xl border border-border bg-card p-6 space-y-4">
                        <div className="h-5 bg-muted rounded w-44" />
                        <div className="space-y-3">
                            <div className="h-12 bg-muted rounded-lg" />
                            <div className="h-12 bg-muted rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Right: order summary */}
                <div className="md:col-span-2">
                    <div className="animate-pulse rounded-xl border border-border bg-card p-6 space-y-4">
                        <div className="h-5 bg-muted rounded w-32" />
                        <div className="space-y-3">
                            <div className="h-16 bg-muted rounded" />
                            <div className="h-16 bg-muted rounded" />
                        </div>
                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-6 bg-muted rounded w-2/3" />
                        </div>
                        <div className="h-12 bg-muted rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
