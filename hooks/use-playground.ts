'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { simulateChat, updateActiveVersion, savePromptVersion } from '@/app/actions'
import { toast } from 'sonner'
import { ModelConfig } from '@/types/database'

export interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    latency?: number
    tokens?: number
}

export interface PlaygroundConfig {
    model: string
    temperature: number
    max_tokens: number
    top_p: number
}

interface UsePlaygroundProps {
    projectId: string
    initialSystemPrompt: string
    initialModelConfig: ModelConfig
}

export function usePlayground({
    projectId,
    initialSystemPrompt,
    initialModelConfig
}: UsePlaygroundProps) {
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // State
    const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt)
    const [originalPrompt, setOriginalPrompt] = useState(initialSystemPrompt)

    // Model Config State
    const [config, setConfig] = useState<PlaygroundConfig>({
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
    const [variables, setVariables] = useState<Record<string, string>>({})

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Auto-detect variables from {{variable_name}} pattern in systemPrompt
    useEffect(() => {
        const regex = /\{\{(\w+)\}\}/g
        const detectedVars: string[] = []
        let match

        while ((match = regex.exec(systemPrompt)) !== null) {
            const varName = match[1]
            if (!detectedVars.includes(varName)) {
                detectedVars.push(varName)
            }
        }

        // Update variables - add new ones, keep existing values
        setVariables(prev => {
            const updated: Record<string, string> = {}
            detectedVars.forEach(varName => {
                // Keep existing value if exists, otherwise empty string
                updated[varName] = prev[varName] ?? ''
            })
            return updated
        })
    }, [systemPrompt])

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

    // Handle clear chat
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

    return {
        // Refs
        messagesEndRef,

        // State
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

        // Actions
        handleSend,
        handleSave,
        handleReset,
        handleClearChat,
        handleSaveAsNew,

        // Router
        router
    }
}
