'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- TEST CASE ACTIONS ---

export async function createTestCase(formData: FormData) {
    const supabase = await createClient();
    const projectId = formData.get('project_id') as string;
    const input = formData.get('input_text') as string;
    const expected = formData.get('expected_output') as string;

    // Get user tier and enforce limits
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

    const tier = profile?.tier || 'free';
    const limit = tier === 'pro' ? 100 : 5;

    // Count existing test cases for this project
    const { count: existingCount } = await supabase
        .from('test_cases')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

    if (existingCount !== null && existingCount >= limit) {
        return {
            success: false,
            error: `Plan limit reached (${limit} cases). ${tier === 'free' ? 'Upgrade to Pro for 100 cases.' : 'Contact support for higher limits.'}`
        };
    }

    const { error } = await supabase.from('test_cases').insert({
        project_id: projectId,
        input_text: input,
        expected_output: expected,
    });

    if (error) {
        console.error('Error creating test case:', error);
        return { success: false, error: error.message || 'Failed to create test case' };
    }

    revalidatePath(`/project/${projectId}`);
    return { success: true, error: undefined };
}

export async function importTestCases(projectId: string, cases: any[]) {
    const supabase = await createClient();

    // Get user tier and enforce limits
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

    const tier = profile?.tier || 'free';
    const limit = tier === 'pro' ? 100 : 5;

    // Count existing test cases for this project
    const { count: existingCount } = await supabase
        .from('test_cases')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

    const currentCount = existingCount || 0;
    const newCasesCount = cases.length;

    if (currentCount + newCasesCount > limit) {
        return {
            success: false,
            error: `Import exceeds limit. You have ${currentCount}/${limit} used. ${tier === 'free' ? 'Upgrade to Pro for 100 cases.' : 'Contact support.'}`
        };
    }

    const formattedCases = cases.map((c) => ({
        project_id: projectId,
        input_text: c.input || c.input_text,
        expected_output: c.expected_output,
    }));

    const { error } = await supabase.from('test_cases').insert(formattedCases);

    if (error) {
        console.error('Import error:', error);
        return { success: false, error: error.message || 'Failed to import test cases' };
    }

    revalidatePath(`/project/${projectId}`);
    return { success: true, count: formattedCases.length, error: undefined };
}

export async function deleteTestCase(testCaseId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('test_cases').delete().eq('id', testCaseId);

    if (error) {
        console.error('Error deleting test case:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updateTestCase(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id') as string;
    const input = formData.get('input_text') as string;
    const expected = formData.get('expected_output') as string;

    const { error } = await supabase
        .from('test_cases')
        .update({ input_text: input, expected_output: expected })
        .eq('id', id);

    if (error) {
        console.error('Error updating test case:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
