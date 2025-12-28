'use client'

import { ModelConfig } from '@/types/database'
import { usePlayground } from '@/hooks/use-playground'
import { useIsMobile } from '@/hooks/use-media-query'
import { PlaygroundMobile } from '@/components/playground/playground-mobile'
import { PlaygroundDesktop } from '@/components/playground/playground-desktop'

interface PlaygroundClientProps {
    projectId: string
    projectName: string
    initialSystemPrompt: string
    initialModelConfig: ModelConfig
    currentVersion: number
    activeVersionId?: string
}

/**
 * PlaygroundClient - Main entry point for Playground feature
 * 
 * This component:
 * 1. Uses usePlayground hook for all state management
 * 2. Detects mobile/desktop via useIsMobile hook
 * 3. Renders appropriate layout component
 * 
 * Architecture: Thin wrapper that delegates to specialized layout components
 */
export function PlaygroundClient({
    projectId,
    projectName,
    initialSystemPrompt,
    initialModelConfig,
    currentVersion,
    activeVersionId,
}: PlaygroundClientProps) {
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
        reloadFromServer,
        router
    } = usePlayground({
        projectId,
        initialSystemPrompt,
        initialModelConfig
    })

    // Shared props for both layouts
    const layoutProps = {
        projectId,
        projectName,
        currentVersion,
        activeVersionId,
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
        messagesEndRef,
        handleSend,
        handleSave,
        handleReset,
        handleClearChat,
        handleSaveAsNew,
        reloadFromServer,
        router
    }

    // Render appropriate layout based on device
    if (isMobile) {
        return <PlaygroundMobile {...layoutProps} />
    }

    return <PlaygroundDesktop {...layoutProps} />
}
