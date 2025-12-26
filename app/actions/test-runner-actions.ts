'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';
import { ModelConfig } from '@/types/database';
import { getJudgeSystemPrompt } from '@/utils/judge-prompt';
import { inngest } from '@/lib/inngest';

// --- RUNNER ACTIONS (WITH CREDIT PRICING & COST BREAKDOWN) ---

// Helper function to create a test run record
export async function createTestRun(projectId: string) {
    const supabase = await createClient();

    // Fetch project config
    const { data: project } = await supabase
        .from('projects')
        .select('current_version_id')
        .eq('id', projectId)
        .single();

    if (!project?.current_version_id) {
        return { success: false, error: "No active prompt version found" };
    }

    const { data: activeVersion } = await supabase
        .from('prompt_versions')
        .select('model_config, system_prompt')
        .eq('id', project.current_version_id)
        .single();

    if (!activeVersion) {
        return { success: false, error: "Active version not found" };
    }

    const dbModelConfig = activeVersion.model_config as ModelConfig || { model: 'gpt-4o-mini', temperature: 0.7 };
    const dbSystemPrompt = activeVersion.system_prompt || '';

    // Create Run Record
    const { data: run, error: runError } = await supabase
        .from('test_runs')
        .insert({
            project_id: projectId,
            system_prompt: dbSystemPrompt,
            model: dbModelConfig.model,
            model_config: dbModelConfig,
            status: 'processing',
        })
        .select()
        .single();

    if (runError || !run) {
        return { success: false, error: 'Failed to start run' };
    }

    // Fetch all test case IDs for this project
    const { data: testCases } = await supabase
        .from('test_cases')
        .select('id')
        .eq('project_id', projectId);

    return {
        success: true,
        runId: run.id,
        testCaseIds: testCases?.map(tc => tc.id) || []
    };
}

// Helper to finalize a test run after all batches complete
export async function finalizeTestRun(
    runId: string,
    projectId: string,
    totalCases: number,
    passed: number,
    failed: number
) {
    const supabase = await createClient();

    await supabase
        .from('test_runs')
        .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            total_cases: totalCases,
            passed_cases: passed,
            failed_cases: failed
        })
        .eq('id', runId);

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
}

export async function runBatchTests(
    projectId: string,
    testCaseIds: string[],
    runId: string
) {
    const supabase = await createClient();

    // 0. CHECK AUTH
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    // 1. Trigger Async Execution via Inngest
    try {
        await inngest.send({
            name: "app/test.run.requested",
            data: {
                projectId,
                testCaseIds,
                runId
            }
        });

        return {
            success: true,
            runId,
            message: "Test run started in background"
        };
    } catch (err: any) {
        console.error("Inngest trigger error:", err);
        return { success: false, error: "Failed to trigger background worker" };
    }
}

export async function getTestResults(runId: string) {
    const supabase = await createClient();

    const { data: results, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('run_id', runId);

    if (error) {
        console.error('Error fetching test results:', error);
        return { success: false, error: error.message };
    }

    return { success: true, results };
}

export async function getTestRun(runId: string) {
    const supabase = await createClient();
    const { data: run, error } = await supabase
        .from('test_runs')
        .select('*')
        .eq('id', runId)
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, run };
}

// --- FETCH LATEST RUN WITH RESULTS ---

export async function getLatestTestRun(projectId: string) {
    const supabase = await createClient();

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

// --- FETCH TEST RUN HISTORY ---

export async function getTestRunHistory(projectId: string, limit: number = 10) {
    const supabase = await createClient();

    const { data: runs, error } = await supabase
        .from('test_runs')
        .select('id, status, total_cases, passed_cases, failed_cases, created_at, model')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching test run history:', error);
        return { success: false, error: error.message };
    }

    return { success: true, runs: runs || [] };
}
