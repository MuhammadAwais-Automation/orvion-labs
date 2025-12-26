'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Settings2,
    Cpu,
    Sparkles,
    Save,
    RotateCcw,
    Loader2,
    GitBranch,
    PanelRightClose,
    PanelRightOpen,
    Plus,
    X,
    Braces,
    Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { VersionHistory } from './version-history'

interface ModelConfig {
    model: string
    temperature: number
    max_tokens: number
    top_p: number
}

interface ConfigurationPanelProps {
    projectId: string
    currentVersionId?: string
    config: ModelConfig
    onConfigChange: (newConfig: ModelConfig) => void
    variables: Record<string, string>
    onVariablesChange: (variables: Record<string, string>) => void
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
    variables,
    onVariablesChange,
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

    const addVariable = (e: React.MouseEvent) => {
        e.stopPropagation()
        const newKey = `var${Object.keys(variables).length + 1}`
        onVariablesChange({ ...variables, [newKey]: '' })
    }

    const updateVariable = (oldKey: string, newKey: string, value: string) => {
        const updated = { ...variables }
        if (oldKey !== newKey) {
            delete updated[oldKey]
        }
        updated[newKey] = value
        onVariablesChange(updated)
    }

    const removeVariable = (key: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const updated = { ...variables }
        delete updated[key]
        onVariablesChange(updated)
    }

    const currentModel = MODELS.find(m => m.value === config.model)

