'use client'

import { motion } from 'framer-motion'
import { Activity, BarChart, Layers, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardsProps {
    totalRuns: number
    avgPassRate: number
    activeProjects: number
    recentlyUpdated: number
    runsTrend?: number // Percentage change
}

export function StatsCards({
    totalRuns,
    avgPassRate,
    activeProjects,
    recentlyUpdated,
    runsTrend = 12
}: StatsCardsProps) {
    const stats = [
        {
            title: 'Total Test Runs',
            value: totalRuns.toString(),
            icon: Activity,
            trend: runsTrend,
            trendText: `${runsTrend > 0 ? '+' : ''}${runsTrend}% from last week`,
            color: 'cyan'
        },
        {
            title: 'Avg. Pass Rate',
            value: `${avgPassRate.toFixed(1)}%`,
            icon: BarChart,
            status: avgPassRate >= 70 ? 'Stable performance' : 'Needs attention',
            color: 'purple'
        },
        {
            title: 'Active Projects',
            value: activeProjects.toString(),
            icon: Layers,
            status: `${recentlyUpdated} updated recently`,
            color: 'blue'
        },
        {
            title: 'System Health',
            value: '98% Uptime',
            icon: CheckCircle,
            status: 'All Systems Operational',
            color: 'green',
            pulse: true
        }
    ]

    const colorMap: Record<string, string> = {
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                const colorClass = colorMap[stat.color]

                return (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-white/80 dark:bg-zinc-900/50 border-gray-200 dark:border-white/5 backdrop-blur-md hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 shadow-sm hover:shadow-lg group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg border bg-opacity-20 dark:bg-opacity-10 group-hover:bg-opacity-30 transition-all duration-300 ${colorClass}`}>
                                    <Icon className="w-4 h-4" />
                                    {stat.pulse && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </div>
                                {stat.trend !== undefined && (
                                    <div className={`flex items-center gap-1 text-sm ${stat.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {stat.trend >= 0 ? (
                                            <TrendingUp className="w-3 h-3" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3" />
                                        )}
                                        <span>{stat.trendText}</span>
                                    </div>
                                )}
                                {stat.status && (
                                    <p className="text-sm text-gray-500">
                                        {stat.status}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </div>
    )
}
