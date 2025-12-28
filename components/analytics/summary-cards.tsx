'use client'

import { Activity, TrendingUp, Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalyticsSummary } from './types'

interface SummaryCardsProps {
    summary: AnalyticsSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
    const cards = [
        {
            icon: <Activity className="w-5 h-5" />,
            label: 'Total Runs',
            value: summary.totalRuns,
            variant: 'cyan' as const
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            label: 'Tests Executed',
            value: summary.totalTests,
            variant: 'emerald' as const
        },
        {
            icon: <Zap className="w-5 h-5" />,
            label: 'AI Usage',
            value: summary.totalCost,
            variant: 'amber' as const
        },
        {
            icon: <Clock className="w-5 h-5" />,
            label: 'Avg Latency',
            value: `${summary.avgLatency}ms`,
            variant: 'purple' as const
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <SummaryCard
                    key={card.label}
                    icon={card.icon}
                    label={card.label}
                    value={card.value}
                    variant={card.variant}
                />
            ))}
        </div>
    )
}

function SummaryCard({ icon, label, value, variant }: {
    icon: React.ReactNode
    label: string
    value: string | number
    variant: 'cyan' | 'emerald' | 'amber' | 'purple'
}) {
    const variants = {
        cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
        emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    }

    return (
        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
            <div className={cn(
                "w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all group-hover:scale-110",
                variants[variant]
            )}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{value}</p>
            </div>
        </div>
    )
}
