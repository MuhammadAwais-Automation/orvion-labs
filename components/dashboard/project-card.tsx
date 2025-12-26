'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Box, MoreVertical, Play, Copy, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'

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
    }>
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
}

export function ProjectCard({ project, recentRuns = [], onDelete, onDuplicate }: ProjectCardProps) {
    // Get last 5 runs for status dots
    const lastFiveRuns = recentRuns.slice(0, 5)

    // Determine dot color based on run result
    const getStatusColor = (run: typeof lastFiveRuns[0]) => {
        if (!run) return 'bg-gray-700'
        if (run.status === 'running') return 'bg-yellow-500'
        if (run.status === 'failed') return 'bg-red-500'
        const passRate = (run.passed_cases / run.total_cases) * 100
        return passRate >= 70 ? 'bg-green-500' : 'bg-red-500'
    }

    const timeAgo = project.updated_at
        ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
        : formatDistanceToNow(new Date(project.created_at), { addSuffix: true })

    return (
        <Card className="bg-white/80 dark:bg-zinc-900/50 border-gray-200 dark:border-white/5 backdrop-blur-md hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 hover:shadow-lg overflow-hidden group">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                            <Box className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {project.name}
                                </h3>
                                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                                    v1
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                            <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}`} className="cursor-pointer">
                                    Open Project
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Play className="w-4 h-4 mr-2" />
                                Run Regression
                            </DropdownMenuItem>
                            {onDuplicate && (
                                <DropdownMenuItem onClick={() => onDuplicate(project.id)} className="cursor-pointer">
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-gray-800" />
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(project.id)}
                                    className="cursor-pointer text-red-400 focus:text-red-300"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Description */}
                <p className={`text-sm mb-4 line-clamp-2 min-h-[40px] ${project.description ? 'text-gray-400' : 'text-gray-600 italic'}`}>
                    {project.description || 'No description provided'}
                </p>

                {/* Status Dots */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500 font-medium">Recent runs:</span>
                    <div className="flex items-center gap-1.5">
                        {lastFiveRuns.length > 0 ? (
                            lastFiveRuns.map((run, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2.5 h-2.5 rounded-full ${getStatusColor(run)} ring-1 ring-offset-1 ring-offset-gray-900 ring-${getStatusColor(run).replace('bg-', '')}/30 transition-all hover:scale-125`}
                                    title={`${run.passed_cases}/${run.total_cases} passed`}
                                />
                            ))
                        ) : (
                            // Show 5 gray dots if no runs
                            Array.from({ length: 5 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="w-2.5 h-2.5 rounded-full bg-gray-700 ring-1 ring-gray-700/50"
                                    title="No test runs yet"
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <span className="text-xs text-gray-500">
                        Updated {timeAgo}
                    </span>
                    <Link
                        href={`/projects/${project.id}`}
                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        Open →
                    </Link>
                </div>
            </div>
        </Card>
    )
}
