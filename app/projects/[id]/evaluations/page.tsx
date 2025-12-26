import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EvaluationSettings } from '@/components/evaluation-settings'

export default async function EvaluationsPage({
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

    // Fetch project with current version evaluation config
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
            *,
            current_version:prompt_versions!current_version_id(evaluation_config)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (projectError || !project) {
        redirect('/')
    }

    // Fetch current version evaluation config
    let evaluationConfig = {
        ai_judge: { enabled: false, strictness: 50 },
        tone_validator: { enabled: false, expected_tone: 'professional' },
        json_validator: { enabled: false },
        custom_rubric: { enabled: false, instructions: '' },
    }

    // @ts-ignore
    const version = project.current_version

    if (version?.evaluation_config) {
        evaluationConfig = { ...evaluationConfig, ...version.evaluation_config }
    }

    return (
        <EvaluationSettings
            projectId={id}
            projectName={project.name}
            currentVersionId={project.current_version_id}
            initialConfig={evaluationConfig}
        />
    )
}
