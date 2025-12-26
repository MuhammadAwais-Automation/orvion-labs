'use client'

import { Search, Plus, Upload, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
        <div className="flex items-center justify-between gap-4">
            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    placeholder="Search test cases..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 bg-white/5 border border-white/10 rounded-lg text-white h-9 text-sm focus:ring-cyan-500/20 outline-none"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={onAddClick} variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-slate-200">
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    Add Case
                </Button>
                <Button onClick={onImportClick} variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-slate-200">
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    Import
                </Button>
                <Button
                    onClick={onRunClick}
                    disabled={isRunning || totalTestCases === 0}
                    size="sm"
                    className={`h-9 min-w-[140px] bg-cyan-600 hover:bg-cyan-500 text-white border-0 transition-all ${!isRunning && totalTestCases > 0 ? 'animate-pulse shadow-[0_0_15px_rgba(8,145,178,0.5)]' : ''}`}
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