    return (
        <div className={cn(
            "flex flex-col h-full bg-slate-50/50 dark:bg-[#09090b] text-slate-600 dark:text-slate-300",
            isCollapsed && "bg-slate-50 dark:bg-black"
        )}>
            {/* Header */}
            <div className={cn(
                "flex-shrink-0 h-14 flex items-center px-4 border-b border-slate-200 dark:border-white/[0.06]",
                isCollapsed ? "border-0 h-0 p-0" : "justify-between"
            )}>
                <AnimatePresence>
                    {isCollapsed ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="fixed right-6 top-20 z-[50]"
                        >
                            <motion.button
                                onClick={onToggleCollapse}
                                whileHover="hover"
                                initial="initial"
                                className="flex items-center gap-2 group relative"
                            >
                                <motion.div
                                    className="h-10 w-10 rounded-full bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/[0.1] shadow-xl flex items-center justify-center text-cyan-500 overflow-hidden relative z-10"
                                    variants={{
                                        initial: { width: 40, borderRadius: "50%" },
                                        hover: { width: 160, borderRadius: "20px" }
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <div className="flex items-center gap-3 px-3 w-[160px]">
                                        <Settings2 className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                                            Configuration
                                        </span>
                                    </div>

                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                                </motion.div>

                                {/* Notification dot if there are unsaved changes */}
                                {hasUnsavedChanges && (
                                    <motion.div
                                        layoutId="config-dot"
                                        className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-[#09090b] z-20"
                                    />
                                )}
                            </motion.button>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Settings2 className="w-4 h-4 text-cyan-500" />
                                    {hasUnsavedChanges && (
                                        <motion.div
                                            layoutId="config-dot"
                                            className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"
                                        />
                                    )}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Configuration</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleCollapse}
                                className="h-8 w-8 p-0 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl"
                            >
                                <PanelRightClose className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Scrollable Content */}
            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto scrollbar-thin-hover px-4 pb-4">
                    <Accordion type="multiple" defaultValue={["model", "variables", "parameters"]} className="w-full">

                        {/* Model Selection */}
                        <AccordionItem value="model" className="border-slate-200 dark:border-white/[0.04]">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Model</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <Select
                                    value={config.model}
                                    onValueChange={(val) => updateField('model', val)}
                                >
                                    <SelectTrigger className="w-full h-10 bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors rounded-lg">
                                        <div className="flex items-center justify-between w-full">
                                            <SelectValue>
                                                <span className="font-medium text-xs">{currentModel?.label}</span>
                                            </SelectValue>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-[#141416] border-slate-200 dark:border-white/[0.08]">
                                        {MODELS.map((m) => (
                                            <SelectItem
                                                key={m.value}
                                                value={m.value}
                                                className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-white/[0.06] focus:text-slate-900 dark:focus:text-white"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-xs">{m.label}</span>
                                                    <Badge className={cn("text-[9px] font-medium border-0", m.badgeColor)}>
                                                        {m.badge}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Variables */}
                        <AccordionItem value="variables" className="border-slate-200 dark:border-white/[0.04]">
                            <div className="flex items-center justify-between w-full pr-4 group/var">
                                <AccordionTrigger className="flex-1 hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Braces className="w-3.5 h-3.5 text-purple-600 dark:text-purple-500" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Variables</span>
                                    </div>
                                </AccordionTrigger>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={addVariable}
                                    className="h-5 px-1.5 text-[9px] text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 hover:bg-cyan-500/10 z-10"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add
                                </Button>
                            </div>
                            <AccordionContent className="pb-4 space-y-2">
                                {Object.keys(variables).length === 0 ? (
                                    <p className="text-[10px] text-slate-500 dark:text-slate-600 italic px-1">
                                        No variables. Use {"{{name}}"} in prompt.
                                    </p>
                                ) : (
                                    Object.entries(variables).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-2 group">
                                            <input
                                                type="text"
                                                value={key}
                                                onChange={(e) => updateVariable(key, e.target.value, value)}
                                                placeholder="name"
                                                className="w-1/3 h-8 px-2 text-[11px] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 font-mono"
                                            />
                                            <span className="text-slate-300 dark:text-slate-700">=</span>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => updateVariable(key, key, e.target.value)}
                                                placeholder="value"
                                                className="flex-1 h-8 px-2 text-[11px] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => removeVariable(key, e)}
                                                className="h-6 w-6 p-0 text-slate-400 dark:text-slate-600 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {/* Parameters */}
                        <AccordionItem value="parameters" className="border-slate-200 dark:border-white/[0.04]">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Parameters</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 space-y-6">
                                {/* Temperature */}
                                <div className="space-y-3 px-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Temperature</Label>
                                        <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                                            {config.temperature.toFixed(1)}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[config.temperature]}
                                        onValueChange={(v) => updateField('temperature', v[0])}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        className="[&_[role=slider]]:bg-cyan-500 [&_[role=slider]]:border-cyan-400"
                                    />
                                </div>

                                {/* Max Tokens */}
                                <div className="space-y-3 px-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Max Tokens</Label>
                                        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                            {config.max_tokens}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[config.max_tokens]}
                                        onValueChange={(v) => updateField('max_tokens', v[0])}
                                        min={1}
                                        max={4096}
                                        step={1}
                                        className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400"
                                    />
                                </div>

                                {/* Top P */}
                                <div className="space-y-3 px-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Top P</Label>
                                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                            {config.top_p.toFixed(2)}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[config.top_p]}
                                        onValueChange={(v) => updateField('top_p', v[0])}
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-400"
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>


                        {/* History */}
                        <AccordionItem value="history" className="border-0">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">History</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <VersionHistory
                                    projectId={projectId}
                                    currentVersionId={currentVersionId}
                                    onVersionRestored={onVersionRestored}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}

            {/* Footer */}
            {!isCollapsed && (
                <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-white/[0.06] bg-slate-100/30 dark:bg-black/20 space-y-3">
                    {hasUnsavedChanges && (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500/80 mb-2">
                            <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Unsaved Changes</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            className={cn(
                                "h-9 text-[10px] font-bold uppercase tracking-wider transition-all",
                                hasUnsavedChanges
                                    ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                    : "bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-500 hover:bg-slate-300 dark:hover:bg-white/10"
                            )}
                            onClick={onSave}
                            disabled={isSaving || !hasUnsavedChanges}
                        >
                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 text-[10px] font-bold uppercase tracking-wider border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 transition-all"
                            onClick={onSaveAsNew}
                            disabled={isSavingNew}
                        >
                            {isSavingNew ? <Loader2 className="w-3 h-3 animate-spin" /> : <GitBranch className="w-3 h-3 mr-2" />}
                            Branch
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full h-8 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
                        onClick={onReset}
                    >
                        <RotateCcw className="w-3 h-3 mr-2" />
                        Reset Defaults
                    </Button>
                </div>
            )}

        </div>
    )
}
