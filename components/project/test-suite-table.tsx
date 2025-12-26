import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Clock, Zap, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TestCase {
    id: string
    project_id: string
    input_text: string
    expected_output: string | null
    created_at: string
}

interface TestResult {
    id: string
    case_id: string
    actual_output: string
    expected_output: string | null
    status: 'success' | 'error'
    latency_ms: number
    tokens_used: number
    error_message?: string
    generation_cost?: number
    judge_cost?: number
    total_cost?: number
}

interface TestSuiteTableProps {
    filteredTestCases: TestCase[]
    results: Map<string, TestResult>
    isRunning: boolean
    searchQuery: string
    onEditClick: (testCase: TestCase, e: React.MouseEvent) => void
    onDeleteClick: (testCaseId: string, e: React.MouseEvent) => void
    onRowClick: (testCase: TestCase) => void
}

export function TestSuiteTable({
    filteredTestCases,
    results,
    isRunning,
    searchQuery,
    onEditClick,
    onDeleteClick,
    onRowClick
}: TestSuiteTableProps) {
    return (
        <Table>
            <TableHeader className="sticky top-0 z-10 bg-[#0c0c0e]">
                <TableRow className="border-white/10 hover:bg-[#0c0c0e]">
                    <TableHead className="w-[50px] text-center text-slate-400 text-xs font-semibold uppercase">Status</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase">Input Variable</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase">Expected Output</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase w-[150px]">Metrics</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase w-[80px]">Cost</TableHead>
                    <TableHead className="w-[80px] text-right text-slate-400 text-xs font-semibold uppercase pr-4">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredTestCases.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                            {searchQuery ? 'No matching test cases found.' : 'No test cases yet. Add one to get started.'}
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredTestCases.map((testCase) => {
                        const result = results.get(testCase.id)
                        return (
                            <TableRow
                                key={testCase.id}
                                className="border-white/5 hover:bg-white/5 cursor-pointer transition-colors even:bg-white/[0.02] group"
                                onClick={() => onRowClick(testCase)}
                            >
                                <TableCell className="text-center py-2">
                                    <div className="flex justify-center">
                                        {result ? (
                                            result.status === 'success' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                            )
                                        ) : isRunning ? (
                                            <Loader2 className="w-3 h-3 text-cyan-500 animate-spin" />
                                        ) : (
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-700" />
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="py-2 max-w-[300px]">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="font-mono text-xs text-slate-300 truncate">
                                                {testCase.input_text}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-md bg-slate-900 border-slate-800 text-slate-200 text-xs">
                                            {testCase.input_text}
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>

                                <TableCell className="py-2 max-w-[300px]">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="font-mono text-xs text-slate-400 truncate">
                                                {testCase.expected_output || '—'}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-md bg-slate-900 border-slate-800 text-slate-200 text-xs">
                                            {testCase.expected_output || 'No expectation set'}
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>

                                <TableCell className="py-2">
                                    {result ? (
                                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {result.latency_ms}ms
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                {result.tokens_used}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-slate-700 font-mono">—</span>
                                    )}
                                </TableCell>

                                <TableCell className="py-2">
                                    {result && (result.total_cost !== undefined && result.total_cost > 0) ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 cursor-help text-[10px] font-mono">
                                                    <Zap className="w-3 h-3 mr-1" />
                                                    {result.total_cost}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-slate-400">Generation:</span>
                                                        <span className="font-mono">{result.generation_cost || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-slate-400">Judge:</span>
                                                        <span className="font-mono">{result.judge_cost || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-t border-slate-700 pt-1">
                                                        <span className="text-white font-medium">Total:</span>
                                                        <span className="font-mono text-amber-400">{result.total_cost}</span>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <span className="text-[10px] text-slate-700 font-mono">—</span>
                                    )}
                                </TableCell>

                                <TableCell className="py-2 text-right pr-4">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-slate-500 hover:text-cyan-400 hover:bg-white/5"
                                            onClick={(e) => onEditClick(testCase, e)}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-white/5"
                                            onClick={(e) => onDeleteClick(testCase.id, e)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })
                )}
            </TableBody>
        </Table>
    )
}
