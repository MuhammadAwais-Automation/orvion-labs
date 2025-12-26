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
        <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
            {/* Header - FIXED AT TOP */}
            <div className="flex-shrink-0 flex items-start justify-between p-6 pb-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Evaluation Configuration</h1>
                    <p className="text-slate-400 text-sm">
                        Configure how your AI outputs are automatically graded and validated
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving || !currentVersionId}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </Button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6">
                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">

                    {/* Tone & Style Validator */}
                    <motion.div
                        layout
                        initial={false}
                        animate={{
                            scale: config.tone_validator.enabled ? 1.02 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <Card
                            className={cn(
                                "transition-all duration-300 border",
                                config.tone_validator.enabled
                                    ? "bg-white/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] opacity-100"
                                    : "bg-white/5 border-white/10 opacity-70 grayscale"
                            )}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            config.tone_validator.enabled ? "bg-cyan-500/20" : "bg-slate-800"
                                        )}>
                                            <MessageSquare className={cn(
                                                "w-5 h-5",
                                                config.tone_validator.enabled ? "text-cyan-400" : "text-slate-400"
                                            )} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-slate-900 dark:text-white">🎭 Tone & Style</CardTitle>
                                            <CardDescription className="text-slate-400">
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
                                    />
                                </div>
                            </CardHeader>
                            <AnimatePresence>
                                {config.tone_validator.enabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <CardContent>
                                            <div className="space-y-2 pt-2">
                                                <label className="text-sm text-slate-600 dark:text-slate-300">Expected Tone</label>
                                                <Select
                                                    value={config.tone_validator.expected_tone}
                                                    onValueChange={(value) =>
                                                        setConfig({
                                                            ...config,
                                                            tone_validator: { ...config.tone_validator, expected_tone: value },
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                                        <SelectItem value="professional">Professional</SelectItem>
                                                        <SelectItem value="friendly">Friendly</SelectItem>
                                                        <SelectItem value="humorous">Humorous</SelectItem>
                                                        <SelectItem value="concise">Concise</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                        animate={{
                            scale: config.json_validator.enabled ? 1.02 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <Card
                            className={cn(
                                "transition-all duration-300 border h-full",
                                config.json_validator.enabled
                                    ? "bg-white/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)] opacity-100"
                                    : "bg-white/5 border-white/10 opacity-70 grayscale"
                            )}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            config.json_validator.enabled ? "bg-green-500/20" : "bg-slate-800"
                                        )}>
                                            <Code className={cn(
                                                "w-5 h-5",
                                                config.json_validator.enabled ? "text-green-400" : "text-slate-400"
                                            )} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white">JSON/Format Validator</CardTitle>
                                            <CardDescription className="text-slate-400">
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
                                    />
                                </div>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    {/* Custom Rubric */}
                    <motion.div
                        layout
                        initial={false}
                        animate={{
                            scale: config.custom_rubric.enabled ? 1.02 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="md:col-span-2"
                    >
                        <Card
                            className={cn(
                                "transition-all duration-300 border",
                                config.custom_rubric.enabled
                                    ? "bg-white/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] opacity-100"
                                    : "bg-white/5 border-white/10 opacity-70 grayscale"
                            )}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            config.custom_rubric.enabled ? "bg-orange-500/20" : "bg-slate-800"
                                        )}>
                                            <FileText className={cn(
                                                "w-5 h-5",
                                                config.custom_rubric.enabled ? "text-orange-400" : "text-slate-400"
                                            )} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white">📝 Custom Logic (The Rubric)</CardTitle>
                                            <CardDescription className="text-slate-400">
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
                                    />
                                </div>
                            </CardHeader>
                            <AnimatePresence>
                                {config.custom_rubric.enabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <CardContent>
                                            <div className="space-y-2 pt-2">
                                                <label className="text-sm text-slate-600 dark:text-slate-300">Custom Grading Instructions</label>
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
                                                    className="bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white min-h-[120px] font-mono text-sm"
                                                />
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
