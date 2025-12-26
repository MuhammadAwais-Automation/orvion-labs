'use server';

import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { ModelConfig } from '@/types/database';
import { getJudgeSystemPrompt } from '@/utils/judge-prompt';
import { calculateCost } from '@/utils/model-pricing';

// --- HELPER: AI JUDGE (Using External Brain) ---

export async function gradeResult(
    userId: string,
    projectId: string,
    input: string,
    expected: string,
    actual: string,
    rules: any = {},
    supabaseClient?: any
): Promise<{ pass: boolean; reason: string; tokensUsed: number }> {
    const supabase = supabaseClient || await createClient();

    // 1. Security Check: Verify project ownership
    const { data: project, error: authError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single();

    if (authError || !project) {
        return { pass: false, reason: 'Unauthorized: Project ownership verify failed', tokensUsed: 0 };
    }



    // 3. Dynamic Model Selection
    const model = rules.strictMode ? 'gpt-4o' : 'gpt-4o-mini';
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const judgeInstructions = getJudgeSystemPrompt(rules);

    try {
        // 4. OpenAI Call with Timeout Support
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: judgeInstructions },
                {
                    role: 'user',
                    content: `CONTEXT INPUT: "${input}"\n\nEXPECTED ANSWER: "${expected}"\n\nACTUAL AI RESPONSE: "${actual}"`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0,
        }, { signal: controller.signal });

        clearTimeout(timeoutId);

        const content = completion.choices[0].message.content;
        const tokensUsed = completion.usage?.total_tokens || 0;

        if (!content) return { pass: false, reason: "No response from judge", tokensUsed };

        const result = JSON.parse(content);



        return { pass: result.pass, reason: result.reason, tokensUsed };
    } catch (e: any) {
        if (e.name === 'AbortError') {
            return { pass: false, reason: "Judge timeout after 15s", tokensUsed: 0 };
        }
        console.error("Judge Error:", e);
        return { pass: false, reason: `Judge failure: ${e.message}`, tokensUsed: 0 };
    }
}

// --- CHAT SIMULATION ---

export async function simulateChat(
    systemPrompt: string,
    userMessage: string,
    modelConfig: ModelConfig
) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const completion = await openai.chat.completions.create({
            model: modelConfig.model || 'gpt-4o-mini',
            temperature: modelConfig.temperature || 0.7,
            max_tokens: modelConfig.max_tokens || 1000,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
        });

        const response = completion.choices[0]?.message?.content || 'No response';
        return { success: true, response };
    } catch (error: any) {
        console.error('Chat simulation error:', error);
        return { success: false, error: error.message };
    }
}

// --- AUTO-GENERATE EXPECTED OUTPUT ---

export async function generateExpectedOutput(projectId: string, userInput: string) {
    const supabase = await createClient();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 0. Check user auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    // 1. Fetch project's current version (model_config + system_prompt)
    const { data: project } = await supabase
        .from('projects')
        .select('current_version_id')
        .eq('id', projectId)
        .single();

    if (!project?.current_version_id) {
        return { success: false, error: 'No active prompt version found' };
    }

    const { data: version } = await supabase
        .from('prompt_versions')
        .select('system_prompt, model_config')
        .eq('id', project.current_version_id)
        .single();

    if (!version) {
        return { success: false, error: 'Version not found' };
    }

    const systemPrompt = version.system_prompt || '';
    const modelConfig = version.model_config as ModelConfig || { model: 'gpt-4o-mini', temperature: 0.7 };

    // Replace {{input}} placeholder with actual user input
    const filledPrompt = systemPrompt.replace(/\{\{input\}\}/g, userInput);

    try {
        // Use user's selected model (from project config)
        const completion = await openai.chat.completions.create({
            model: modelConfig.model || 'gpt-4o-mini',
            temperature: modelConfig.temperature || 0.7,
            max_tokens: modelConfig.max_tokens || 1000,
            messages: [
                {
                    role: 'system',
                    content: filledPrompt || 'You are a helpful assistant.'
                },
                { role: 'user', content: userInput }
            ],
        });

        const expectedOutput = completion.choices[0]?.message?.content || '';
        const tokensUsed = completion.usage?.total_tokens || 0;

        return { success: true, text: expectedOutput };
    } catch (error: any) {
        console.error('Error generating expected output:', error);
        return { success: false, error: error.message };
    }
}
