'use client'

import { TrendingUp } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { formatChartDate, chartTooltipStyle } from '../types'
import type { UsageTrendItem } from '../types'

interface UsageChartProps {
    data: UsageTrendItem[]
}

export function UsageChart({ data }: UsageChartProps) {
    return (
        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] shadow-sm rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                Tests Run Per Day
            </h3>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/[0.05]" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatChartDate}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                        />
                        <Tooltip
                            contentStyle={chartTooltipStyle}
                            labelFormatter={formatChartDate}
                        />
                        <Area
                            type="monotone"
                            dataKey="tests"
                            stroke="#06b6d4"
                            strokeWidth={3}
                            fill="url(#usageGradient)"
                            activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
