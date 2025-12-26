'use client'

import { useState, useEffect } from 'react'
import {
    TestCase,
    TestResult,
    useTestExecution,
    useTestCases,
    useTestStats
} from './test-suite'

/**
 * useTestSuite - Composition Root (Facade)
 * 
 * This hook composes 3 atomic hooks into a single interface for backward compatibility.
 * It delegates all responsibilities to specialized sub-hooks:
 * 
 * - useTestExecution: Run tests, Realtime subscriptions, session restore
 * - useTestCases: CRUD operations (add, update, delete, import)
 * - useTestStats: Pure derived stats (pass rate, avg latency)
 * 
 * REFACTORED: Reduced from 279 lines to ~60 lines by extracting logic.
 */

interface UseTestSuiteProps {
    projectId: string
    initialTestCases: TestCase[]
}

export function useTestSuite({ projectId, initialTestCases }: UseTestSuiteProps) {
    const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases)
    const [searchQuery, setSearchQuery] = useState('')

    // Sync testCases when initialTestCases change
    useEffect(() => {
        setTestCases(initialTestCases)
    }, [initialTestCases])

    // Compose atomic hooks
    const {
        results,
        isRunning,
        isRestoring,
        progress,
        handleRunTests
    } = useTestExecution(projectId, testCases)

    const {
        handleAddTestCase,
        handleUpdateTestCase,
        handleImportTests,
        handleDeleteTestCase: deleteCase
    } = useTestCases(projectId)

    const { passRate, avgLatency } = useTestStats(results)

    // Wrapper for delete to update local state
    const handleDeleteTestCase = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Delete this test case?')) return

        const success = await deleteCase(id)
        if (success) {
            setTestCases(testCases.filter((tc) => tc.id !== id))
        }
    }

    // Filtered test cases based on search
    const filteredTestCases = testCases.filter(tc =>
        tc.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tc.expected_output && tc.expected_output.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return {
        testCases,
        filteredTestCases,
        results,
        isRunning,
        isRestoring,
        searchQuery,
        setSearchQuery,
        progress,
        passRate,
        avgLatency,
        handleRunTests,
        handleAddTestCase,
        handleUpdateTestCase,
        handleImportTests,
        handleDeleteTestCase
    }
}

// Re-export types for consumers
export type { TestCase, TestResult }
