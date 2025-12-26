'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Box, MoreVertical, ExternalLink, Copy, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
    project: {
        id: string
        name: string
        description: string | null
        created_at: string
        updated_at?: string
    }
    recentRuns?: Array<{
        status: 'completed' | 'failed' | 'running'
        passed_cases: number
        total_cases: number
        created_at: string
    }>
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
}

export function ProjectCard({ project, recentRuns = [], onDelete, onDuplicate }: ProjectCardProps) {
    // Get last 5 runs for status dots
    const lastFiveRuns = [...recentRuns]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)

    // Determine dot color based on run result
    const getStatusInfo = (run: typeof lastFiveRuns[0]) => {
        if (!run) return { color: 'bg-slate-200 dark:bg-zinc-800', label: 'No data' }
        if (run.status === 'running') return { color: 'bg-amber-500 animate-pulse', label: 'Running...' }
        if (run.status === 'failed') return { color: 'bg-rose-500', label: 'Failed' }
        const passRate = run.total_cases > 0 ? (run.passed_cases / run.total_cases) * 100 : 0
        return {
            color: passRate >= 70 ? 'bg-emerald-500' : 'bg-rose-500',
            label: `${Math.round(passRate)}% Pass rate`
        }
    }

    const timeAgo = project.updated_at
        ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
        : formatDistanceToNow(new Date(project.created_at), { addSuffix: true })

    return (
        <Card className="bg-white dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.05] rounded-[2.5rem] p-8 hover:shadow-xl hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 p-8">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-100 dark:focus:bg-white/5">
                            <Link href={`/projects/${project.id}`} className="flex items-center gap-2 cursor-pointer py-2.5">
                                <ExternalLink className="w-4 h-4 text-cyan-500" />
                                <span className="font-bold text-sm tracking-tight text-slate-700 dark:text-zinc-300">Open Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        {onDuplicate && (
                            <DropdownMenuItem onClick={() => onDuplicate(project.id)} className="rounded-xl focus:bg-slate-100 dark:focus:bg-white/5 py-2.5">
                                <Copy className="w-4 h-4 mr-2 text-slate-400" />
                                <span className="font-bold text-sm tracking-tight text-slate-700 dark:text-zinc-300">Duplicate Project</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 my-1" />
                        {onDelete && (
                            <DropdownMenuItem
                                onClick={() => onDelete(project.id)}
                                className="rounded-xl focus:bg-rose-50 dark:focus:bg-rose-500/10 py-2.5 text-rose-500"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span className="font-bold text-sm tracking-tight">Move to Archive</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-6 flex-1">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-[1.25rem] border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Box className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="space-y-1 pt-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                {project.name}
                            </h3>
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-white/5">
                                v1.0
                            </span>
                        </div>
                        <p className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            Updated {timeAgo}
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2 min-h-[3rem]">
                    {project.description || 'Define your project scope and testing parameters to get started.'}
                </p>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500">Stability History</span>
                        <div className="flex items-center gap-1.5">
                            <TooltipProvider delayDuration={0}>
                                {lastFiveRuns.length > 0 ? (
                                    lastFiveRuns.map((run, idx) => {
                                        const info = getStatusInfo(run)
                                        return (
                                            <Tooltip key={idx}>
                                                <TooltipTrigger asChild>
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full cursor-help transition-all hover:scale-150",
                                                        info.color
                                                    )} />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-white/10 rounded-xl px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider">
                                                    {info.label} • {formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    })
                                ) : (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className="w-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800"
                                        />
                                    ))
                                )}
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 mt-auto flex items-center justify-between gap-4">
                <Link
                    href={`/projects/${project.id}`}
                    className="flex-1"
                >
                    <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 rounded-[1.25rem] h-12 font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-cyan-500/10">
                        Enter Workspace
                    </Button>
                </Link>
            </div>
        </Card>
    )
}
