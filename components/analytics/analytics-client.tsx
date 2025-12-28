'use client'

import { useEffect, useState } from 'react'
import { getProjectAnalytics } from '@/app/actions'
import { BarChart3, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Import Lego Block components
import { SummaryCards } from './summary-cards'
import { SlowestTestsTable } from './slowest-tests-table'
import { UsageChart, CostChart, LatencyChart } from './charts'
import { getDaysBack, type DateRange, type AnalyticsData } from './types'

interface AnalyticsClientProps {
    projectId: string
    projectName: string
}

export function AnalyticsClient({ projectId, projectName }: AnalyticsClientProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [selectedRange, setSelectedRange] = useState<DateRange>('30d')

    const fetchData = async (range: DateRange) => {
        setLoading(true)
        const result = await getProjectAnalytics(projectId, {
            daysBack: getDaysBack(range)
        })
        if (result.success) {
            setData(result as unknown as AnalyticsData)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData(selectedRange)
    }, [projectId, selectedRange])

    // Loading state
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

    // Error state
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

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#09090b] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-8 md:w-10 h-8 md:h-10 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                                <BarChart3 className="w-4 md:w-5 h-4 md:h-5" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Project Analytics</h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-500 font-medium text-xs md:text-sm ml-1">
                            {projectName} • Last {selectedRange === 'all' ? 'year' : selectedRange.replace('d', ' days')}
                        </p>
                    </div>

                    {/* Date Range Picker */}
                    <DateRangePicker
                        selectedRange={selectedRange}
                        onRangeChange={setSelectedRange}
                    />
                </div>
            </div>

            {/* Scrollable Content - Composed from Lego Blocks */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 md:pb-8 scrollbar-thin-hover">
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <SummaryCards summary={summary} />

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UsageChart data={usageTrend} />
                        <CostChart data={costAnalysis} />
                        <LatencyChart data={latencyTrend} />
                        <SlowestTestsTable tests={slowestTests} />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Date Range Picker - Extracted for clarity
function DateRangePicker({
    selectedRange,
    onRangeChange
}: {
    selectedRange: DateRange
    onRangeChange: (range: DateRange) => void
}) {
    return (
        <div className="flex items-center gap-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-1 rounded-2xl shadow-sm w-full md:w-auto overflow-x-auto">
            {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                <Button
                    key={range}
                    variant="ghost"
                    size="sm"
                    onClick={() => onRangeChange(range)}
                    className={cn(
                        "text-[10px] font-bold uppercase tracking-widest h-9 px-3 md:px-4 rounded-xl transition-all flex-1 md:flex-none",
                        selectedRange === range
                            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                    )}
                >
                    {range === 'all' ? 'All' : range}
                </Button>
            ))}
        </div>
    )
}
