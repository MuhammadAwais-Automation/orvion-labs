import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="h-full flex flex-col bg-slate-950 p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-[250px] bg-slate-800" />
                <Skeleton className="h-4 w-[400px] bg-slate-800" />
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column / Main Area */}
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-[400px] w-full rounded-xl bg-slate-900/50" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-[150px] w-full rounded-xl bg-slate-900/50" />
                        <Skeleton className="h-[150px] w-full rounded-xl bg-slate-900/50" />
                    </div>
                </div>

                {/* Right Column / Sidebar Area */}
                <div className="space-y-6">
                    <Skeleton className="h-[200px] w-full rounded-xl bg-slate-900/50" />
                    <Skeleton className="h-[300px] w-full rounded-xl bg-slate-900/50" />
                </div>
            </div>
        </div>
    )
}
