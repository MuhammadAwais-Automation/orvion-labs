'use client'

import { useState } from 'react'
import {
    Activity
} from 'lucide-react'
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
            <div className="h-full flex flex-col bg-white dark:bg-[#09090b] overflow-hidden">
                <TestRunIndicator isRestoring={isRestoring} />

                <div className="flex-shrink-0 p-6 space-y-6">
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

                <div className="flex-1 mx-6 mb-6 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden bg-slate-50 dark:bg-[#0c0c0e] flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto">
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
                    <SheetContent className="w-[600px] bg-white dark:bg-[#0c0c0e] border-l border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 sm:max-w-[600px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-white flex items-center gap-3">
                                Test Case Details
                                {selectedResult && (
                                    <Badge
                                        variant="outline"
                                        className={selectedResult.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}
                                    >
                                        {selectedResult.status === 'success' ? 'PASS' : 'FAIL'}
                                    </Badge>
                                )}
                            </SheetTitle>
                            <SheetDescription className="text-slate-400">Inspect inputs and results.</SheetDescription>
                        </SheetHeader>
                        {selectedTestCase && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Input</label>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-slate-300 whitespace-pre-wrap">{selectedTestCase.input_text}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expected Output</label>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-slate-400 whitespace-pre-wrap">{selectedTestCase.expected_output || 'No expectation set'}</div>
                                </div>
                                {selectedResult ? (
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                            <span>Actual Result</span>
                                            <span className="normal-case font-mono text-slate-500">{selectedResult.latency_ms}ms • {selectedResult.tokens_used} tokens</span>
                                        </label>
                                        <div className={`p-4 border rounded-lg font-mono text-sm whitespace-pre-wrap ${selectedResult.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100' : 'bg-red-500/5 border-red-500/20 text-red-100'}`}>
                                            {selectedResult.actual_output}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-slate-500 gap-2">
                                        <Activity className="w-8 h-8 opacity-20" />
                                        <p className="text-sm">No result available.</p>
                                    </div>
                                )}
                            </div>
                        )}
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
