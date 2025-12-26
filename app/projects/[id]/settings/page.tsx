import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectSettings } from '@/components/project-settings'

export default async function SettingsPage({
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

    // Fetch project
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !project) {
        redirect('/')
    }

    return (
        <ProjectSettings
            projectId={id}
            projectName={project.name}
            projectDescription={project.description || ''}
        />
    )
}
