import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlaygroundClient } from '@/components/playground-client'

/**
 * Playground Page - Thin Server Component wrapper
 * All logic handled by PlaygroundClient component
 */
export default async function PlaygroundPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch project with current version
    const { data: project, error } = await supabase
        .from('projects')
        .select(`
            *,
            current_version:prompt_versions!current_version_id(*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !project) {
        redirect('/')
    }

    // Extract version details with defaults
    let initialSystemPrompt = 'You are a helpful AI assistant.'
    let initialModelConfig = { model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 1000 }
    let currentVersionNumber = 1

    // @ts-ignore - Supabase types might not infer the join correctly
    const version = project.current_version

    if (version) {
        initialSystemPrompt = version.system_prompt || initialSystemPrompt
        initialModelConfig = version.model_config || initialModelConfig
        currentVersionNumber = version.version_number || 1
    }

    return (
        <PlaygroundClient
            projectId={id}
            projectName={project.name}
            initialSystemPrompt={initialSystemPrompt}
            initialModelConfig={initialModelConfig}
            currentVersion={currentVersionNumber}
            activeVersionId={project.current_version_id}
        />
    )
}
