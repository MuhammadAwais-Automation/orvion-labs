import { inngest } from "@/lib/inngest";
import { createAdminClient } from "@/lib/supabase/admin";
import OpenAI from "openai";
import { gradeResult } from "@/app/actions/ai-actions";
import { calculateCost } from "@/utils/model-pricing";
import { ModelConfig } from "@/types/database";

export const executeTestSuite = inngest.createFunction(
    { id: "execute-test-suite", retries: 3 },
    { event: "app/test.run.requested" },
    async ({ event, step }) => {
        const { projectId, testCaseIds, runId } = event.data;
        const supabase = createAdminClient();
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        if (!testCaseIds || testCaseIds.length === 0) {
            await supabase.from('test_runs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', runId);
            return { success: true, message: "No test cases to run" };
        }

        // 1. Fetch Config & Test Cases
        const metadata = await step.run("fetch-metadata", async () => {

            const { data: project, error: pErr } = await supabase
                .from('projects')
                .select('current_version_id, user_id')
                .eq('id', projectId)
                .single();

            if (pErr || !project?.current_version_id) {
                console.error('[INNGEST] Project fetch error:', pErr);
                throw new Error("No active prompt version");
            }

            const { data: activeVersion, error: vErr } = await supabase
                .from('prompt_versions')
                .select('model_config, evaluation_config, system_prompt')
                .eq('id', project.current_version_id)
                .single();

            if (vErr || !activeVersion) {
                console.error('[INNGEST] Version fetch error:', vErr);
                throw new Error("Active version not found");
            }

            const { data: testCases, error: tcErr } = await supabase
                .from('test_cases')
                .select('*')
                .in('id', testCaseIds);

            if (tcErr || !testCases || testCases.length === 0) {
                console.error('[INNGEST] Test cases fetch error:', tcErr);
                throw new Error("No test cases found");
            }

            return {
                userId: project.user_id,
                systemPrompt: activeVersion.system_prompt || '',
                modelConfig: (activeVersion.model_config as ModelConfig) || { model: 'gpt-4o-mini', temperature: 0.7 },
                evalRules: activeVersion.evaluation_config || {} as any,
                testCases
            };
        });

        const { userId, systemPrompt, modelConfig, evalRules, testCases } = metadata;

        // 2. Execute Test Cases Sequentially (Durable Loop with Global Catch)
        try {
            for (const tc of testCases) {
                await step.run(`run-test-${tc.id}`, async () => {
                    const start = Date.now();
                    let actualOutput = '';
                    let status = 'success';
                    let tokens = 0;
                    let errorMsg = '';
                    let gradingFeedback = '';
                    let generationCost = 0;
                    let judgeTokens = 0;

                    try {
                        const completion = await openai.chat.completions.create({
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: tc.input_text }
                            ],
                            model: modelConfig.model || 'gpt-4o-mini',
                            temperature: modelConfig.temperature || 0.7,
                        });

                        actualOutput = completion.choices[0].message.content || '';
                        tokens = completion.usage?.total_tokens || 0;
                        generationCost = calculateCost(modelConfig.model || 'gpt-4o-mini', tokens);

                        // Standard Match & Fallback to AI Judge
                        let cleanOutput = actualOutput.trim();

                        if (tc.expected_output) {
                            const matches = cleanOutput.toLowerCase().includes(tc.expected_output.toLowerCase());
                            if (!matches) {
                                // Call Refactored gradeResult with skipDeduction: true
                                const grade = await gradeResult(
                                    userId,
                                    projectId,
                                    tc.input_text,
                                    tc.expected_output,
                                    cleanOutput,
                                    evalRules,
                                    supabase,
                                    true // skipDeduction: true
                                );

                                if (!grade.pass) {
                                    status = 'error';
                                    gradingFeedback = grade.reason;
                                } else {
                                    gradingFeedback = "Passed via AI Semantic Match";
                                }
                                judgeTokens = grade.tokensUsed;
                            } else {
                                gradingFeedback = "Passed via Exact Match";
                            }
                        }
                    } catch (e: any) {
                        errorMsg = e.message;
                        status = 'error';
                    }

                    const latency = Date.now() - start;

                    // 3. Persist individual result
                    const { error: insertErr } = await supabase.from('test_results').insert({
                        run_id: runId,
                        case_id: tc.id,
                        input_used: tc.input_text,
                        actual_output: actualOutput,
                        expected_output: tc.expected_output,
                        status: status,
                        latency_ms: latency,
                        tokens_used: tokens,
                        error_message: errorMsg,
                        grading_feedback: gradingFeedback,
                        generation_cost: generationCost,
                        judge_tokens: judgeTokens
                    });

                    if (insertErr) {
                        console.error('[INNGEST] Result insert error:', insertErr);
                    }

                    // 4. Atomic Credit Deduction (Generation + Judge Cost)
                    const totalTokens = tokens + judgeTokens;
                    const modelToCharge = judgeTokens > 0 && evalRules.strictMode ? 'gpt-4o' : (modelConfig.model || 'gpt-4o-mini');
                    const totalCost = calculateCost(modelToCharge, totalTokens);

                    if (totalCost > 0) {
                        const { error: rpcErr } = await supabase.rpc('deduct_user_credits', {
                            p_user_id: userId,
                            p_amount: totalCost
                        });
                        if (rpcErr) {
                            console.error('[INNGEST] RPC deduct error:', rpcErr);
                        }
                    }

                    return { success: true };
                });
            }
        } catch (error: any) {
            console.error("Test execution loop failed:", error);
            await supabase.from('test_runs').update({ status: 'failed' }).eq('id', runId);
            throw error; // Re-throw for Inngest retry
        }

        // 5. Finalize the Test Run (State-Independent)
        await step.run("finalize-run", async () => {
            // Fetch the ground-truth from DB, not from memory
            const { data: results, error: resultsErr } = await supabase
                .from('test_results')
                .select('grading_feedback, status')
                .eq('run_id', runId);

            if (resultsErr) throw new Error("Failed to fetch results for finalization");

            const passed = results.filter(r =>
                r.status === 'success' || (r.grading_feedback && r.grading_feedback.includes("Passed"))
            ).length;

            const failed = results.length - passed;

            await supabase
                .from('test_runs')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    total_cases: results.length,
                    passed_cases: passed,
                    failed_cases: failed
                })
                .eq('id', runId);
        });

        return { success: true, testCasesCount: testCaseIds.length };
    }
);
