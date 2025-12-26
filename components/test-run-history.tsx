'use client'

import { useState, useEffect } from 'react'
import { History, ChevronDown, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { getTestRunHistory, getTestResults } from '@/app/actions'
import { TestResult } from '@/hooks/test-suite'

interface TestRun {
    id: string
    status: string
    total_cases: number
    passed_cases: number
    failed_cases: number
    created_at: string
    model: string
}

interface TestRunHistoryProps {
    projectId: string
    currentRunId?: string
    onRunSelected: (results: TestResult[]) => void
}

export function TestRunHistory({ projectId, currentRunId, onRunSelected }: TestRunHistoryProps) {
    const [runs, setRuns] = useState<TestRun[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingResults, setIsLoadingResults] = useState(false)
    const [selectedRunId, setSelectedRunId] = useState<string | undefined>(currentRunId)

    // Fetch run history on mount
    useEffect(() => {
        async function fetchHistory() {
            setIsLoading(true)
            const result = await getTestRunHistory(projectId, 10)
            if (result.success && result.runs) {
                setRuns(result.runs)
            }
            setIsLoading(false)
        }
        fetchHistory()
    }, [projectId])

    const handleSelectRun = async (runId: string) => {
        setSelectedRunId(runId)
        setIsLoadingResults(true)

        const result = await getTestResults(runId)
        if (result.success && result.results) {
            onRunSelected(result.results)
        }
        setIsLoadingResults(false)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const selectedRun = runs.find(r => r.id === selectedRunId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs h-8 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                    disabled={isLoading || isLoadingResults}
                >
                    {isLoadingResults ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <History className="w-3 h-3" />
                    )}
                    {selectedRun ? (
                        <span>
                            {selectedRun.passed_cases}/{selectedRun.total_cases} passed
                        </span>
                    ) : (
                        <span>Run History</span>
                    )}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700" align="end">
                <DropdownMenuLabel className="text-xs text-gray-400">
                    Previous Test Runs
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />

                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                ) : runs.length === 0 ? (
                    <div className="text-xs text-gray-500 py-4 text-center">
                        No test runs yet
                    </div>
                ) : (
                    runs.map((run) => (
                        <DropdownMenuItem
                            key={run.id}
                            onClick={() => handleSelectRun(run.id)}
                            className={`flex items-center justify-between py-2 cursor-pointer ${run.id === selectedRunId ? 'bg-gray-800' : ''
                                }`}
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs text-gray-300">
                                    {formatDate(run.created_at)}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    {run.model}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {run.status === 'completed' ? (
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span className="text-xs text-green-400">
                                            {run.passed_cases}/{run.total_cases}
                                        </span>
                                    </div>
                                ) : run.status === 'processing' ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                                ) : (
                                    <XCircle className="w-3 h-3 text-red-500" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
