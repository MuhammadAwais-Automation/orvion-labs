'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Send, Bot, User, Loader2,
    MessageSquare, Code2,
    Trash2, Sparkles
} from 'lucide-react'
import { ConfigurationPanel } from '@/components/playground/configuration-panel'
import { cn } from '@/lib/utils'
import { ModelConfig } from '@/types/database'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { usePlayground } from '@/hooks/use-playground'

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
    const configPanelRef = useRef<ImperativePanelHandle>(null)
    const [isConfigCollapsed, setIsConfigCollapsed] = useState(false)

    // Use the extracted hook for all state and handlers
    const {
        messagesEndRef,
        systemPrompt,
        setSystemPrompt,
        config,
        setConfig,
        messages,
        userInput,
        setUserInput,
        isLoading,
        isSaving,
        isSavingNew,
        variables,
        setVariables,
        hasUnsavedChanges,
        handleSend,
        handleSave,
        handleReset,
        handleClearChat,
        handleSaveAsNew,
        router
    } = usePlayground({
        projectId,
        initialSystemPrompt,
        initialModelConfig
    })

    return (
        <div className="h-full flex overflow-hidden bg-white dark:bg-[#09090b]" style={{ fontFamily: 'var(--font-sans)' }}>
            <div className="flex-1 flex overflow-hidden">
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
                            <div className="flex-1 relative group bg-white dark:bg-[#08080a]">
                                <Textarea
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    placeholder="Define your AI assistant's behavior here..."
                                    className="w-full h-full px-5 py-4 resize-none bg-transparent border-0 text-slate-800 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:ring-0 focus-visible:ring-0 text-[13px] leading-relaxed"
                                    style={{
                                        boxShadow: 'none',
                                        fontFamily: 'var(--font-mono)'
                                    }}
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

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

                </ResizablePanelGroup>
            </div>

            {/* COLUMN 3: Configuration Panel - Fixed Width & Collapsible */}
            <div
                className={cn(
                    "flex-shrink-0 transition-all duration-300 ease-in-out bg-slate-50 dark:bg-[#0a0a0b] flex flex-col relative",
                    isConfigCollapsed ? "w-0" : "w-[300px] border-l border-slate-200 dark:border-white/[0.06]"
                )}
            >
                <ConfigurationPanel
                    projectId={projectId}
                    config={config}
                    onConfigChange={setConfig}
                    variables={variables}
                    onVariablesChange={setVariables}
                    isSaving={isSaving}
                    isSavingNew={isSavingNew}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onSave={handleSave}
                    onSaveAsNew={handleSaveAsNew}
                    onReset={handleReset}
                    onVersionRestored={() => router.refresh()}
                    isCollapsed={isConfigCollapsed}
                    onToggleCollapse={() => setIsConfigCollapsed(!isConfigCollapsed)}
                />
            </div>
        </div>
    )
}
