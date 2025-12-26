'use client'

import { Search, Plus, Upload, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TestSuiteActionsBarProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    onAddClick: () => void
    onImportClick: () => void
    onRunClick: () => void
    isRunning: boolean
    progress: { current: number; total: number }
    totalTestCases: number
}

export function TestSuiteActionsBar({
    searchQuery,
    onSearchChange,
    onAddClick,
    onImportClick,
    onRunClick,
    isRunning,
    progress,
    totalTestCases
}: TestSuiteActionsBarProps) {
    return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <Input
                    placeholder="Search test cases..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 bg-white/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white h-10 text-xs rounded-xl focus-visible:ring-cyan-500/20"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={onAddClick}
                    variant="outline"
                    className="h-10 px-4 border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 rounded-xl transition-all text-[11px] font-bold uppercase tracking-wider"
                >
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    Add Case
                </Button>
                <Button
                    onClick={onImportClick}
                    variant="outline"
                    className="h-10 px-4 border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 rounded-xl transition-all text-[11px] font-bold uppercase tracking-wider"
                >
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    Import
                </Button>
                <Button
                    onClick={onRunClick}
                    disabled={isRunning || totalTestCases === 0}
                    className={cn(
                        "h-10 min-w-[140px] rounded-xl transition-all text-[11px] font-bold uppercase tracking-wider",
                        isRunning || totalTestCases === 0
                            ? "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-600"
                            : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95"
                    )}
                >
                    {isRunning ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                            {progress.total > 0 ? `${progress.current}/${progress.total}` : 'Starting...'}
                        </>
                    ) : (
                        <>
                            <Play className="w-3.5 h-3.5 mr-2" />
                            Run Analysis
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
