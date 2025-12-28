// Shared types for analytics components

export type DateRange = '7d' | '30d' | '90d' | 'all'

export interface AnalyticsSummary {
    totalRuns: number
    totalTests: number
    totalCost: number
    avgLatency: number
}

export interface UsageTrendItem {
    date: string
    tests: number
}

export interface CostAnalysisItem {
    date: string
    cost: number
}

export interface LatencyTrendItem {
    date: string
    avgLatency: number
}

export interface SlowestTest {
    caseId: string
    input: string
    latencyMs: number
    status: 'success' | 'error'
}

export interface AnalyticsData {
    usageTrend: UsageTrendItem[]
    costAnalysis: CostAnalysisItem[]
    latencyTrend: LatencyTrendItem[]
    slowestTests: SlowestTest[]
    summary: AnalyticsSummary
}

// Format date for chart tooltips
export const formatChartDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Chart tooltip style (shared across all charts)
export const chartTooltipStyle = {
    backgroundColor: '#0f172a',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
}

// Convert DateRange to daysBack number
export const getDaysBack = (range: DateRange): number => {
    switch (range) {
        case '7d': return 7
        case '30d': return 30
        case '90d': return 90
        case 'all': return 365
        default: return 30
    }
}
