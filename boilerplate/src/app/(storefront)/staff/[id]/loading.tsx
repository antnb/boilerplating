export default function StaffProfileLoading() {
    return (
        <div className="container-page py-12 md:py-20">
            <div className="max-w-3xl mx-auto animate-pulse">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-muted" />
                    <div className="space-y-3 text-center md:text-left">
                        <div className="h-8 w-48 bg-muted rounded" />
                        <div className="h-5 w-32 bg-muted rounded" />
                        <div className="h-6 w-24 bg-muted rounded-full" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
            </div>
        </div>
    );
}
