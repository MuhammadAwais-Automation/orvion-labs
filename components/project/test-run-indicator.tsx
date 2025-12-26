'use client'

import { Loader2 } from 'lucide-react'

interface TestRunIndicatorProps {
    isRestoring: boolean
}

export function TestRunIndicator({ isRestoring }: TestRunIndicatorProps) {
    if (!isRestoring) return null

    return (
        <div className="absolute top-4 right-4 z-50">
            <div className="bg-[#18181b] border border-cyan-500/20 rounded-lg p-3 flex items-center gap-3 shadow-lg">
                <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                <p className="text-slate-300 text-sm">Loading previous results...</p>
            </div>
        </div>
    )
}
