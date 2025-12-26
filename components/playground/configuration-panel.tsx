'use client'

import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Settings2,
    Cpu,
    Sparkles,
    Save,
    RotateCcw,
    Loader2,
    GitBranch,
    PanelRightClose,
    PanelRightOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModelConfig {
    model: string
    temperature: number
    max_tokens: number
    top_p: number
}

import { VersionHistory } from './version-history'

interface ConfigurationPanelProps {
    projectId: string
    currentVersionId?: string
    config: ModelConfig
    onConfigChange: (newConfig: ModelConfig) => void
    isSaving: boolean
    isSavingNew?: boolean
    hasUnsavedChanges: boolean
    onSave: () => void
    onSaveAsNew?: () => void
    onReset: () => void
    onVersionRestored: () => void
    isCollapsed?: boolean
    onToggleCollapse?: () => void
}

const MODELS = [
    { value: 'gpt-4o', label: 'GPT-4o', badge: 'Premium', badgeColor: 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini', badge: 'Fast', badgeColor: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', badge: 'Legacy', badgeColor: 'text-slate-500 dark:text-slate-400 border-slate-500/30 bg-slate-500/10' },
]

export function ConfigurationPanel({
    projectId,
    currentVersionId,
    config,
    onConfigChange,
    isSaving,
    isSavingNew = false,
    hasUnsavedChanges,
    onSave,
    onSaveAsNew,
    onReset,
    onVersionRestored,
    isCollapsed = false,
    onToggleCollapse
}: ConfigurationPanelProps) {

    const updateField = (field: keyof ModelConfig, value: any) => {
        onConfigChange({ ...config, [field]: value })
    }

    const currentModel = MODELS.find(m => m.value === config.model)

    return (
        <div className={cn(
            "border-l border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0a0a0b] flex flex-col h-full transition-all",
            isCollapsed ? "w-12" : "w-[280px]"
        )}>
            {/* Header */}
            <div className="flex-shrink-0 h-14 flex items-center justify-between px-3 border-b border-slate-200 dark:border-white/[0.06] bg-white dark:bg-transparent">
                {isCollapsed ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleCollapse}
                        className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        title="Expand Config"
                    >
                        <PanelRightOpen className="w-4 h-4" />
                    </Button>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300" style={{ fontFamily: 'var(--font-sans)' }}>
                                Config
                            </h2>
                        </div>
                        <div className="flex items-center gap-1">
                            <VersionHistory
                                projectId={projectId}
                                currentVersionId={currentVersionId}
                                onVersionRestored={onVersionRestored}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleCollapse}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                title="Collapse Config"
                            >
                                <PanelRightClose className="w-4 h-4" />
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Scrollable Content - Hidden when collapsed */}
            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto scrollbar-thin-hover">

                    {/* Model Section */}
                    <div className="p-5 border-b border-slate-200 dark:border-white/[0.04]">
                        <Label className="text-[11px] text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5 mb-3">
                            <Cpu className="w-3 h-3" /> Model
                        </Label>
                        <Select
                            value={config.model}
                            onValueChange={(val) => updateField('model', val)}
                        >
                            <SelectTrigger className="w-full h-10 bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.05] focus:ring-1 focus:ring-cyan-500/30 transition-colors rounded-lg">
                                <div className="flex items-center justify-between w-full">
                                    <SelectValue>
                                        <span className="font-medium">{currentModel?.label}</span>
                                    </SelectValue>
                                    {currentModel && (
                                        <Badge className={cn("text-[9px] ml-2 font-medium", currentModel.badgeColor)}>
                                            {currentModel.badge}
                                        </Badge>
                                    )}
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-[#141416] border-slate-200 dark:border-white/[0.08] rounded-lg">
                                {MODELS.map((m) => (
                                    <SelectItem
                                        key={m.value}
                                        value={m.value}
                                        className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-white/[0.06] focus:text-slate-900 dark:focus:text-white rounded-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{m.label}</span>
                                            <Badge className={cn("text-[9px] font-medium", m.badgeColor)}>
                                                {m.badge}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Parameters Section */}
                    <div className="p-5 space-y-5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500" />
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parameters</span>
                        </div>

                        {/* Temperature */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-slate-600 dark:text-slate-400 font-normal">Temperature</Label>
                                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-2 py-0.5 rounded-md">
                                    {config.temperature.toFixed(1)}
                                </span>
                            </div>
                            <Slider
                                value={[config.temperature]}
                                onValueChange={(v) => updateField('temperature', v[0])}
                                min={0}
                                max={1}
                                step={0.1}
                                className="[&_[role=slider]]:bg-cyan-500 [&_[role=slider]]:border-cyan-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-cyan-500/20 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_.bg-primary]:bg-cyan-500"
                            />
                            <p className="text-[10px] text-slate-500 dark:text-slate-600 leading-relaxed">
                                Lower = focused & deterministic. Higher = creative & random.
                            </p>
                        </div>

                        {/* Max Tokens */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-slate-600 dark:text-slate-400 font-normal">Max Tokens</Label>
                                <span className="text-xs font-mono text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded-md">
                                    {config.max_tokens.toLocaleString()}
                                </span>
                            </div>
                            <Slider
                                value={[config.max_tokens]}
                                onValueChange={(v) => updateField('max_tokens', v[0])}
                                min={1}
                                max={4096}
                                step={1}
                                className="[&_[role=slider]]:bg-violet-500 [&_[role=slider]]:border-violet-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-violet-500/20 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_.bg-primary]:bg-violet-500"
                            />
                        </div>

                        {/* Top P */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-slate-600 dark:text-slate-400 font-normal">Top P</Label>
                                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    {config.top_p.toFixed(2)}
                                </span>
                            </div>
                            <Slider
                                value={[config.top_p]}
                                onValueChange={(v) => updateField('top_p', v[0])}
                                min={0}
                                max={1}
                                step={0.01}
                                className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-emerald-500/20 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_.bg-primary]:bg-emerald-500"
                            />
                        </div>
                    </div>
                </div>

            {/* Version Control Footer */}
            <div className="flex-shrink-0 border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#08080a]">
                {/* Unsaved Indicator */}
                {hasUnsavedChanges && (
                    <div className="px-5 py-2 border-b border-slate-200 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Unsaved changes</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 space-y-2">
                    {/* Primary: Save Changes */}
                    <Button
                        className={cn(
                            "w-full h-10 text-sm font-medium transition-all duration-200",
                            hasUnsavedChanges
                                ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/30"
                                : "bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-white/[0.06]"
                        )}
                        onClick={onSave}
                        disabled={isSaving || !hasUnsavedChanges}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                    </Button>

                    {/* Secondary: Save as New Version */}
                    {onSaveAsNew && (
                        <Button
                            variant="outline"
                            className="w-full h-10 text-sm font-medium border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-500/30 transition-all duration-200"
                            onClick={onSaveAsNew}
                            disabled={isSavingNew}
                        >
                            {isSavingNew ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <GitBranch className="w-4 h-4 mr-2" />
                            )}
                            Save as New Version
                        </Button>
                    )}

                    {/* Tertiary: Reset */}
                    <Button
                        variant="ghost"
                        className="w-full h-8 text-xs text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-colors"
                        onClick={onReset}
                    >
                        <RotateCcw className="w-3 h-3 mr-2" />
                        Reset to Defaults
                    </Button>
                </div>
            </div>
        </div>
    )
}
