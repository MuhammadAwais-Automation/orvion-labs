import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ModelPerformanceChart } from '@/components/dashboard/model-performance-chart'
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

    // Fetch user profile for name
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    // Fetch user's projects count for stats
    const { count: activeProjectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Fetch recent test runs for analytics
    const { data: recentRuns } = await supabase
        .from('test_runs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    // Calculate KPIs
    const totalRuns = recentRuns?.length || 0
    const completedRuns = recentRuns?.filter(run => run.status === 'completed') || []

    const avgPassRate = completedRuns.length > 0
        ? (completedRuns.reduce((acc, run) => {
            const passRate = run.total_cases > 0 ? (run.passed_cases / run.total_cases) * 100 : 0
            return acc + passRate
        }, 0) / completedRuns.length)
        : 0

    // Count projects updated recently (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recentlyUpdated } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('updated_at', sevenDaysAgo.toISOString())

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-12">
            {/* Header Section */}
            <DashboardHeader userName={profile?.full_name} userEmail={user.email} />

            {/* Main Content Sections */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500">Key Performance Indicators</h2>
                </div>
                <StatsCards
                    totalRuns={totalRuns}
                    avgPassRate={avgPassRate}
                    activeProjects={activeProjectsCount || 0}
                    recentlyUpdated={recentlyUpdated || 0}
                    runsTrend={12}
                />
            </section>

            {/* Analytics Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500">Stability Matrix</h2>
                </div>
                <div className="w-full h-full">
                    <ModelPerformanceChart />
                </div>
            </section>
        </div>
    )
}
