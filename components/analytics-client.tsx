'use client'

import { useEffect, useState } from 'react'
import { getProjectAnalytics } from '@/app/actions'
import { cn } from '@/lib/utils'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import {
    Activity,
    Zap,
    Clock,
    TrendingUp,
    AlertTriangle,
    BarChart3,
    Loader2,
    Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface AnalyticsClientProps {
    projectId: string
    projectName: string
}

type DateRange = '7d' | '30d' | '90d' | 'all'

export function AnalyticsClient({ projectId, projectName }: AnalyticsClientProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [selectedRange, setSelectedRange] = useState<DateRange>('30d')

    // Get daysBack based on selected range
    const getDaysBack = (range: DateRange): number | undefined => {
        switch (range) {
            case '7d': return 7
            case '30d': return 30
            case '90d': return 90
            case 'all': return 365 // Max 1 year
            default: return 30
        }
    }

    const fetchData = async (range: DateRange) => {
        setLoading(true)
        const result = await getProjectAnalytics(projectId, {
            daysBack: getDaysBack(range)
        })
        if (result.success) {
            setData(result)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData(selectedRange)
    }, [projectId, selectedRange])

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-white dark:bg-[#09090b]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                    <p className="text-slate-400">Loading analytics...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="h-full flex items-center justify-center bg-white dark:bg-[#09090b]">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <AlertTriangle className="w-8 h-8" />
                    <p>Failed to load analytics</p>
                </div>
            </div>
        )
    }

    const { usageTrend, costAnalysis, latencyTrend, slowestTests, summary } = data

    // Format date for chart tooltips
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#09090b] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Project Analytics</h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-500 font-medium text-sm ml-1">
                            {projectName} • Last {selectedRange === 'all' ? 'year' : selectedRange.replace('d', ' days')}
                        </p>
                    </div>

                    {/* Date Range Picker - Pill Style */}
                    <div className="flex items-center gap-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-1 rounded-2xl shadow-sm">
                        {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                            <Button
                                key={range}
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRange(range)}
                                className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest h-9 px-4 rounded-xl transition-all",
                                    selectedRange === range
                                        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                                )}
                            >
                                {range === 'all' ? 'All' : range}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-thin-hover">
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SummaryCard
                            icon={<Activity className="w-5 h-5" />}
                            label="Total Runs"
                            value={summary.totalRuns}
                            variant="cyan"
                        />
                        <SummaryCard
                            icon={<TrendingUp className="w-5 h-5" />}
                            label="Tests Executed"
                            value={summary.totalTests}
                            variant="emerald"
                        />
                        <SummaryCard
                            icon={<Zap className="w-5 h-5" />}
                            label="AI Usage"
                            value={summary.totalCost}
                            variant="amber"
                        />
                        <SummaryCard
                            icon={<Clock className="w-5 h-5" />}
                            label="Avg Latency"
                            value={`${summary.avgLatency}ms`}
                            variant="purple"
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Usage Trend - Line Chart */}
                        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] shadow-sm rounded-2xl p-6">
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-cyan-500" />
                                Tests Run Per Day
                            </h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={usageTrend}>
                                        <defs>
                                            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/[0.05]" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={formatDate}
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
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                            labelFormatter={formatDate}
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

                        {/* Cost Analysis - Bar Chart */}
                        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] shadow-sm rounded-2xl p-6">
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                AI Usage Per Day
                            </h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={costAnalysis}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/[0.05]" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={formatDate}
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
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                            labelFormatter={formatDate}
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

                        {/* Latency Trend - Area Chart */}
                        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] shadow-sm rounded-2xl p-6">
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-500" />
                                Average Latency Trend
                            </h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={latencyTrend}>
                                        <defs>
                                            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/[0.05]" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={formatDate}
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
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                            labelFormatter={formatDate}
                                            formatter={(value: number) => [`${value}ms`, 'Avg Latency']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="avgLatency"
                                            stroke="#a855f7"
                                            strokeWidth={3}
                                            fill="url(#latencyGradient)"
                                            activeDot={{ r: 6, fill: '#a855f7', strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Slowest Tests Table */}
                        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] shadow-sm rounded-2xl p-6">
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                Slowest Test Cases
                            </h3>
                            {slowestTests.length === 0 ? (
                                <div className="h-[280px] flex items-center justify-center text-slate-400 font-medium">
                                    No test data available
                                </div>
                            ) : (
                                <div className="h-[280px] overflow-y-auto pr-2 scrollbar-thin-hover">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-slate-100 dark:border-white/[0.05] hover:bg-transparent">
                                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Input</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-[100px]">Latency</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-[80px]">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {slowestTests.map((test: any, idx: number) => (
                                                <TableRow key={idx} className="border-slate-50 dark:border-white/[0.02] hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="font-mono text-[11px] text-slate-600 dark:text-slate-400 max-w-[200px] truncate py-4">
                                                        {test.input}
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className={cn(
                                                            "text-[11px] font-bold tabular-nums px-2 py-1 rounded-lg",
                                                            test.latencyMs > 3000 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                                test.latencyMs > 1000 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        )}>
                                                            {test.latencyMs}ms
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right">
                                                        <Badge
                                                            className={cn(
                                                                "text-[9px] font-black px-2 py-0.5 rounded-md border-0 shadow-none",
                                                                test.status === 'success'
                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                            )}
                                                        >
                                                            {test.status === 'success' ? 'PASS' : 'FAIL'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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
