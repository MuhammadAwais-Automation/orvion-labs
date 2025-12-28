'use client'

import { motion } from 'framer-motion'
import { Activity, BarChart, Coins, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardsProps {
    totalRuns: number
    avgPassRate: number
    credits: number
    runsTrend: number
}

export function StatsCards({
    totalRuns,
    avgPassRate,
    credits,
    runsTrend
}: StatsCardsProps) {
    const stats = [
        {
            title: 'Total Test Runs',
            value: totalRuns.toString(),
            icon: Activity,
            trend: runsTrend,
            trendText: runsTrend === 0
                ? 'No change from last week'
                : `${runsTrend > 0 ? '+' : ''}${runsTrend}% from last week`,
            color: 'cyan'
        },
        {
            title: 'Avg. Pass Rate',
            value: `${avgPassRate.toFixed(1)}%`,
            icon: BarChart,
            status: avgPassRate >= 70 ? 'Stable performance' : avgPassRate > 0 ? 'Needs attention' : 'No data yet',
            color: 'purple'
        },
        {
            title: 'Credits Remaining',
            value: credits.toString(),
            icon: Coins,
            status: credits < 10 ? 'Low balance' : credits < 50 ? 'Running low' : 'Sufficient',
            color: credits < 10 ? 'red' : credits < 50 ? 'amber' : 'green',
            pulse: credits < 10
        }
    ]

    const colorMap: Record<string, string> = {
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        red: 'text-red-400 bg-red-500/10 border-red-500/20'
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon

                return (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500">
                                    {stat.title}
                                </CardTitle>
                                <div className={cn(
                                    "p-2 rounded-xl transition-all duration-300",
                                    stat.color === 'cyan' ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" :
                                        stat.color === 'purple' ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" :
                                            stat.color === 'amber' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                                stat.color === 'red' ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                                                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                )}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-2">
                                <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 tabular-nums">
                                    {stat.value}
                                </div>
                                {stat.trend !== undefined && (
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${stat.trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        <div className={cn(
                                            "flex items-center justify-center w-5 h-5 rounded-full",
                                            stat.trend >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"
                                        )}>
                                            {stat.trend >= 0 ? (
                                                <TrendingUp className="w-3 h-3" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3" />
                                            )}
                                        </div>
                                        <span>{stat.trendText}</span>
                                    </div>
                                )}
                                {stat.status && stat.trend === undefined && (
                                    <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 flex items-center gap-2">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            stat.color === 'green' ? "bg-emerald-500" :
                                                stat.color === 'red' ? "bg-red-500 animate-pulse" :
                                                    stat.color === 'amber' ? "bg-amber-500" :
                                                        "bg-slate-300 dark:bg-zinc-700",
                                            stat.pulse && "animate-pulse"
                                        )} />
                                        {stat.status}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </div>
    )
}
