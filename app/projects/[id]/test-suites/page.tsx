import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TestSuiteManager } from '@/components/test-suite-manager'

export default async function TestSuitesPage({
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

    // Parallel fetch: Project and Test Cases
    const [projectResult, testCasesResult] = await Promise.all([
        supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single(),
        supabase
            .from('test_cases')
            .select('*')
            .eq('project_id', id)
            .order('created_at', { ascending: false })
    ])

    const project = projectResult.data
    const testCases = testCasesResult.data

    if (projectResult.error || !project) {
        redirect('/')
    }

    // Fetch current version details
    let currentSystemPrompt = 'You are a helpful AI assistant.'
    let currentModelConfig = { model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 1000 }

    if (project.current_version_id) {
        const { data: version } = await supabase
            .from('prompt_versions')
            .select('*')
            .eq('id', project.current_version_id)
            .single()

        if (version) {
            currentSystemPrompt = version.system_prompt
            currentModelConfig = version.model_config
        }
    }

    return (
        <div className="h-full">
            <TestSuiteManager
                projectId={id}
                projectName={project.name}
                testCases={testCases || []}
                systemPrompt={currentSystemPrompt}
                modelConfig={currentModelConfig}
            />
        </div>
    )
}
