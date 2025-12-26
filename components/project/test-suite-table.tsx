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
import { Clock, Zap, Pencil, Trash2, Loader2, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
            <TableHeader className="sticky top-0 z-10 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md">
                <TableRow className="border-slate-200 dark:border-white/[0.08] hover:bg-transparent">
                    <TableHead className="w-[80px] text-center text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest pl-6">Status</TableHead>
                    <TableHead className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest min-w-[200px]">Input Variable</TableHead>
                    <TableHead className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest min-w-[200px]">Expected Output</TableHead>
                    <TableHead className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[140px]">Metrics</TableHead>
                    <TableHead className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest w-[100px]">Cost</TableHead>
                    <TableHead className="w-[100px] text-right text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest pr-6">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredTestCases.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-20 bg-transparent border-0">
                            <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                                <Gauge className="w-8 h-8" />
                                <p className="text-sm font-medium">
                                    {searchQuery ? 'No matching test cases found.' : 'No test cases yet. Add one to get started.'}
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredTestCases.map((testCase) => {
                        const result = results.get(testCase.id)
                        return (
                            <TableRow
                                key={testCase.id}
                                className="border-slate-100 dark:border-white/[0.04] hover:bg-slate-100/50 dark:hover:bg-white/[0.02] cursor-pointer transition-all duration-200 group relative"
                                onClick={() => onRowClick(testCase)}
                            >
                                <TableCell className="text-center py-4 pl-6">
                                    <div className="flex justify-center">
                                        {result ? (
                                            result.status === 'success' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] dark:shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500" />
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] dark:shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-in zoom-in duration-500" />
                                            )
                                        ) : isRunning ? (
                                            <div className="relative">
                                                <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-500/20" />
                                                <Loader2 className="w-3.5 h-3.5 text-cyan-500 animate-spin absolute inset-0" />
                                            </div>
                                        ) : (
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-colors" />
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="py-4">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate max-w-[300px]">
                                                {testCase.input_text}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs shadow-xl backdrop-blur-md">
                                            {testCase.input_text}
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>

                                <TableCell className="py-4">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="font-mono text-xs text-slate-400 dark:text-slate-500 truncate max-w-[300px]">
                                                {testCase.expected_output || '—'}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs shadow-xl backdrop-blur-md">
                                            {testCase.expected_output || 'No expectation set'}
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>

                                <TableCell className="py-4">
                                    {result ? (
                                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.02]">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                {result.latency_ms}ms
                                            </span>
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.02]">
                                                <Zap className="w-3 h-3 text-slate-400" />
                                                {result.tokens_used}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-slate-300 dark:text-slate-700 font-mono pl-2">—</span>
                                    )}
                                </TableCell>

                                <TableCell className="py-2">
                                    {result && (result.total_cost !== undefined && result.total_cost > 0) ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="outline" className="bg-amber-500/5 text-amber-600 dark:text-amber-500/80 border-amber-500/20 hover:bg-amber-500/10 cursor-help text-[10px] font-bold px-2 py-0.5 rounded-md transition-all">
                                                    <Zap className="w-3 h-3 mr-1" />
                                                    {result.total_cost}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-xs shadow-2xl p-3 rounded-xl overflow-hidden min-w-[160px]">
                                                <div className="space-y-2 relative z-10">
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Generation</span>
                                                        <span className="font-mono text-slate-900 dark:text-white">{result.generation_cost || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Evaluation</span>
                                                        <span className="font-mono text-slate-900 dark:text-white">{result.judge_cost || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-4 border-t border-slate-100 dark:border-white/10 pt-2 mt-2">
                                                        <span className="text-slate-900 dark:text-white font-bold">Total Usage</span>
                                                        <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{result.total_cost}</span>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <span className="text-[10px] text-slate-300 dark:text-slate-700 font-mono pl-2">—</span>
                                    )}
                                </TableCell>

                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditClick(testCase, e);
                                            }}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteClick(testCase.id, e);
                                            }}
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
