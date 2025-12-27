'use client'

import { ListChecks, Activity, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-media-query'
import { Card, CardContent } from '@/components/ui/card'

interface TestSuiteStatsProps {
    totalTests: number
    passRate: number | null
    avgLatency: number | null
}

export function TestSuiteStats({ totalTests, passRate, avgLatency }: TestSuiteStatsProps) {
    const isMobile = useIsMobile()

    // Mobile: Compact inline stats
    if (isMobile) {
        return (
            <div className="bg-white/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl p-3">
                <div className="flex items-center justify-around">
                    {/* Total Tests */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                            <ListChecks className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">{totalTests}</span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Tests</span>
                    </div>

                    <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />

                    {/* Pass Rate */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                            {passRate !== null ? `${passRate}%` : '—'}
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Pass</span>
                    </div>

                    <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />

                    {/* Avg Latency */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                            {avgLatency !== null ? `${avgLatency}` : '—'}
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">ms</span>
                    </div>
                </div>
            </div>
        )
    }

    // Desktop: Original card layout
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <ListChecks className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">Total Tests</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{totalTests}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">Pass Rate</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                            {passRate !== null ? `${passRate}%` : '—'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">Avg Latency</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                            {avgLatency !== null ? `${avgLatency}ms` : '—'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
