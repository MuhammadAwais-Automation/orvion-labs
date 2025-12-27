'use client'

import { useState } from 'react'
import { MessageSquare, Code, FileText, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { updateEvaluationConfig } from '@/app/actions'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EvaluationConfig {
    // ai_judge removed - it is now standard
    tone_validator: { enabled: boolean; expected_tone: string }
    json_validator: { enabled: boolean }
    custom_rubric: { enabled: boolean; instructions: string }
}

interface EvaluationSettingsProps {
    projectId: string
    projectName: string
    currentVersionId: string | null
    initialConfig: EvaluationConfig
}

export function EvaluationSettings({
    projectId,
    projectName,
    currentVersionId,
    initialConfig,
}: EvaluationSettingsProps) {
    const [config, setConfig] = useState<EvaluationConfig>(initialConfig)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!currentVersionId) {
            toast.error('No active version found')
            return
        }

        setIsSaving(true)
        try {
            // Cast to any to satisfy the server action type if it still expects ai_judge
            const result = await updateEvaluationConfig(currentVersionId, config as any)

            if (result.success) {
                toast.success('Evaluation config saved!')
            } else {
                toast.error('Failed to save config')
            }
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Failed to save config')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#09090b] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Evaluation Configuration</h1>
                        <p className="text-slate-500 dark:text-slate-500 font-medium text-xs md:text-sm">
                            Configure how your AI outputs are automatically graded and validated
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !currentVersionId}
                        className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] rounded-xl px-4 md:px-6 h-10 md:h-11 text-xs font-bold uppercase tracking-widest transition-all active:scale-95 w-full md:w-auto"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 md:pb-8 scrollbar-thin-hover">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Tone & Style Validator */}
                    <motion.div
                        layout
                        initial={false}
                        animate={{ scale: config.tone_validator.enabled ? 1 : 1 }}
                        className="h-full"
                    >
                        <Card
                            className={cn(
                                "h-full transition-all duration-300 border-2 overflow-hidden rounded-2xl",
                                config.tone_validator.enabled
                                    ? "bg-white dark:bg-white/[0.01] border-indigo-500/30 dark:border-indigo-500/20 shadow-xl shadow-indigo-500/5"
                                    : "bg-white/50 dark:bg-transparent border-slate-200 dark:border-white/[0.05] grayscale opacity-60"
                            )}
                        >
                            <CardHeader className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300",
                                            config.tone_validator.enabled
                                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                                : "bg-slate-100 dark:bg-white/[0.05] text-slate-400"
                                        )}>
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                                Tone & Style
                                            </CardTitle>
                                            <CardDescription className="text-xs font-medium text-slate-500 mt-1">
                                                Validates response voice and style
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={config.tone_validator.enabled}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                tone_validator: { ...config.tone_validator, enabled: checked },
                                            })
                                        }
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                </div>
                            </CardHeader>
                            <AnimatePresence initial={false}>
                                {config.tone_validator.enabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <CardContent className="px-6 pb-6 pt-0">
                                            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.05] space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Expected Tone</label>
                                                    <Select
                                                        value={config.tone_validator.expected_tone}
                                                        onValueChange={(value) =>
                                                            setConfig({
                                                                ...config,
                                                                tone_validator: { ...config.tone_validator, expected_tone: value },
                                                            })
                                                        }
                                                    >
                                                        <SelectTrigger className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-xl h-12">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/[0.1] rounded-xl">
                                                            <SelectItem value="professional">🤵 Professional</SelectItem>
                                                            <SelectItem value="friendly">👋 Friendly</SelectItem>
                                                            <SelectItem value="humorous">😂 Humorous</SelectItem>
                                                            <SelectItem value="concise">⚡ Concise</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>

                    {/* JSON/Format Validator */}
                    <motion.div
                        layout
                        initial={false}
                        animate={{ scale: config.json_validator.enabled ? 1 : 1 }}
                        className="h-full"
                    >
                        <Card
                            className={cn(
                                "h-full transition-all duration-300 border-2 overflow-hidden rounded-2xl",
                                config.json_validator.enabled
                                    ? "bg-white dark:bg-white/[0.01] border-emerald-500/30 dark:border-emerald-500/20 shadow-xl shadow-emerald-500/5"
                                    : "bg-white/50 dark:bg-transparent border-slate-200 dark:border-white/[0.05] grayscale opacity-60"
                            )}
                        >
                            <CardHeader className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300",
                                            config.json_validator.enabled
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-slate-100 dark:bg-white/[0.05] text-slate-400"
                                        )}>
                                            <Code className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                                JSON/Format Validator
                                            </CardTitle>
                                            <CardDescription className="text-xs font-medium text-slate-500 mt-1">
                                                Ensures valid JSON output structure
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={config.json_validator.enabled}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                json_validator: { enabled: checked },
                                            })
                                        }
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                </div>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    {/* Custom Rubric */}
                    <motion.div
                        layout
                        initial={false}
                        animate={{ scale: config.custom_rubric.enabled ? 1 : 1 }}
                        className="md:col-span-2"
                    >
                        <Card
                            className={cn(
                                "h-full transition-all duration-300 border-2 overflow-hidden rounded-2xl",
                                config.custom_rubric.enabled
                                    ? "bg-white dark:bg-white/[0.01] border-amber-500/30 dark:border-amber-500/20 shadow-xl shadow-amber-500/5"
                                    : "bg-white/50 dark:bg-transparent border-slate-200 dark:border-white/[0.05] grayscale opacity-60"
                            )}
                        >
                            <CardHeader className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300",
                                            config.custom_rubric.enabled
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                : "bg-slate-100 dark:bg-white/[0.05] text-slate-400"
                                        )}>
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                                Custom Logic (The Rubric)
                                            </CardTitle>
                                            <CardDescription className="text-xs font-medium text-slate-500 mt-1">
                                                Define custom grading criteria specific to your use case
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={config.custom_rubric.enabled}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                custom_rubric: { ...config.custom_rubric, enabled: checked },
                                            })
                                        }
                                        className="data-[state=checked]:bg-amber-600"
                                    />
                                </div>
                            </CardHeader>
                            <AnimatePresence initial={false}>
                                {config.custom_rubric.enabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <CardContent className="px-6 pb-6 pt-0">
                                            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.05] space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Custom Grading Instructions</label>
                                                    <Textarea
                                                        value={config.custom_rubric.instructions}
                                                        onChange={(e) =>
                                                            setConfig({
                                                                ...config,
                                                                custom_rubric: {
                                                                    ...config.custom_rubric,
                                                                    instructions: e.target.value,
                                                                },
                                                            })
                                                        }
                                                        placeholder="e.g., 'Ensure the answer does not mention competitors', 'Must include a call-to-action'"
                                                        className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-2xl h-32 p-4 font-mono text-xs focus:ring-amber-500/20"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
