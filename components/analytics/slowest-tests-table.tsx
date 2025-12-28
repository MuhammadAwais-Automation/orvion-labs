'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { SlowestTest } from './types'

interface SlowestTestsTableProps {
    tests: SlowestTest[]
}

export function SlowestTestsTable({ tests }: SlowestTestsTableProps) {
    return (
        <div className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] shadow-sm rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Slowest Test Cases
            </h3>
            {tests.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-slate-400 font-medium">
                    No test data available
                </div>
            ) : (
                <div className="h-[280px] overflow-y-auto pr-2 scrollbar-thin-hover">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-100 dark:border-white/[0.05] hover:bg-transparent">
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Input</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-[100px]">Latency</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-[80px]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tests.map((test, idx) => (
                                <TableRow key={idx} className="border-slate-50 dark:border-white/[0.02] hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="font-mono text-[11px] text-slate-600 dark:text-slate-400 max-w-[200px] truncate py-4">
                                        {test.input}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <span className={cn(
                                            "text-[11px] font-bold tabular-nums px-2 py-1 rounded-lg",
                                            test.latencyMs > 3000 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                test.latencyMs > 1000 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        )}>
                                            {test.latencyMs}ms
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 text-right">
                                        <Badge
                                            className={cn(
                                                "text-[9px] font-black px-2 py-0.5 rounded-md border-0 shadow-none",
                                                test.status === 'success'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                            )}
                                        >
                                            {test.status === 'success' ? 'PASS' : 'FAIL'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
