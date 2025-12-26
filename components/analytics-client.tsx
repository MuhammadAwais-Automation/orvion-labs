'use client'

import { useEffect, useState } from 'react'
import { getProjectAnalytics } from '@/app/actions'
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
        <div className="h-full flex flex-col bg-white dark:bg-[#09090b] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-cyan-500" />
                            Project Analytics
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {projectName} • {selectedRange === 'all' ? 'All time' : `Last ${selectedRange.replace('d', ' days')}`}
                        </p>
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                        {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                            <Button
                                key={range}
                                variant={selectedRange === range ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedRange(range)}
                                className={`text-xs h-8 ${selectedRange === range
                                    ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Calendar className="w-3 h-3 mr-1.5" />
                                {range === 'all' ? 'All' : range.replace('d', 'D')}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <SummaryCard
                        icon={<Activity className="w-5 h-5 text-cyan-500" />}
                        label="Total Runs"
                        value={summary.totalRuns}
                        bgColor="bg-cyan-500/10"
                    />
                    <SummaryCard
                        icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                        label="Tests Executed"
                        value={summary.totalTests}
                        bgColor="bg-emerald-500/10"
                    />
                    <SummaryCard
                        icon={<Zap className="w-5 h-5 text-amber-500" />}
                        label="Credits Used"
                        value={summary.totalCost}
                        bgColor="bg-amber-500/10"
                    />
                    <SummaryCard
                        icon={<Clock className="w-5 h-5 text-purple-500" />}
                        label="Avg Latency"
                        value={`${summary.avgLatency}ms`}
                        bgColor="bg-purple-500/10"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Usage Trend - Line Chart */}
                    <div className="bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-cyan-500" />
                            Tests Run Per Day
                        </h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={usageTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDate}
                                        stroke="#666"
                                        fontSize={10}
                                        tick={{ fill: '#666' }}
                                    />
                                    <YAxis stroke="#666" fontSize={10} tick={{ fill: '#666' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '12px'
                                        }}
                                        labelFormatter={formatDate}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="tests"
                                        stroke="#06b6d4"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: '#06b6d4' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Cost Analysis - Bar Chart */}
                    <div className="bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Credits Consumed Per Day
                        </h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={costAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDate}
                                        stroke="#666"
                                        fontSize={10}
                                        tick={{ fill: '#666' }}
                                    />
                                    <YAxis stroke="#666" fontSize={10} tick={{ fill: '#666' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '12px'
                                        }}
                                        labelFormatter={formatDate}
                                    />
                                    <Bar
                                        dataKey="cost"
                                        fill="#f59e0b"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Latency Trend - Area Chart */}
                    <div className="bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-500" />
                            Average Latency Trend
                        </h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={latencyTrend}>
                                    <defs>
                                        <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDate}
                                        stroke="#666"
                                        fontSize={10}
                                        tick={{ fill: '#666' }}
                                    />
                                    <YAxis stroke="#666" fontSize={10} tick={{ fill: '#666' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '12px'
                                        }}
                                        labelFormatter={formatDate}
                                        formatter={(value: number) => [`${value}ms`, 'Avg Latency']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="avgLatency"
                                        stroke="#a855f7"
                                        strokeWidth={2}
                                        fill="url(#latencyGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Slowest Tests Table */}
                    <div className="bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Slowest Test Cases
                        </h3>
                        {slowestTests.length === 0 ? (
                            <div className="h-[250px] flex items-center justify-center text-slate-500">
                                No test data available
                            </div>
                        ) : (
                            <div className="h-[250px] overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="text-slate-400 text-xs">Input</TableHead>
                                            <TableHead className="text-slate-400 text-xs w-[80px]">Latency</TableHead>
                                            <TableHead className="text-slate-400 text-xs w-[60px]">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {slowestTests.map((test: any, idx: number) => (
                                            <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                                                <TableCell className="font-mono text-xs text-slate-300 max-w-[200px] truncate">
                                                    {test.input}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-xs font-mono ${test.latencyMs > 3000 ? 'text-red-400' :
                                                        test.latencyMs > 1000 ? 'text-amber-400' : 'text-emerald-400'
                                                        }`}>
                                                        {test.latencyMs}ms
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] ${test.status === 'success'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            }`}
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
    )
}

function SummaryCard({ icon, label, value, bgColor }: {
    icon: React.ReactNode
    label: string
    value: string | number
    bgColor: string
}) {
    return (
        <div className="bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${bgColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    )
}
