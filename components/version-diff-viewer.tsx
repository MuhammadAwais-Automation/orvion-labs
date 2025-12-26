'use client'

import { useState, useEffect, useMemo } from 'react'
import { getVersionHistory, getVersionComparison } from '@/app/actions'
import {
    GitCompare,
    ArrowRight,
    CheckCircle,
    XCircle,
    Loader2,
    ChevronDown,
    Thermometer,
    Cpu,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface PromptVersion {
    id: string
    version_number: number
    system_prompt: string
    model_config: {
        model: string
        temperature: number
        max_tokens: number
    }
    label: string | null
    created_at: string
}

interface VersionDiffViewerProps {
    projectId: string
}

export function VersionDiffViewer({ projectId }: VersionDiffViewerProps) {
    const [versions, setVersions] = useState<PromptVersion[]>([])
    const [loading, setLoading] = useState(true)
    const [comparing, setComparing] = useState(false)
    const [versionA, setVersionA] = useState<string>('')
    const [versionB, setVersionB] = useState<string>('')
    const [comparison, setComparison] = useState<any>(null)

    // Fetch versions on mount
    useEffect(() => {
        async function fetchVersions() {
            const result = await getVersionHistory(projectId)
            if (result.success && result.versions) {
                setVersions(result.versions)
                // Default: compare latest two versions
                if (result.versions.length >= 2) {
                    setVersionA(result.versions[0].id)
                    setVersionB(result.versions[1].id)
                }
            }
            setLoading(false)
        }
        fetchVersions()
    }, [projectId])

    // Compare versions when selection changes
    const handleCompare = async () => {
        if (!versionA || !versionB || versionA === versionB) return

        setComparing(true)
        const result = await getVersionComparison(projectId, versionA, versionB)
        if (result.success) {
            setComparison(result.comparison)
        }
        setComparing(false)
    }

    // Simple diff highlighting
    const getDiffLines = (textA: string, textB: string) => {
        const linesA = textA.split('\n')
        const linesB = textB.split('\n')
        const maxLen = Math.max(linesA.length, linesB.length)

        const diff = []
        for (let i = 0; i < maxLen; i++) {
            const lineA = linesA[i] ?? ''
            const lineB = linesB[i] ?? ''

            if (lineA === lineB) {
                diff.push({ type: 'same', content: lineA })
            } else if (lineA && !linesB.includes(lineA)) {
                diff.push({ type: 'removed', content: lineA })
            } else if (lineB && !linesA.includes(lineB)) {
                diff.push({ type: 'added', content: lineB })
            } else {
                diff.push({ type: 'changed', contentA: lineA, contentB: lineB })
            }
        }
        return diff
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            </div>
        )
    }

    if (versions.length < 2) {
        return (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <GitCompare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Need at least 2 versions to compare</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Version Selector Header */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 block mb-2">Version A (Newer)</label>
                        <Select value={versionA} onValueChange={setVersionA}>
                            <SelectTrigger className="bg-gray-900 border-gray-600">
                                <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                                {versions.map((v) => (
                                    <SelectItem
                                        key={v.id}
                                        value={v.id}
                                        disabled={v.id === versionB}
                                    >
                                        v{v.version_number} {v.label ? `(${v.label})` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-500 mt-6" />

                    <div className="flex-1">
                        <label className="text-xs text-gray-400 block mb-2">Version B (Older)</label>
                        <Select value={versionB} onValueChange={setVersionB}>
                            <SelectTrigger className="bg-gray-900 border-gray-600">
                                <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                                {versions.map((v) => (
                                    <SelectItem
                                        key={v.id}
                                        value={v.id}
                                        disabled={v.id === versionA}
                                    >
                                        v{v.version_number} {v.label ? `(${v.label})` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleCompare}
                        disabled={comparing || !versionA || !versionB || versionA === versionB}
                        className="mt-6 gap-2"
                    >
                        {comparing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <GitCompare className="w-4 h-4" />
                        )}
                        Compare
                    </Button>
                </div>
            </div>

            {/* Comparison Results */}
            {comparison && (
                <div className="space-y-4">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Pass Rate Change */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <p className="text-xs text-gray-400 mb-2">Pass Rate Change</p>
                            <div className="flex items-center gap-2">
                                {comparison.changes.passRateDelta !== null ? (
                                    <>
                                        {comparison.changes.passRateDelta > 0 ? (
                                            <TrendingUp className="w-5 h-5 text-green-500" />
                                        ) : comparison.changes.passRateDelta < 0 ? (
                                            <TrendingDown className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <Minus className="w-5 h-5 text-gray-500" />
                                        )}
                                        <span className={`text-xl font-bold ${comparison.changes.passRateDelta > 0
                                                ? 'text-green-400'
                                                : comparison.changes.passRateDelta < 0
                                                    ? 'text-red-400'
                                                    : 'text-gray-400'
                                            }`}>
                                            {comparison.changes.passRateDelta > 0 ? '+' : ''}
                                            {comparison.changes.passRateDelta}%
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-500">No data</span>
                                )}
                            </div>
                        </div>

                        {/* Model Change */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                <Cpu className="w-3 h-3" /> Model
                            </p>
                            {comparison.changes.modelChanged ? (
                                <div className="text-sm">
                                    <span className="text-red-400 line-through">
                                        {comparison.versionB.model_config?.model}
                                    </span>
                                    <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                                    <span className="text-green-400">
                                        {comparison.versionA.model_config?.model}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">No change</span>
                            )}
                        </div>

                        {/* Temperature Change */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                <Thermometer className="w-3 h-3" /> Temperature
                            </p>
                            {comparison.changes.temperatureChanged ? (
                                <div className="text-sm">
                                    <span className="text-red-400">
                                        {comparison.versionB.model_config?.temperature}
                                    </span>
                                    <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                                    <span className="text-green-400">
                                        {comparison.versionA.model_config?.temperature}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">No change</span>
                            )}
                        </div>
                    </div>

                    {/* Prompt Diff */}
                    {comparison.changes.promptChanged && (
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white">
                                    Prompt Changes
                                </h3>
                                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                                    Modified
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-gray-700">
                                <div className="p-4">
                                    <p className="text-xs text-gray-400 mb-2">
                                        v{comparison.versionA.version_number} (New)
                                    </p>
                                    <pre className="text-xs text-green-300 bg-green-500/10 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                                        {comparison.versionA.system_prompt}
                                    </pre>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-gray-400 mb-2">
                                        v{comparison.versionB.version_number} (Old)
                                    </p>
                                    <pre className="text-xs text-red-300 bg-red-500/10 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                                        {comparison.versionB.system_prompt}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Prompt Changes */}
                    {!comparison.changes.promptChanged && (
                        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 text-center">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-gray-400">Prompt content is identical</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
