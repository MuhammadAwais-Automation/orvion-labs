'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Send, Bot, User, Loader2,
    Terminal, MessageSquare, Code2,
    Trash2, Sparkles
} from 'lucide-react'
import { simulateChat, updateActiveVersion, savePromptVersion } from '@/app/actions'
import { toast } from 'sonner'
import { ConfigurationPanel } from '@/components/playground/configuration-panel'
import { ModelConfig } from '@/types/database'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import type { ImperativePanelHandle } from 'react-resizable-panels'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    latency?: number
    tokens?: number
}

interface PlaygroundClientProps {
    projectId: string
    projectName: string
    initialSystemPrompt: string
    initialModelConfig: ModelConfig
    currentVersion: number
}

export function PlaygroundClient({
    projectId,
    projectName,
    initialSystemPrompt,
    initialModelConfig,
    currentVersion,
}: PlaygroundClientProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const configPanelRef = useRef<ImperativePanelHandle>(null)
    const [isConfigCollapsed, setIsConfigCollapsed] = useState(false)
    const router = useRouter()

    // State
    const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt)
    const [originalPrompt, setOriginalPrompt] = useState(initialSystemPrompt)

    // Model Config State
    const [config, setConfig] = useState({
        model: initialModelConfig.model || 'gpt-4o-mini',
        temperature: initialModelConfig.temperature || 0.7,
        max_tokens: initialModelConfig.max_tokens || 1000,
        top_p: initialModelConfig.top_p || 1.0
    })

    const [messages, setMessages] = useState<Message[]>([])
    const [userInput, setUserInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isSavingNew, setIsSavingNew] = useState(false)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Handle chat send
    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return

        const userMessage = userInput.trim()
        setUserInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }])
        setIsLoading(true)

        try {
            const result = await simulateChat(systemPrompt, userMessage, config)

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

    // Handle save as new version
    const handleSaveAsNew = async () => {
        setIsSavingNew(true)
        try {
            const result = await savePromptVersion(projectId, systemPrompt, config)
            if (result) {
                setOriginalPrompt(systemPrompt)
                toast.success('Saved as new version!')
                // Refresh page to load new version
                router.refresh()
            } else {
                toast.error('Failed to save new version')
            }
        } catch (error) {
            toast.error('Save failed')
        } finally {
            setIsSavingNew(false)
        }
    }

    const hasUnsavedChanges = systemPrompt !== originalPrompt

    return (
        <div className="h-full overflow-hidden bg-white dark:bg-[#09090b]" style={{ fontFamily: 'var(--font-sans)' }}>
            <ResizablePanelGroup direction="horizontal" className="h-full">

                {/* COLUMN 1: System Prompt Editor */}
                <ResizablePanel defaultSize={40} minSize={25}>
                    <div className="h-full border-r border-slate-200 dark:border-white/[0.06] flex flex-col bg-slate-50 dark:bg-[#0a0a0b]">
                        {/* Header */}
                        <div className="flex-shrink-0 h-14 flex items-center justify-between px-5 border-b border-slate-200 dark:border-white/[0.06] bg-white dark:bg-transparent">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                    <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">System Prompt</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 font-medium">
                                    v{currentVersion}
                                </Badge>
                                <span className="text-[10px] text-slate-500 dark:text-slate-600 font-mono bg-slate-100 dark:bg-white/[0.03] px-2 py-1 rounded">
                                    {systemPrompt.length} chars
                                </span>
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 relative group">
                            {/* Line Numbers */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-12 bg-slate-100 dark:bg-[#08080a] border-r border-slate-200 dark:border-white/[0.04] py-4 flex flex-col items-end pr-3 text-slate-400 dark:text-slate-700 text-[11px] leading-relaxed overflow-hidden select-none"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                {Array.from({ length: systemPrompt.split('\n').length || 1 }).map((_, i) => (
                                    <div key={i} className="h-[1.625rem]">{i + 1}</div>
                                ))}
                            </div>

                            <Textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                placeholder="Define your AI assistant's behavior here..."
                                className="w-full h-full pl-16 pr-5 py-4 resize-none bg-transparent border-0 text-slate-800 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:ring-0 focus-visible:ring-0 text-[13px] leading-relaxed"
                                style={{
                                    boxShadow: 'none',
                                    fontFamily: 'var(--font-mono)'
                                }}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* COLUMN 2: Chat Simulation */}
                <ResizablePanel defaultSize={35} minSize={20}>
                    <div className="h-full flex flex-col bg-white dark:bg-[#09090b]">
                        {/* Header */}
                        <div className="flex-shrink-0 h-14 flex items-center justify-between px-5 border-b border-slate-200 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Simulation</span>
                            </div>
                            {messages.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearChat}
                                    className="h-7 px-2.5 text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-lg"
                                >
                                    <Trash2 className="w-3 h-3 mr-1.5" />
                                    <span className="text-[11px]">Clear</span>
                                </Button>
                            )}
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin-hover">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-white/[0.06] flex items-center justify-center mb-5">
                                        <Sparkles className="w-7 h-7 text-slate-400 dark:text-slate-600" />
                                    </div>
                                    <h3 className="text-slate-600 dark:text-slate-400 font-medium mb-1.5">Ready to Test</h3>
                                    <p className="text-slate-500 dark:text-slate-600 text-sm max-w-[240px] leading-relaxed">
                                        Send a message to simulate a conversation with your prompt.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`group flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                        >
                                            {/* Avatar */}
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                                                : 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08]'
                                                }`}>
                                                {msg.role === 'user' ? (
                                                    <User className="w-4 h-4 text-white" />
                                                ) : (
                                                    <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                                )}
                                            </div>

                                            {/* Bubble */}
                                            <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user'
                                                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-tr-md'
                                                    : 'bg-slate-100 dark:bg-[#18181b] text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] rounded-tl-md'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[9px] text-slate-400 dark:text-slate-700 mt-1 px-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3 animate-in fade-in">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                            </div>
                                            <div className="bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3.5">
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0a0a0b]">
                            <div className="relative">
                                <Input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-white dark:bg-[#141416] border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 h-11 pl-4 pr-12 rounded-xl focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                    style={{ fontFamily: 'var(--font-sans)' }}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !userInput.trim()}
                                    className="absolute right-1.5 top-1.5 h-8 w-8 p-0 rounded-lg bg-cyan-100 dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all duration-200 disabled:opacity-30"
                                >
                                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* COLUMN 3: Configuration Panel */}
                <ResizablePanel
                    ref={configPanelRef}
                    defaultSize={25}
                    minSize={15}
                    collapsible
                    collapsedSize={0}
                    onCollapse={() => setIsConfigCollapsed(true)}
                    onExpand={() => setIsConfigCollapsed(false)}
                >
                    <ConfigurationPanel
                        projectId={projectId}
                        config={config}
                        onConfigChange={setConfig}
                        isSaving={isSaving}
                        isSavingNew={isSavingNew}
                        hasUnsavedChanges={hasUnsavedChanges}
                        onSave={handleSave}
                        onSaveAsNew={handleSaveAsNew}
                        onReset={handleReset}
                        onVersionRestored={() => router.refresh()}
                        isCollapsed={isConfigCollapsed}
                        onToggleCollapse={() => {
                            if (isConfigCollapsed) {
                                configPanelRef.current?.expand()
                            } else {
                                configPanelRef.current?.collapse()
                            }
                        }}
                    />
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    )
}
