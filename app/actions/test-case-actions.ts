'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- TEST CASE ACTIONS ---

export async function createTestCase(formData: FormData) {
    const supabase = await createClient();
    const projectId = formData.get('project_id') as string;
    const input = formData.get('input_text') as string;
    const expected = formData.get('expected_output') as string;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
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
