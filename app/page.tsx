import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { LandingPage } from '@/components/landing-page'

export const metadata = {
    title: 'Orvion Labs - Dashboard',
    description: 'Premium Enterprise Command Center for AI Prompt Testing',
}

export default async function Page() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If no user, show the landing page
    if (!user) {
        return <LandingPage />
    }

    // Fetch user profile for name AND credits
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, credits')
        .eq('id', user.id)
        .single()


    // First fetch user's project IDs
    const { data: userProjects } = await supabase
        .from('projects')
        .select('id, name')
        .eq('user_id', user.id)

    const projectIds = userProjects?.map(p => p.id) || []

    // Fetch recent test runs for user's projects
    let recentRuns: any[] = []
    if (projectIds.length > 0) {
        const { data } = await supabase
            .from('test_runs')
            .select('*, projects(name)')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false })
            .limit(50)
        recentRuns = data || []
    }


    // Calculate KPIs
    const totalRuns = recentRuns?.length || 0
    const completedRuns = recentRuns?.filter(run => run.status === 'completed') || []

    const avgPassRate = completedRuns.length > 0
        ? (completedRuns.reduce((acc, run) => {
            const passRate = run.total_cases > 0 ? (run.passed_cases / run.total_cases) * 100 : 0
            return acc + passRate
        }, 0) / completedRuns.length)
        : 0

    // Calculate REAL weekly trend (not hardcoded 12%)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const thisWeekRuns = recentRuns?.filter(r =>
        new Date(r.created_at) > oneWeekAgo
    ).length || 0

    const lastWeekRuns = recentRuns?.filter(r =>
        new Date(r.created_at) > twoWeeksAgo &&
        new Date(r.created_at) <= oneWeekAgo
    ).length || 0

    const runsTrend = lastWeekRuns > 0
        ? Math.round(((thisWeekRuns - lastWeekRuns) / lastWeekRuns) * 100)
        : (thisWeekRuns > 0 ? 100 : 0)

    // Get recent activity (runs with project names - scrollable so show more)
    const recentActivity = (recentRuns || []).slice(0, 20).map(run => ({
        id: run.id,
        projectName: (run.projects as any)?.name || 'Unknown Project',
        status: run.status as 'completed' | 'failed' | 'processing',
        passedCases: run.passed_cases || 0,
        totalCases: run.total_cases || 0,
        createdAt: run.created_at
    }))

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-12">
            {/* Header Section */}
            <DashboardHeader userName={profile?.full_name} userEmail={user.email} />

            {/* KPI Stats */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500">Key Performance Indicators</h2>
                </div>
                <StatsCards
                    totalRuns={totalRuns}
                    avgPassRate={avgPassRate}
                    credits={profile?.credits || 0}
                    runsTrend={runsTrend}
                />
            </section>

            {/* Recent Activity */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500">Recent Activity</h2>
                </div>
                <RecentActivity runs={recentActivity} />
            </section>
        </div>
    )
}
