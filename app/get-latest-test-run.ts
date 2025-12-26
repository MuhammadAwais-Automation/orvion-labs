/**
 * Server action to fetch the latest test run and its results for a project
 * Used for "Load Previous State" functionality to persist results across page refreshes
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export async function getLatestTestRun(projectId: string) {
    const supabase = await createClient();

    // Fetch the most recent test run for this project
    const { data: latestRun, error: runError } = await supabase
        .from('test_runs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (runError) {
        console.error('Error fetching latest run:', runError);
        return { success: true, run: null, results: [] };
    }

    if (!latestRun) {
        return { success: true, run: null, results: [] };
    }

    // Fetch results for this run
    const { data: results, error: resultsError } = await supabase
        .from('test_results')
        .select('*')
        .eq('run_id', latestRun.id)
        .order('created_at', { ascending: true });

    if (resultsError) {
        console.error('Error fetching test results:', resultsError);
        return { success: true, run: latestRun, results: [] };
    }

    return { success: true, run: latestRun, results: results || [] };
}
