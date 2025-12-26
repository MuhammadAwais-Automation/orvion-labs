'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Send, Bot, User, Loader2,
    Terminal, MessageSquare, Code2,
    Trash2
} from 'lucide-react'
import { simulateChat, updateActiveVersion } from '@/app/actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ConfigurationPanel } from '@/components/playground/configuration-panel'
import { cn } from '@/lib/utils'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export default function PlaygroundPage() {
    const params = useParams()
    const projectId = params.id as string
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // State
    const [systemPrompt, setSystemPrompt] = useState('')
    const [originalPrompt, setOriginalPrompt] = useState('')

    // Model Config State
    const [config, setConfig] = useState({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1.0
    })

    const [messages, setMessages] = useState<Message[]>([])
    const [userInput, setUserInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [variables, setVariables] = useState<Record<string, string>>({})
    const [isConfigCollapsed, setIsConfigCollapsed] = useState(false)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Callback when version is restored from history
    const handleVersionRestored = () => {
        // Re-fetch project to get new current_version_id, then load prompt
        // Or simply trigger the useEffect dependency if we can
        // Best approach: re-run the fetching logic. 
        // We can toggle a state variable to trigger re-fetch or call a function.
        // Let's modify the useEffect to depend on a versionTrigger state.
        setVersionTrigger(prev => prev + 1)
    }

    const [versionTrigger, setVersionTrigger] = useState(0)

    // Load current prompt version
    useEffect(() => {
        async function loadPrompt() {
            setIsInitialLoading(true)
            const supabase = createClient()

            const { data: project } = await supabase
                .from('projects')
                .select('current_version_id')
                .eq('id', projectId)
                .single()

            if (project?.current_version_id) {
                setCurrentVersionId(project.current_version_id)
                const { data: version } = await supabase
                    .from('prompt_versions')
                    .select('system_prompt, model_config')
                    .eq('id', project.current_version_id)
                    .single()

                if (version) {
                    setSystemPrompt(version.system_prompt || '')
                    setOriginalPrompt(version.system_prompt || '')
                    const savedConfig = version.model_config as any

                    setConfig({
                        model: savedConfig?.model || 'gpt-4o-mini',
                        temperature: savedConfig?.temperature || 0.7,
                        max_tokens: savedConfig?.max_tokens || 1000,
                        top_p: savedConfig?.top_p || 1.0
                    })
                }
            }
            setIsInitialLoading(false)
        }
        loadPrompt()
    }, [projectId, versionTrigger])

    const [currentVersionId, setCurrentVersionId] = useState<string | undefined>(undefined)

    // Handle chat send
    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return

        const userMessage = userInput.trim()
        setUserInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }])
        setIsLoading(true)

        try {
            // Replace {{variable}} placeholders in the system prompt
            let filledPrompt = systemPrompt
            Object.entries(variables).forEach(([key, value]) => {
                const regex = new RegExp(`{{${key}}}`, 'g')
                filledPrompt = filledPrompt.replace(regex, value)
            })
            const result = await simulateChat(filledPrompt, userMessage, config)

            if (result.success && result.response) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.response, timestamp: new Date() }])
            } else {
                toast.error(result.error || 'Failed to get response')
            }
        } catch (error) {
            toast.error('Chat simulation failed')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle save
    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await updateActiveVersion(projectId, systemPrompt, config)
            if (result.success) {
                setOriginalPrompt(systemPrompt)
                toast.success('Configuration saved!')
            } else {
                toast.error(result.error || 'Failed to save')
            }
        } catch (error) {
            toast.error('Save failed')
        } finally {
            setIsSaving(false)
        }
    }

    // Handle reset
    const handleReset = () => {
        setSystemPrompt(originalPrompt)
        toast.info('Prompt reset to saved version')
    }

    const handleClearChat = () => {
        setMessages([])
    }

    // Determine if unsaved changes exist (simplified check)
    const hasUnsavedChanges = systemPrompt !== originalPrompt

    if (isInitialLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-[#050505]">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto" />
                    <p className="text-slate-500 text-sm font-mono">INITIALIZING SYSTEM...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex overflow-hidden bg-black text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

            <div className="flex-1 flex overflow-hidden">
                {/* COLUMN 1: System Prompt Editor (Flexible Width) */}
                <div className="flex-1 border-r border-white/10 flex flex-col bg-[#050505]/50 min-w-[300px] backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/10 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                                <Code2 className="w-3.5 h-3.5 text-cyan-500" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">System Prompt</span>
                        </div>
                        <span className="text-[10px] bg-white/5 border border-white/10 text-slate-500 px-2 py-1 rounded font-mono">
                            {systemPrompt.length} chars
                        </span>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative group bg-gradient-to-b from-transparent to-black/20">
                        {/* Fake Line Numbers */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-white/5 py-4 flex flex-col items-end pr-3 text-slate-700 font-mono text-xs leading-relaxed overflow-hidden select-none opacity-40">
                            {Array.from({ length: 50 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                        </div>

                        <Textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="Define your AI assistant's behavior here..."
                            className="w-full h-full pl-16 pr-6 py-4 resize-none bg-transparent border-0 text-slate-300 placeholder:text-slate-700/50 focus:ring-0 focus-visible:ring-0 text-sm leading-relaxed font-mono"
                            style={{ boxShadow: 'none' }}
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* COLUMN 2: Chat Simulation */}
                <div className="flex-1 flex flex-col bg-black/50 min-w-[350px] relative">

                    {/* subtle grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                    {/* Header */}
                    <div className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/10 bg-white/[0.01] relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Simulation</span>
                        </div>
                        {messages.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearChat}
                                className="h-7 px-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                <span className="text-[10px] uppercase font-medium tracking-wide">Clear</span>
                            </Button>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 shadow-2xl shadow-black">
                                    <Terminal className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-slate-300 font-semibold mb-2 tracking-tight">Simulation Ready</h3>
                                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                                    Enter a message below to test your system prompt's behavior in real-time.
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        {/* Avatar */}
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg border ${msg.role === 'user'
                                            ? 'bg-cyan-950/30 border-cyan-500/20 text-cyan-500'
                                            : 'bg-zinc-900 border-white/10 text-emerald-500'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                <User className="w-4 h-4" />
                                            ) : (
                                                <Bot className="w-4 h-4" />
                                            )}
                                        </div>

                                        {/* Bubble */}
                                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-5 py-3.5 text-sm leading-relaxed shadow-md backdrop-blur-sm border ${msg.role === 'user'
                                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-100 rounded-2xl rounded-tr-none'
                                                : 'bg-[#18181b]/80 border-white/10 text-slate-300 rounded-2xl rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-slate-600 mt-2 px-1 font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-4 animate-pulse">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="bg-[#18181b]/80 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center">
                                            <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="flex-shrink-0 p-6 relative z-20">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <Input
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type a test message..."
                                className="relative w-full bg-[#0c0c0e] border-white/10 text-slate-200 placeholder:text-slate-600 h-14 pl-5 pr-14 rounded-xl focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-xl"
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !userInput.trim()}
                                className="absolute right-2 top-2 h-10 w-10 p-0 rounded-lg bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-300"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-[10px] text-slate-700 font-mono">
                                PRESS ENTER TO SEND
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUMN 3: Right Sidebar (Configuration) - Fixed Width & Collapsible */}
            <div
                className={cn(
                    "flex-shrink-0 border-l border-white/10 transition-all duration-300 ease-in-out bg-[#0a0a0b] overflow-hidden flex flex-col",
                    isConfigCollapsed ? "w-[48px]" : "w-[300px]"
                )}
            >
                <ConfigurationPanel
                    projectId={projectId}
                    currentVersionId={currentVersionId}
                    config={config}
                    onConfigChange={setConfig}
                    variables={variables}
                    onVariablesChange={setVariables}
                    isSaving={isSaving}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onSave={handleSave}
                    onReset={handleReset}
                    onVersionRestored={handleVersionRestored}
                    isCollapsed={isConfigCollapsed}
                    onToggleCollapse={() => setIsConfigCollapsed(!isConfigCollapsed)}
                />
            </div>
        </div>
    )
}
