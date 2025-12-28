'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle, XCircle, Loader2, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TestRun {
    id: string
    projectName: string
    status: 'completed' | 'failed' | 'processing'
    passedCases: number
    totalCases: number
    createdAt: string
}

interface RecentActivityProps {
    runs: TestRun[]
}

export function RecentActivity({ runs }: RecentActivityProps) {
    if (runs.length === 0) {
        return (
            <Card className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] rounded-3xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                        <Clock className="w-7 h-7 text-slate-400 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No activity yet</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-500 max-w-xs">
                        Run your first test suite to see activity here
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] rounded-3xl overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="h-4 w-1 bg-cyan-500 rounded-full" />
                    Test Run History
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {runs.map((run, index) => {
                        const passRate = run.totalCases > 0
                            ? Math.round((run.passedCases / run.totalCases) * 100)
                            : 0
                        const isPassed = run.status === 'completed' && passRate >= 70
                        const isProcessing = run.status === 'processing'

                        return (
                            <motion.div
                                key={run.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className={cn(
                                    "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                                    "bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/[0.03]",
                                    "hover:border-slate-200 dark:hover:border-white/10 hover:shadow-sm"
                                )}>
                                    <div className="flex items-center gap-4">
                                        {/* Status Icon */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            isProcessing ? "bg-blue-500/10" :
                                                isPassed ? "bg-emerald-500/10" : "bg-red-500/10"
                                        )}>
                                            {isProcessing ? (
                                                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                            ) : isPassed ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>

                                        {/* Project Info */}
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {run.projectName}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-zinc-500">
                                                {formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div className="flex items-center gap-4">
                                        {!isProcessing && (
                                            <div className="text-right">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] font-bold px-2 py-0.5",
                                                        isPassed
                                                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                                                            : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
                                                    )}
                                                >
                                                    {run.passedCases}/{run.totalCases} passed
                                                </Badge>
                                            </div>
                                        )}
                                        {isProcessing && (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                                            >
                                                Running...
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
