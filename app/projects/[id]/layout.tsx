import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProjectHeader } from '@/components/project-header'

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode
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
        <div className="flex flex-col h-full bg-slate-50 dark:bg-black transition-colors">
            {/* Header */}
            <ProjectHeader projectId={id} projectName={project.name} />

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                {children}
            </main>
        </div>
    )
}
