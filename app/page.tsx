import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ModelPerformanceChart } from '@/components/dashboard/model-performance-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'

export const metadata = {
    title: 'Orvion Labs - Dashboard',
    description: 'Premium Enterprise Command Center for AI Prompt Testing',
}

export default async function Page() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If no user, redirect to login
    if (!user) {
        return redirect('/login')
    }

    // Fetch user profile for name
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    // Fetch user's projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

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

    const activeProjects = projects?.length || 0

    // Count projects updated in last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentlyUpdated = projects?.filter(p =>
        new Date(p.updated_at || p.created_at) > sevenDaysAgo
    ).length || 0

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Header Section - Spans full width */}
                <div className="md:col-span-12">
                    <DashboardHeader userName={profile?.full_name} userEmail={user.email} />
                </div>

                {/* Stats Cards - Spans full width but internally grid */}
                <div className="md:col-span-12">
                    <StatsCards
                        totalRuns={totalRuns}
                        avgPassRate={avgPassRate}
                        activeProjects={activeProjects}
                        recentlyUpdated={recentlyUpdated}
                        runsTrend={12} // Mock trend
                    />
                </div>

                {/* Main Content Area: Charts & Activity */}
                <div className="md:col-span-8 flex flex-col gap-6">
                    {/* Charts Take Priority - Analytics System */}
                    <div className="flex-1">
                        <ModelPerformanceChart />
                    </div>
                </div>

                {/* Right Sidebar: Activity Feed */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <div className="sticky top-6">
                        <ActivityFeed />

                        {/* Optional: Add a "Quick Tips" or "System Status" small card here later */}
                    </div>
                </div>

            </div>
        </div>
    )
}
