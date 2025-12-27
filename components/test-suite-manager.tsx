'use client'

import { useState } from 'react'
import {
    Activity,
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ModelConfig } from '@/types/database'

// Hooks
import { useTestSuite, TestCase, TestResult } from '@/hooks/use-test-suite'

// Sub-components
import { TestSuiteStats } from './project/test-suite-stats'
import { TestSuiteTable } from './project/test-suite-table'
import { TestCaseDialogs } from './project/test-case-dialogs'
import { TestSuiteActionsBar } from './project/test-suite-actions-bar'
import { TestRunIndicator } from './project/test-run-indicator'

interface TestSuiteManagerProps {
    projectId: string
    projectName: string
    testCases: TestCase[]
    systemPrompt: string
    modelConfig: ModelConfig
}

export function TestSuiteManager({
    projectId,
    projectName,
    testCases: initialTestCases,
    systemPrompt,
    modelConfig,
}: TestSuiteManagerProps) {
    const {
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
    } = useTestSuite({ projectId, initialTestCases })

    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showImportDialog, setShowImportDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null)
    const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)

    const openDetails = (testCase: TestCase) => {
        setSelectedTestCase(testCase)
        setSelectedResult(results.get(testCase.id) || null)
    }

    return (
        <TooltipProvider>
            <div className="h-full flex flex-col bg-slate-50 dark:bg-[#09090b] overflow-hidden">
                <TestRunIndicator isRestoring={isRestoring} />

                <div className="flex-shrink-0 p-4 md:p-6 space-y-6 md:space-y-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Test Suites</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">Manage and run regression tests for <span className="text-cyan-600 dark:text-cyan-500 font-bold">{projectName}</span></p>
                    </div>

                    <TestSuiteStats
                        totalTests={testCases.length}
                        passRate={passRate}
                        avgLatency={avgLatency}
                    />

                    <TestSuiteActionsBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onAddClick={() => setShowAddDialog(true)}
                        onImportClick={() => setShowImportDialog(true)}
                        onRunClick={handleRunTests}
                        isRunning={isRunning}
                        progress={progress}
                        totalTestCases={testCases.length}
                    />
                </div>

                <div className="flex-1 mx-4 md:mx-6 mb-4 md:mb-6 border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden bg-white dark:bg-[#0c0c0e]/50 flex flex-col min-h-0 shadow-sm dark:shadow-none">

                    <div className="flex-1 overflow-y-auto scrollbar-thin-hover">
                        <TestSuiteTable
                            filteredTestCases={filteredTestCases}
                            results={results}
                            isRunning={isRunning}
                            searchQuery={searchQuery}
                            onEditClick={(tc, e) => {
                                setSelectedTestCase(tc)
                                setShowEditDialog(true)
                            }}
                            onDeleteClick={handleDeleteTestCase}
                            onRowClick={openDetails}
                        />
                    </div>
                </div>

                {/* Details Sheet */}
                <Sheet open={!!selectedTestCase && !showEditDialog && !showAddDialog && !showImportDialog} onOpenChange={(open) => !open && setSelectedTestCase(null)}>
                    <SheetContent className="w-full sm:w-[640px] bg-white dark:bg-[#0c0c0e] border-l-2 border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 sm:max-w-[640px] p-0 overflow-hidden flex flex-col shadow-2xl">
                        <SheetHeader className="p-5 md:p-10 border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01]">
                            <div className="flex items-center justify-between mb-2">
                                <SheetTitle className="text-lg md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Test Case Details
                                </SheetTitle>
                                {selectedResult && (
                                    <Badge
                                        className={cn(
                                            "text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full border-0 shadow-lg",
                                            selectedResult.status === 'success'
                                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                                : 'bg-rose-500 text-white shadow-rose-500/20'
                                        )}
                                    >
                                        {selectedResult.status === 'success' ? 'PASSED' : 'FAILED'}
                                    </Badge>
                                )}
                            </div>
                            <SheetDescription className="text-slate-500 dark:text-slate-500 font-medium text-xs md:text-sm">
                                Comprehensive breakdown of inputs, expected outcomes, and real-time generation results.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6 md:space-y-10 scrollbar-thin-hover">
                            {selectedTestCase && (
                                <div className="space-y-8">
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex items-center gap-2.5 ml-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Input Data</label>
                                        </div>
                                        <div className="p-4 md:p-6 bg-slate-50 dark:bg-white/[0.01] border-2 border-slate-100 dark:border-white/[0.03] rounded-xl md:rounded-2xl font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed shadow-sm">
                                            {selectedTestCase.input_text}
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex items-center gap-2.5 ml-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Expected Result</label>
                                        </div>
                                        <div className="p-4 md:p-6 bg-slate-50 dark:bg-white/[0.01] border-2 border-slate-100 dark:border-white/[0.03] rounded-xl md:rounded-2xl font-mono text-[11px] text-slate-700 dark:text-slate-400 whitespace-pre-wrap leading-relaxed shadow-sm">
                                            {selectedTestCase.expected_output || 'No expectation defined for this case.'}
                                        </div>
                                    </div>

                                    {selectedResult ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between ml-1">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]", selectedResult.status === 'success' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50')} />
                                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Actual Generation</label>
                                                </div>
                                                <div className="flex items-center gap-4 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-600">
                                                    <span className="flex items-center gap-1.5">
                                                        <Activity className="w-3 h-3" />
                                                        {selectedResult.latency_ms}ms
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                                    <span className="flex items-center gap-1.5 text-indigo-500/80">
                                                        <Zap className="w-3 h-3" />
                                                        {selectedResult.tokens_used} tokens
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "p-6 border-2 rounded-2xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-sm transition-all",
                                                selectedResult.status === 'success'
                                                    ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/10 text-slate-800 dark:text-emerald-50'
                                                    : 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-100/50 dark:border-rose-500/10 text-slate-800 dark:text-rose-50'
                                            )}>
                                                {selectedResult.actual_output}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-3 bg-slate-50/30 dark:bg-transparent">
                                            <Activity className="w-8 h-8 opacity-20" />
                                            <p className="text-xs font-medium tracking-tight">No execution result found for this case.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                <TestCaseDialogs
                    projectId={projectId}
                    showAddDialog={showAddDialog}
                    setShowAddDialog={setShowAddDialog}
                    showEditDialog={showEditDialog}
                    setShowEditDialog={setShowEditDialog}
                    showImportDialog={showImportDialog}
                    setShowImportDialog={setShowImportDialog}
                    onAdd={handleAddTestCase}
                    onEdit={handleUpdateTestCase}
                    onImport={handleImportTests}
                    editData={selectedTestCase ? { id: selectedTestCase.id, input: selectedTestCase.input_text, expected: selectedTestCase.expected_output || '' } : undefined}
                />
            </div>
        </TooltipProvider>
    )
}
