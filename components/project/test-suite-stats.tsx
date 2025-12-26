import { ListChecks, Activity, Clock } from 'lucide-react'

interface TestSuiteStatsProps {
    totalTests: number
    passRate: number | null
    avgLatency: number | null
}

export function TestSuiteStats({ totalTests, passRate, avgLatency }: TestSuiteStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <ListChecks className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Tests</p>
                    <p className="text-2xl font-bold text-white">{totalTests}</p>
                </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pass Rate</p>
                    <p className="text-2xl font-bold text-white">
                        {passRate !== null ? `${passRate}%` : '—'}
                    </p>
                </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Latency</p>
                    <p className="text-2xl font-bold text-white">
                        {avgLatency !== null ? `${avgLatency}ms` : '—'}
                    </p>
                </div>
            </div>
        </div>
    )
}
