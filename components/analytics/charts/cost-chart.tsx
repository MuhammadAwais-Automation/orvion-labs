'use client'

import { Zap } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { formatChartDate, chartTooltipStyle } from '../types'
import type { CostAnalysisItem } from '../types'

interface CostChartProps {
    data: CostAnalysisItem[]
}

export function CostChart({ data }: CostChartProps) {
    return (
        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] shadow-sm rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                AI Usage Per Day
            </h3>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
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
                        <Bar
                            dataKey="cost"
                            fill="#f59e0b"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
