'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- ANALYTICS ---

interface AnalyticsOptions {
    startDate?: string  // ISO date string (e.g., '2024-01-01')
    endDate?: string    // ISO date string
    daysBack?: number   // Alternative: number of days back from today
}

export async function getProjectAnalytics(
    projectId: string,
    options?: AnalyticsOptions
) {
    const supabase = await createClient();

    // Calculate date range
    let startDate: Date
    let endDate: Date = new Date()

    if (options?.startDate) {
        startDate = new Date(options.startDate)
    } else {
        // Default: last 30 days (or custom daysBack)
        const daysBack = options?.daysBack ?? 30
        startDate = new Date()
        startDate.setDate(startDate.getDate() - daysBack)
    }

    if (options?.endDate) {
        endDate = new Date(options.endDate)
    }

    // Fetch test runs for this project within date range
    const { data: testRuns, error: runsError } = await supabase
        .from('test_runs')
        .select('id, created_at, total_cases, passed_cases, failed_cases, status')
        .eq('project_id', projectId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

    if (runsError) {
        console.error('Error fetching test runs for analytics:', runsError);
        return { success: false, error: runsError.message };
    }

    // Fetch all test results for these runs
    const runIds = testRuns?.map(r => r.id) || [];
    let testResults: any[] = [];

    if (runIds.length > 0) {
        const { data: results, error: resultsError } = await supabase
            .from('test_results')
            .select('case_id, latency_ms, total_cost, status, created_at, input_used')
            .in('run_id', runIds);

        if (!resultsError && results) {
            testResults = results;
        }
    }

    // Aggregate by day: Tests run per day
    const dailyTests: Record<string, number> = {};
    const dailyCosts: Record<string, number> = {};
    const dailyLatency: Record<string, { total: number; count: number }> = {};

    testRuns?.forEach(run => {
        const day = new Date(run.created_at).toISOString().split('T')[0];
        dailyTests[day] = (dailyTests[day] || 0) + (run.total_cases || 0);
    });

    testResults.forEach(result => {
        const day = new Date(result.created_at).toISOString().split('T')[0];

        // Cost aggregation
        dailyCosts[day] = (dailyCosts[day] || 0) + (result.total_cost || 0);

        // Latency aggregation
        if (!dailyLatency[day]) {
            dailyLatency[day] = { total: 0, count: 0 };
        }
        if (result.latency_ms) {
            dailyLatency[day].total += result.latency_ms;
            dailyLatency[day].count += 1;
        }
    });

    // Generate all days in the selected date range for complete chart
    const allDays: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        allDays.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Format chart data
    const usageTrend = allDays.map(day => ({
        date: day,
        tests: dailyTests[day] || 0
    }));

    const costAnalysis = allDays.map(day => ({
        date: day,
        cost: Math.round((dailyCosts[day] || 0) * 100) / 100
    }));

    const latencyTrend = allDays.map(day => ({
        date: day,
        avgLatency: dailyLatency[day]
            ? Math.round(dailyLatency[day].total / dailyLatency[day].count)
            : 0
    }));

    // Get slowest 5 test cases
    const slowestTests = testResults
        .filter(r => r.latency_ms)
        .sort((a, b) => b.latency_ms - a.latency_ms)
        .slice(0, 5)
        .map(r => ({
            caseId: r.case_id,
            input: r.input_used?.substring(0, 50) + (r.input_used?.length > 50 ? '...' : ''),
            latencyMs: r.latency_ms,
            status: r.status
        }));

    // Summary stats
    const totalRuns = testRuns?.length || 0;
    const totalTests = testRuns?.reduce((acc, r) => acc + (r.total_cases || 0), 0) || 0;
    const totalCost = testResults.reduce((acc, r) => acc + (r.total_cost || 0), 0);
    const avgLatency = testResults.length > 0
        ? Math.round(testResults.reduce((acc, r) => acc + (r.latency_ms || 0), 0) / testResults.length)
        : 0;

    return {
        success: true,
        usageTrend,
        costAnalysis,
        latencyTrend,
        slowestTests,
        summary: {
            totalRuns,
            totalTests,
            totalCost: Math.round(totalCost * 100) / 100,
            avgLatency
        }
    };
}

// --- ADMIN AUDIT ---

export async function getAuditResults() {
    const supabase = await createClient();

    const { data: results, error } = await supabase
        .from('test_results')
        .select('id, input_used, status, tokens_used, judge_tokens, generation_cost, judge_cost, total_cost, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching audit results:', error);
        return { success: false, error: error.message };
    }

    return { success: true, results: results || [] };
}

// --- PROFILE UPDATE ---

export async function updateProfile(fullName: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/account');
    return { success: true };
}
