'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ModelConfig, EvaluationConfig } from '@/types/database';

// --- PROJECT ACTIONS ---

export async function createProject(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
            name,
            description,
            user_id: user.id,
        })
        .select()
        .single();

    if (projectError || !project) {
        console.error('Error creating project:', projectError);
        return { error: 'Failed to create project' };
    }

    const initialModelConfig: ModelConfig = { model: 'gpt-4o-mini', temperature: 0.7 };
    const initialEvalConfig: EvaluationConfig = { hallucination_threshold: 0 };

    const { data: version, error: versionError } = await supabase
        .from('prompt_versions')
        .insert({
            project_id: project.id,
            version_number: 1,
            system_prompt: 'You are a helpful AI assistant.',
            model_config: initialModelConfig,
            evaluation_config: initialEvalConfig,
            is_active: true
        })
        .select()
        .single();

    if (versionError) {
        console.error('Error creating initial version:', versionError);
    } else {
        await supabase
            .from('projects')
            .update({ current_version_id: version.id })
            .eq('id', project.id);
    }

    revalidatePath('/');
    return { success: true, projectId: project.id };
}

export async function updateProject(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const { error } = await supabase
        .from('projects')
        .update({ name, description })
        .eq('id', id);

    if (error) {
        console.error('Error updating project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/project/${id}`);
    revalidatePath('/');
    return { success: true };
}

export async function deleteProject(projectId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    if (error) {
        console.error('Error deleting project:', error);
        throw new Error('Failed to delete project');
    }

    revalidatePath('/');
    redirect('/');
}
