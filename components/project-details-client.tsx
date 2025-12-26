'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AddTestCaseDialog } from '@/components/add-test-case-dialog'
import { TestRunnerView } from '@/components/test-runner-view'
import { TestCaseRowActions } from '@/components/test-case-row-actions'
import { ImportTestCasesBtn } from '@/components/import-test-cases-btn'
import Link from 'next/link'
import { useTestExecution, useTestStats, TestCase as HookTestCase } from '@/hooks/test-suite'

interface Project {
    id: string
    name: string
    description: string | null
}

interface TestCase {
    id: string
    name: string
    input_text: string
    expected_output: string | null
    created_at: string
}

interface ProjectDetailsClientProps {
    project: Project
    testCases: TestCase[]
    projectId: string
    latestRun: any
    testResults: any[]
}

export function ProjectDetailsClient({ project, testCases, projectId, latestRun, testResults }: ProjectDetailsClientProps) {
    // Convert testCases to hook-compatible format
    const hookTestCases: HookTestCase[] = testCases.map(tc => ({
        id: tc.id,
        project_id: projectId,
        input_text: tc.input_text,
        expected_output: tc.expected_output,
        created_at: tc.created_at
    }))

    // Use modular hooks for test execution
    const {
        results,
        setResults,
        isRunning,
        isRestoring,
        progress,
        handleRunTests
    } = useTestExecution(projectId, hookTestCases)

    // Use stats hook for derived calculations
    const { passRate, avgLatency } = useTestStats(results)

    // Handler for loading historical test results
    const handleHistoricalResultsLoaded = (historicalResults: any[]) => {
        const newMap = new Map()
        historicalResults.forEach(r => {
            newMap.set(r.case_id, r)
        })
        setResults(newMap)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        >
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Link href="/" className="hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">{project.name}</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                        {project.description && <p className="text-gray-400">{project.description}</p>}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <Tabs defaultValue="test-cases" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                        <TabsTrigger value="runner">Runner</TabsTrigger>
                    </TabsList>

                    <TabsContent value="test-cases">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-white">Test Cases</h2>
                                <div className="flex gap-3">
                                    <ImportTestCasesBtn projectId={projectId} />
                                    <AddTestCaseDialog projectId={projectId} />
                                </div>
                            </div>

                            {testCases.length > 0 ? (
                                <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Input</TableHead>
                                                <TableHead>Expected Output</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className="w-[100px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {testCases.map((testCase) => (
                                                <TableRow key={testCase.id}>
                                                    <TableCell className="font-medium">{testCase.name}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{testCase.input_text}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {testCase.expected_output || '—'}
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 text-sm">
                                                        {new Date(testCase.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TestCaseRowActions testCase={testCase} projectId={projectId} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-12 text-center">
                                    <p className="text-gray-400 mb-4">No test cases yet</p>
                                    <div className="flex gap-3 justify-center">
                                        <ImportTestCasesBtn projectId={projectId} />
                                        <AddTestCaseDialog projectId={projectId} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="runner">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                            {/* Dumb Component - All state from hooks */}
                            <TestRunnerView
                                projectId={projectId}
                                testCases={hookTestCases}
                                results={results}
                                isRunning={isRunning}
                                isRestoring={isRestoring}
                                progress={progress}
                                passRate={passRate}
                                avgLatency={avgLatency}
                                onRunTests={handleRunTests}
                                onHistoricalResultsLoaded={handleHistoricalResultsLoaded}
                            />
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    )
}
