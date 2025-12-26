'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ModelConfig, EvaluationConfig } from '@/types/database';

// --- VERSION CONTROL ACTIONS ---

export async function savePromptVersion(
    projectId: string,
    systemPrompt: string,
    modelConfig: ModelConfig,
    label?: string
) {
    const supabase = await createClient();

    const { data: latest } = await supabase
        .from('prompt_versions')
        .select('version_number')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

    const nextVersion = (latest?.version_number || 0) + 1;

    const defaultEvalConfig: EvaluationConfig = { hallucination_threshold: 0 };

    const { data: newVersion, error } = await supabase
        .from('prompt_versions')
        .insert({
            project_id: projectId,
            version_number: nextVersion,
            system_prompt: systemPrompt,
            model_config: modelConfig,
            evaluation_config: defaultEvalConfig,
            is_active: true,
            label: label || null
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving version:', error);
        throw new Error('Failed to save version');
    }

    await supabase
        .from('projects')
        .update({ current_version_id: newVersion.id })
        .eq('id', projectId);

    revalidatePath(`/project/${projectId}`);
    return { success: true, version: newVersion };
}

export async function updateActiveVersion(
    projectId: string,
    systemPrompt: string,
    modelConfig: ModelConfig
) {
    const supabase = await createClient();
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('current_version_id')
        .eq('id', projectId)
        .single();
    if (projectError || !project?.current_version_id) {
        console.error('Error fetching project:', projectError);
        return { success: false, error: 'Project not found or no active version' };
    }
    const { error: updateError } = await supabase
        .from('prompt_versions')
        .update({
            system_prompt: systemPrompt,
            model_config: modelConfig,
        })
        .eq('id', project.current_version_id);
    if (updateError) {
        console.error('Error updating active version:', updateError);
        return { success: false, error: 'Failed to update version' };
    }
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/evaluations`);
    return { success: true };
}

export async function getVersionHistory(projectId: string) {
    const supabase = await createClient();

    const { data: versions, error } = await supabase
        .from('prompt_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false });

    if (error) {
        console.error('Error fetching versions:', error);
        return { success: false, error: error.message };
    }

    return { success: true, versions };
}

export async function switchActiveVersion(projectId: string, versionId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .update({ current_version_id: versionId })
        .eq('id', projectId);

    if (error) {
        console.error('Error switching version:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/evaluations`);
    return { success: true };
}

// --- EVALUATION CONFIG (JUDGES) ---

export async function updateEvaluationConfig(versionId: string, config: EvaluationConfig) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('prompt_versions')
        .update({ evaluation_config: config })
        .eq('id', versionId);

    if (error) {
        console.error('Error updating evaluation config:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// --- VERSION COMPARISON ---

export async function getVersionComparison(
    projectId: string,
    versionIdA: string,
    versionIdB: string
) {
    const supabase = await createClient();

    // Fetch both versions
    const { data: versions, error: versionsError } = await supabase
        .from('prompt_versions')
        .select('*')
        .in('id', [versionIdA, versionIdB]);

    if (versionsError || !versions || versions.length !== 2) {
        return { success: false, error: 'Failed to fetch versions' };
    }

    const versionA = versions.find(v => v.id === versionIdA);
    const versionB = versions.find(v => v.id === versionIdB);

    if (!versionA || !versionB) {
        return { success: false, error: 'One or both versions not found' };
    }

    // Fetch test runs for each version (get the latest run for each)
    const { data: runsA } = await supabase
        .from('test_runs')
        .select('id, passed_cases, total_cases, failed_cases, status')
        .eq('project_id', projectId)
        .eq('version_id', versionIdA)
        .order('created_at', { ascending: false })
        .limit(1);

    const { data: runsB } = await supabase
        .from('test_runs')
        .select('id, passed_cases, total_cases, failed_cases, status')
        .eq('project_id', projectId)
        .eq('version_id', versionIdB)
        .order('created_at', { ascending: false })
        .limit(1);

    // Calculate pass rates
    const statsA = runsA?.[0];
    const statsB = runsB?.[0];

    const passRateA = statsA?.total_cases
        ? Math.round((statsA.passed_cases / statsA.total_cases) * 100)
        : null;
    const passRateB = statsB?.total_cases
        ? Math.round((statsB.passed_cases / statsB.total_cases) * 100)
        : null;

    return {
        success: true,
        comparison: {
            versionA: {
                ...versionA,
                stats: statsA || null,
                passRate: passRateA
            },
            versionB: {
                ...versionB,
                stats: statsB || null,
                passRate: passRateB
            },
            changes: {
                promptChanged: versionA.system_prompt !== versionB.system_prompt,
                modelChanged: versionA.model_config?.model !== versionB.model_config?.model,
                temperatureChanged: versionA.model_config?.temperature !== versionB.model_config?.temperature,
                passRateDelta: passRateA !== null && passRateB !== null
                    ? passRateA - passRateB
                    : null
            }
        }
    };
}
