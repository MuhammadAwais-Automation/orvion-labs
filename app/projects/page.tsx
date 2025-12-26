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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Projects
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400">
                        Create, manage, and monitor all your AI prompt testing suites.
                    </p>
                </div>
                <CreateProjectButton />
            </div>

            <ProjectsManager
                projects={projects || []}
                recentRuns={recentRuns || []}
            />
        </div>
    )
}
