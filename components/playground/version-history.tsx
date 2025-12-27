'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { History as HistoryIcon, RotateCcw, Check, Loader2, GitCommit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { getVersionHistory, switchActiveVersion } from '@/app/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface VersionHistoryProps {
    projectId: string
    currentVersionId?: string
    onVersionRestored: () => void
}

interface Version {
    id: string
    version_number: number
    created_at: string
    label?: string
    is_active: boolean
    system_prompt?: string
}

export function VersionHistory({ projectId, currentVersionId, onVersionRestored }: VersionHistoryProps) {
    const [versions, setVersions] = useState<Version[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)

    useEffect(() => {
        loadHistory()
    }, [projectId])

    async function loadHistory() {
        setIsLoading(true)
        try {
            const result = await getVersionHistory(projectId)
            if (result.success && result.versions) {
                setVersions(result.versions)
            } else {
                toast.error('Failed to load history')
            }
        } catch (error) {
            toast.error('Failed to load history')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleRestore(versionId: string) {
        setIsRestoring(true)
        try {
            const result = await switchActiveVersion(projectId, versionId)
            if (result.success) {
                toast.success('Version restored successfully')
                onVersionRestored()
            } else {
                toast.error(result.error || 'Failed to restore version')
            }
        } catch (error) {
            toast.error('Failed to restore version')
        } finally {
            setIsRestoring(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        )
    }

    if (versions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <HistoryIcon className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No version history available</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
                {versions.map((version) => {
                    const isCurrent = version.id === currentVersionId
                    return (
                        <div
                            key={version.id}
                            className={cn(
                                "group relative p-4 rounded-xl border transition-all duration-200",
                                isCurrent
                                    ? "bg-cyan-50/50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20"
                                    : "bg-white dark:bg-[#18181b] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                            )}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold",
                                        isCurrent ? "bg-cyan-500 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500"
                                    )}>
                                        v{version.version_number}
                                    </span>
                                    {isCurrent && (
                                        <Badge variant="outline" className="text-[10px] bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30 px-1.5 py-0">
                                            Active
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 tabular-nums">
                                    {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            {version.label && (
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 pl-8">
                                    {version.label}
                                </p>
                            )}

                            {!isCurrent && (
                                <div className="pl-8 pt-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleRestore(version.id)}
                                        disabled={isRestoring}
                                        className="h-7 text-xs bg-slate-100 dark:bg-white/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                                    >
                                        {isRestoring ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RotateCcw className="w-3 h-3 mr-1" />}
                                        Restore
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
