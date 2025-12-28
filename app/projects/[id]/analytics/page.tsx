import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsClient } from '@/components/analytics'

export default async function AnalyticsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id: projectId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch project name
    const { data: project } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single()

    if (!project) {
        redirect('/')
    }

    return <AnalyticsClient projectId={projectId} projectName={project.name} />
}
