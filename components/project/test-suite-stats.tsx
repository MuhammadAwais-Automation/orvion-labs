import { ListChecks, Activity, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TestSuiteStatsProps {
    totalTests: number
    passRate: number | null
    avgLatency: number | null
}

export function TestSuiteStats({ totalTests, passRate, avgLatency }: TestSuiteStatsProps) {
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
