'use client'

/**
 * TestRunnerView - Pure Presentational Component
 * 
 * This component renders the test runner UI without managing any state.
 * All data and handlers are passed via props from the parent.
 * 
 * Used with: useTestExecution hook from @/hooks/test-suite
 */

import { Play, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TestCase, TestResult } from '@/hooks/test-suite'
import { TestRunHistory } from '@/components/test-run-history'

export interface TestRunnerViewProps {
    projectId: string
    testCases: TestCase[]
    results: Map<string, TestResult>
    isRunning: boolean
    isRestoring: boolean
    progress: { current: number; total: number }
    passRate: number | null
    avgLatency: number | null
    onRunTests: () => void
    onHistoricalResultsLoaded?: (results: TestResult[]) => void
}

export function TestRunnerView({
    projectId,
    testCases,
    results,
    isRunning,
    isRestoring,
    progress,
    passRate,
    avgLatency,
    onRunTests,
    onHistoricalResultsLoaded
}: TestRunnerViewProps) {
    const resultsArray = Array.from(results.values())
    const hasResults = resultsArray.length > 0

    return (
        <div className="space-y-6">
            {/* Stats Header */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Total Tests</p>
                    <p className="text-2xl font-bold text-white">{testCases.length}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Pass Rate</p>
                    <p className="text-2xl font-bold text-green-400">
                        {passRate !== null ? `${passRate}%` : '—'}
                    </p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Avg Latency</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {avgLatency !== null ? `${avgLatency}ms` : '—'}
                    </p>
                </div>
            </div>

            {/* Run Button */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={onRunTests}
                    disabled={isRunning || testCases.length === 0}
                    className="gap-2"
                    size="lg"
                >
                    {isRunning ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Running ({progress.current}/{progress.total})
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            Run All Tests ({testCases.length})
                        </>
                    )}
                </Button>

                {isRestoring && (
                    <span className="text-sm text-gray-400">
                        <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                        Restoring previous session...
                    </span>
                )}

                {/* Test Run History Dropdown */}
                {onHistoricalResultsLoaded && (
                    <TestRunHistory
                        projectId={projectId}
                        onRunSelected={onHistoricalResultsLoaded}
                    />
                )}
            </div>

            {/* Results Table */}
            {hasResults && (
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Input</TableHead>
                                <TableHead className="w-[200px]">Expected</TableHead>
                                <TableHead>Actual Output</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[100px]">Latency</TableHead>
                                <TableHead className="w-[80px]">Tokens</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resultsArray.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-mono text-sm max-w-[200px] truncate">
                                        {testCases.find(tc => tc.id === result.case_id)?.input_text || '—'}
                                    </TableCell>
                                    <TableCell className="text-sm max-w-[200px] truncate text-gray-400">
                                        {result.expected_output || '—'}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm max-w-md">
                                        <div className="max-h-20 overflow-y-auto">
                                            {result.actual_output || (
                                                <span className="text-red-400">{result.error_message}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {result.status === 'success' ? (
                                            <div className="flex items-center gap-2 text-green-400">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Pass</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-400">
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Fail</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {result.latency_ms ? (
                                            <div className={`flex items-center gap-1 text-xs font-semibold ${result.latency_ms < 1000
                                                ? 'text-green-400'
                                                : result.latency_ms < 3000
                                                    ? 'text-yellow-400'
                                                    : 'text-red-400'
                                                }`}>
                                                <Clock className="w-3 h-3" />
                                                {result.latency_ms}ms
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-xs">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {result.tokens_used ? (
                                            <span className="text-xs text-gray-400 font-mono">
                                                {result.tokens_used}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-xs">—</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Empty State */}
            {!hasResults && !isRunning && !isRestoring && (
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-12 text-center">
                    <p className="text-gray-400">
                        No results yet. Run tests to see results here.
                    </p>
                </div>
            )}
        </div>
    )
}
