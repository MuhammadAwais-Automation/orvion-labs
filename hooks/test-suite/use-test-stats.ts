'use client'

import { useMemo } from 'react'
import { TestResult, TestStats } from './types'

/**
 * useTestStats - Pure Derived Calculations
 * 
 * Responsibility: Calculate pass rate, avg latency, and counts from results.
 * No side effects, no API calls, just pure computation.
 */
export function useTestStats(results: Map<string, TestResult>): TestStats {
    return useMemo(() => {
        const completedCount = results.size

        if (completedCount === 0) {
            return {
                passRate: null,
                avgLatency: null,
                completedCount: 0,
                passedCount: 0
            }
        }

        const resultsArray = Array.from(results.values())
        const passedCount = resultsArray.filter(r => r.status === 'success').length
        const passRate = Math.round((passedCount / completedCount) * 100)
        const avgLatency = Math.round(
            resultsArray.reduce((acc, r) => acc + (r.latency_ms || 0), 0) / completedCount
        )

        return {
            passRate,
            avgLatency,
            completedCount,
            passedCount
        }
    }, [results])
}
