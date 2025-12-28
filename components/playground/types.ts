import { ModelConfig } from '@/types/database'
import { Message, PlaygroundConfig } from '@/hooks/use-playground'
import { RefObject } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

/**
 * Props for the main playground layouts (mobile/desktop)
 */
export interface PlaygroundLayoutProps {
    projectId: string
    projectName: string
    currentVersion: number
    activeVersionId?: string

    // State from usePlayground
    systemPrompt: string
    setSystemPrompt: (value: string) => void
    config: PlaygroundConfig
    setConfig: (config: PlaygroundConfig) => void
    messages: Message[]
    userInput: string
    setUserInput: (value: string) => void
    isLoading: boolean
    isSaving: boolean
    isSavingNew: boolean
    variables: Record<string, string>
    setVariables: (vars: Record<string, string>) => void
    hasUnsavedChanges: boolean
    messagesEndRef: RefObject<HTMLDivElement | null>

    // Actions
    handleSend: () => Promise<void>
    handleSave: () => Promise<void>
    handleReset: () => void
    handleClearChat: () => void
    handleSaveAsNew: () => Promise<void>
    reloadFromServer: () => Promise<void>
    router: AppRouterInstance
}

/**
 * Props for the chat panel component
 */
export interface ChatPanelProps {
    messages: Message[]
    userInput: string
    setUserInput: (value: string) => void
    isLoading: boolean
    messagesEndRef: RefObject<HTMLDivElement | null>
    handleSend: () => Promise<void>
    handleClearChat: () => void
}

/**
 * Props for the prompt editor panel
 */
export interface PromptEditorPanelProps {
    systemPrompt: string
    setSystemPrompt: (value: string) => void
    currentVersion: number
    activeVersionId?: string
    projectId: string
    variables: Record<string, string>
    setVariables: (vars: Record<string, string>) => void
    showHistoryPanel: boolean
    setShowHistoryPanel: (show: boolean) => void
    reloadFromServer: () => Promise<void>
    router: AppRouterInstance
}

/**
 * Props for variables panel
 */
export interface VariablesPanelProps {
    variables: Record<string, string>
    setVariables: (vars: Record<string, string>) => void
}
