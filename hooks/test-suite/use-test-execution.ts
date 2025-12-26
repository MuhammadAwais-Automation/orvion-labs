'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { createTestRun, runBatchTests, getLatestTestRun } from '@/app/actions'
import { TestCase, TestResult, TestRunState } from './types'
import { RealtimeChannel } from '@supabase/supabase-js'

/**
 * useTestExecution - Test Run Orchestration
 * 
 * Responsibility: Handle test execution, Realtime subscriptions, and session restore.
 * This is the "run engine" of the test suite.
 * 
 * FIXED: Added subscription cleanup to prevent memory leaks.
 */
export function useTestExecution(projectId: string, testCases: TestCase[]) {
    const router = useRouter()
    const supabase = createClient()

    const [results, setResults] = useState<Map<string, TestResult>>(new Map())
    const [isRunning, setIsRunning] = useState(false)
    const [isRestoring, setIsRestoring] = useState(true)
    const [progress, setProgress] = useState({ current: 0, total: 0 })

    // Track active channels for cleanup
    const activeChannelsRef = useRef<RealtimeChannel[]>([])

    // Cleanup function to remove all active channels
    const cleanupChannels = useCallback(() => {
        activeChannelsRef.current.forEach(channel => {
            supabase.removeChannel(channel)
        })
        activeChannelsRef.current = []
    }, [supabase])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupChannels()
        }
    }, [cleanupChannels])


    // Restore previous session results on mount
    useEffect(() => {
        let isMounted = true

        async function restoreSession() {
            try {
                if (results.size > 0) {
                    setIsRestoring(false)
                    return
                }

                const { success, results: previousResults } = await getLatestTestRun(projectId)
                if (!isMounted) return

                if (success && previousResults && previousResults.length > 0) {
                    const newResultsMap = new Map<string, TestResult>()
                    previousResults.forEach((r: any) => {
                        newResultsMap.set(r.case_id, r)
                    })
                    setResults(newResultsMap)
                }
            } catch (error) {
                console.error('Failed to restore session:', error)
            } finally {
                if (isMounted) setIsRestoring(false)
            }
        }

        restoreSession()
        return () => { isMounted = false }
    }, [projectId])

    const handleRunTests = useCallback(async () => {
        // Guard against duplicate runs
        if (isRunning) {
            toast.warning('A test run is already in progress')
            return
        }

        if (testCases.length === 0) {
            toast.error('No test cases to run')
            return
        }

        // Cleanup any existing channels before starting new run
        cleanupChannels()

        setIsRunning(true)
        setResults(new Map())
        const totalCases = testCases.length
        setProgress({ current: 0, total: totalCases })


        try {
            const runResult = await createTestRun(projectId)
            if (!runResult.success || !runResult.runId) {
                toast.error(runResult.error || 'Failed to create test run')
                setIsRunning(false)
                return
            }

            const { runId, testCaseIds } = runResult

            if (!testCaseIds || testCaseIds.length === 0) {
                toast.error('No test cases found')
                setIsRunning(false)
                return
            }

            // --- REALTIME SUBSCRIPTION ---
            // 1. Listen for new results
            const resultsChannel = supabase
                .channel(`results-${runId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'test_results',
                        filter: `run_id=eq.${runId}`
                    },
                    (payload) => {
                        const r = payload.new as any
                        setResults(prev => {
                            const newMap = new Map(prev)
                            newMap.set(r.case_id, {
                                id: r.id,
                                case_id: r.case_id,
                                actual_output: r.actual_output,
                                expected_output: r.expected_output,
                                status: r.status,
                                latency_ms: r.latency_ms,
                                tokens_used: r.tokens_used,
                                error_message: r.error_message,
                                total_cost: r.total_cost,
                                generation_cost: r.generation_cost,
                                judge_cost: r.judge_cost
                            })
                            setProgress({ current: newMap.size, total: totalCases })
                            return newMap
                        })
                    }
                )
                .subscribe()

            // Track channels for cleanup
            activeChannelsRef.current.push(resultsChannel)

            const runChannel = supabase
                .channel(`run-status-${runId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'test_runs',
                        filter: `id=eq.${runId}`
                    },
                    (payload) => {
                        if (payload.new.status === 'completed') {
                            setIsRunning(false)
                            toast.success(`Completed! ${payload.new.passed_cases} passed, ${payload.new.failed_cases} failed`)
                            supabase.removeChannel(resultsChannel)
                            supabase.removeChannel(runChannel)
                            router.refresh()
                        }
                    }
                )
                .subscribe()

            // Track runChannel for cleanup
            activeChannelsRef.current.push(runChannel)

            // Trigger background execution via Inngest
            const triggerResult = await runBatchTests(projectId, testCaseIds, runId)
            if (!triggerResult.success) {
                toast.error(triggerResult.error || 'Failed to trigger background tests')
                setIsRunning(false)
                supabase.removeChannel(resultsChannel)
                supabase.removeChannel(runChannel)
                return
            }

            toast.info('Test run started. Results will stream in...')

        } catch (error) {
            console.error('Test run error:', error)
            toast.error('Failed to run tests')
            setIsRunning(false)
            setProgress({ current: 0, total: 0 })
        }
    }, [projectId, testCases, supabase, router])

    return {
        results,
        setResults,
        isRunning,
        isRestoring,
        progress,
        handleRunTests
    }
}
