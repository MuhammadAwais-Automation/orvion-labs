import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectsManager } from '@/components/dashboard/projects-manager'
import { CreateProjectButton } from '@/components/create-project-button'

export const metadata = {
    title: 'Orvion Labs - Projects',
    description: 'Manage your prompt engineering projects',
}

export default async function ProjectsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch user's projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch recent test runs for stats in cards
    const { data: recentRuns } = await supabase
        .from('test_runs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100) // Fetch slightly more for the dedicated page

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-12">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-500 ml-1 mb-2">Workspace Manager</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        Projects
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium tracking-wide ml-1">
                        Create, manage, and monitor all your AI prompt testing suites.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <CreateProjectButton />
                </div>
            </div>

            <ProjectsManager
                projects={projects || []}
                recentRuns={recentRuns || []}
            />
        </div>
    )
}
