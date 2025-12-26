'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { getVersionHistory, switchActiveVersion } from '@/app/actions'
import { formatDistanceToNow } from 'date-fns'
import { PromptVersion, ModelConfig } from '@/types/database'
import { toast } from 'sonner'

interface VersionSelectorProps {
    projectId: string
    currentVersion: number
    onVersionSelect: (systemPrompt: string, modelConfig: ModelConfig, versionNumber: number) => void
}

export function VersionSelector({
    projectId,
    currentVersion,
    onVersionSelect,
}: VersionSelectorProps) {
    const [open, setOpen] = useState(false)
    const [versions, setVersions] = useState<PromptVersion[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && versions.length === 0) {
            loadVersions()
        }
    }, [open])

    const loadVersions = async () => {
        setLoading(true)
        const result = await getVersionHistory(projectId)

        if (result.success && result.versions) {
            setVersions(result.versions)
        }
        setLoading(false)
    }

    const handleVersionClick = async (version: PromptVersion) => {
        // Optimistic update
        onVersionSelect(
            version.system_prompt,
            version.model_config,
            version.version_number
        )
        setOpen(false)

        // Persist to DB
        const result = await switchActiveVersion(projectId, version.id)
        if (result.success) {
            toast.success(`Switched to v${version.version_number}`)
        } else {
            toast.error('Failed to switch version')
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Badge
                    variant="outline"
                    className="bg-slate-900 text-cyan-400 border-cyan-500/30 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                    <History className="w-3 h-3 mr-1" />
                    v{currentVersion}
                    <ChevronDown className="w-3 h-3 ml-1" />
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-slate-900 border-slate-700 p-0" align="end">
                <div className="p-3 border-b border-slate-700">
                    <h4 className="text-sm font-semibold text-white">Version History</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        Click a version to preview it
                    </p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-slate-400">
                            Loading versions...
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400">
                            No versions found
                        </div>
                    ) : (
                        <div className="py-1">
                            {versions.map((version) => (
                                <button
                                    key={version.id}
                                    onClick={() => handleVersionClick(version)}
                                    className={`w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors border-l-2 ${version.version_number === currentVersion
                                        ? 'border-cyan-500 bg-slate-800/50'
                                        : 'border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-white">
                                                    Version {version.version_number}
                                                </span>
                                                {version.label && (
                                                    <span className="text-xs text-slate-400">
                                                        - {version.label}
                                                    </span>
                                                )}
                                                {version.is_active && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                                    >
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {formatDistanceToNow(new Date(version.created_at), {
                                                    addSuffix: true,
                                                })}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 font-mono">
                                                {version.model_config.model || 'gpt-4o-mini'}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
