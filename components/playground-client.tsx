'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Send, Bot, User, Loader2,
    MessageSquare, Code2,
    Trash2, Sparkles, Settings2, Clock, Braces
} from 'lucide-react'
import { ConfigurationPanel } from '@/components/playground/configuration-panel'
import { SyntaxHighlightedEditor } from '@/components/playground/syntax-highlighted-editor'
import { VersionHistory } from '@/components/playground/version-history'
import { cn } from '@/lib/utils'
import { ModelConfig } from '@/types/database'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { usePlayground } from '@/hooks/use-playground'
import { useIsMobile } from '@/hooks/use-media-query'

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
    const [mobileActiveTab, setMobileActiveTab] = useState<'prompt' | 'chat' | 'config'>('chat')
    const [showHistoryPanel, setShowHistoryPanel] = useState(false)
    const isMobile = useIsMobile()

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

    // Mobile Layout
    if (isMobile) {
        return (
            <div className="h-full flex flex-col bg-white dark:bg-[#09090b] pt-14 pb-16">
                {/* Mobile Tab Bar */}
                <div className="flex-shrink-0 h-12 flex items-center border-b border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0a0a0b]">
                    <button
                        onClick={() => setMobileActiveTab('prompt')}
                        className={cn(
                            "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                            mobileActiveTab === 'prompt'
                                ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500"
                                : "text-slate-500"
                        )}
                    >
                        <Code2 className="w-4 h-4" />
                        <span>Prompt</span>
                    </button>
                    <button
                        onClick={() => setMobileActiveTab('chat')}
                        className={cn(
                            "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                            mobileActiveTab === 'chat'
                                ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500"
                                : "text-slate-500"
                        )}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat</span>
                    </button>
                    <button
                        onClick={() => setMobileActiveTab('config')}
                        className={cn(
                            "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-colors relative",
                            mobileActiveTab === 'config'
                                ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500"
                                : "text-slate-500"
                        )}
                    >
                        <Settings2 className="w-4 h-4" />
                        <span>Config</span>
                        {hasUnsavedChanges && (
                            <div className="absolute top-2 right-4 w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {/* Prompt Tab */}
                    {mobileActiveTab === 'prompt' && (
                        <div className="h-full flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/[0.06]">
                                {/* Version History Sheet Trigger */}
                                <Sheet open={showHistoryPanel} onOpenChange={setShowHistoryPanel}>
                                    <SheetTrigger asChild>
                                        <button className="flex items-center gap-1.5 text-[10px] border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 font-medium px-2 py-1 rounded-md transition-colors">
                                            <Clock className="w-3 h-3" />
                                            v{currentVersion}
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-white dark:bg-[#0c0c0e]">
                                        <SheetHeader className="p-4 border-b border-slate-200 dark:border-white/[0.06]">
                                            <SheetTitle className="text-sm font-bold text-slate-700 dark:text-slate-300">Version History</SheetTitle>
                                        </SheetHeader>
                                        <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                                            <VersionHistory
                                                projectId={projectId}
                                                onVersionRestored={() => {
                                                    router.refresh()
                                                    setShowHistoryPanel(false)
                                                }}
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <span className="text-[10px] text-slate-500 font-mono">
                                    {systemPrompt.length} chars
                                </span>
                            </div>
                            {/* Resizable Content Area */}
                            <ResizablePanelGroup direction="vertical" className="flex-1">
                                {/* Editor Panel */}
                                <ResizablePanel defaultSize={Object.keys(variables).length > 0 ? 60 : 100} minSize={30}>
                                    <div className="h-full">
                                        <SyntaxHighlightedEditor
                                            value={systemPrompt}
                                            onChange={setSystemPrompt}
                                            placeholder="Define your AI assistant's behavior here..."
                                            className="h-full"
                                        />
                                    </div>
                                </ResizablePanel>

                                {/* Variables Panel - Only show if variables detected */}
                                {Object.keys(variables).length > 0 && (
                                    <>
                                        <ResizableHandle className="h-2 bg-slate-100 dark:bg-white/[0.03] hover:bg-purple-500/20 transition-colors" />
                                        <ResizablePanel defaultSize={40} minSize={20}>
                                            <div className="h-full overflow-y-auto bg-slate-50 dark:bg-[#0a0a0b] p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Braces className="w-3.5 h-3.5 text-purple-600 dark:text-purple-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Variables</span>
                                                    <span className="text-[9px] text-slate-400">({Object.keys(variables).length})</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {Object.entries(variables).map(([key, value]) => (
                                                        <div key={key} className="flex items-center gap-2">
                                                            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                                                {`{{${key}}}`}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={value}
                                                                onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                                                                placeholder={`Enter ${key}...`}
                                                                className="flex-1 h-7 px-2 text-[11px] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </ResizablePanel>
                                    </>
                                )}
                            </ResizablePanelGroup>
                        </div>
                    )}

                    {/* Chat Tab */}
                    {mobileActiveTab === 'chat' && (
                        <div className="h-full flex flex-col">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/[0.06] flex items-center justify-center mb-4">
                                            <Sparkles className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <h3 className="text-slate-600 dark:text-slate-400 font-medium mb-1">Ready to Test</h3>
                                        <p className="text-slate-500 text-sm max-w-[200px]">
                                            Send a message to simulate a conversation.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                            >
                                                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${msg.role === 'user'
                                                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                                                    : 'bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08]'
                                                    }`}>
                                                    {msg.role === 'user' ? (
                                                        <User className="w-3.5 h-3.5 text-white" />
                                                    ) : (
                                                        <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                                    )}
                                                </div>
                                                <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-3 py-2 rounded-xl text-sm ${msg.role === 'user'
                                                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                                                        : 'bg-slate-100 dark:bg-[#18181b] text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center">
                                                    <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                                </div>
                                                <div className="bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.06] rounded-xl px-3 py-2.5">
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

                            {/* Input */}
                            <div className="flex-shrink-0 p-3 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0a0a0b]">
                                <div className="relative">
                                    <Input
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="w-full bg-white dark:bg-[#141416] border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 h-11 pl-4 pr-12 rounded-xl"
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={isLoading || !userInput.trim()}
                                        className="absolute right-1.5 top-1.5 h-8 w-8 p-0 rounded-lg bg-cyan-100 dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white disabled:opacity-30"
                                    >
                                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Config Tab */}
                    {mobileActiveTab === 'config' && (
                        <div className="h-full overflow-y-auto">
                            <ConfigurationPanel
                                config={config}
                                onConfigChange={setConfig}
                                isSaving={isSaving}
                                isSavingNew={isSavingNew}
                                hasUnsavedChanges={hasUnsavedChanges}
                                onSave={handleSave}
                                onSaveAsNew={handleSaveAsNew}
                                onReset={handleReset}
                                isCollapsed={false}
                                onToggleCollapse={() => { }}
                            />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Desktop Layout (Original)
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
                                    {/* Version History Sheet */}
                                    <Sheet open={showHistoryPanel} onOpenChange={setShowHistoryPanel}>
                                        <SheetTrigger asChild>
                                            <button className="flex items-center gap-1.5 text-[10px] border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 font-medium px-2 py-1 rounded-md transition-colors">
                                                <Clock className="w-3 h-3" />
                                                v{currentVersion}
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-[350px] p-0 bg-white dark:bg-[#0c0c0e]">
                                            <SheetHeader className="p-4 border-b border-slate-200 dark:border-white/[0.06]">
                                                <SheetTitle className="text-sm font-bold text-slate-700 dark:text-slate-300">Version History</SheetTitle>
                                            </SheetHeader>
                                            <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                                                <VersionHistory
                                                    projectId={projectId}
                                                    onVersionRestored={() => {
                                                        router.refresh()
                                                        setShowHistoryPanel(false)
                                                    }}
                                                />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-600 font-mono bg-slate-100 dark:bg-white/[0.03] px-2 py-1 rounded">
                                        {systemPrompt.length} chars
                                    </span>
                                </div>
                            </div>

                            {/* Resizable Content Area */}
                            <ResizablePanelGroup direction="vertical" className="flex-1">
                                {/* Editor Panel */}
                                <ResizablePanel defaultSize={Object.keys(variables).length > 0 ? 60 : 100} minSize={30}>
                                    <div className="h-full bg-white dark:bg-[#08080a]">
                                        <SyntaxHighlightedEditor
                                            value={systemPrompt}
                                            onChange={setSystemPrompt}
                                            placeholder="Define your AI assistant's behavior here..."
                                            className="h-full"
                                        />
                                    </div>
                                </ResizablePanel>

                                {/* Variables Panel - Only show if variables detected */}
                                {Object.keys(variables).length > 0 && (
                                    <>
                                        <ResizableHandle className="h-2 bg-slate-100 dark:bg-white/[0.03] hover:bg-purple-500/20 transition-colors" />
                                        <ResizablePanel defaultSize={40} minSize={15}>
                                            <div className="h-full overflow-y-auto bg-slate-50 dark:bg-[#0a0a0b] p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Braces className="w-4 h-4 text-purple-600 dark:text-purple-500" />
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Variables</span>
                                                    <span className="text-[10px] text-slate-400">({Object.keys(variables).length} detected)</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {Object.entries(variables).map(([key, value]) => (
                                                        <div key={key} className="flex items-center gap-3">
                                                            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded min-w-[80px]">
                                                                {`{{${key}}}`}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={value}
                                                                onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                                                                placeholder={`Enter ${key}...`}
                                                                className="flex-1 h-8 px-3 text-[12px] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </ResizablePanel>
                                    </>
                                )}
                            </ResizablePanelGroup>
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
                    config={config}
                    onConfigChange={setConfig}
                    isSaving={isSaving}
                    isSavingNew={isSavingNew}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onSave={handleSave}
                    onSaveAsNew={handleSaveAsNew}
                    onReset={handleReset}
                    isCollapsed={isConfigCollapsed}
                    onToggleCollapse={() => setIsConfigCollapsed(!isConfigCollapsed)}
                />
            </div>
        </div>
    )
}
