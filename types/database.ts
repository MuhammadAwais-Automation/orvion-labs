// Database Types for Supabase Schema
// This file matches your SQL Schema exactly.

// --- JSON Field Types ---

export interface ModelConfig {
    model: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    // Allow flexible keys for future model params
    [key: string]: any;
}

export interface EvaluationConfig {
    // Core validators
    hallucination_threshold?: number;

    // JSON Validator can be a boolean or an object
    json_validator?: boolean | { enabled: boolean };
    check_format?: boolean; // Legacy support
    json_check?: boolean;   // Legacy support

    // Tone Validator
    tone_validator?: {
        enabled: boolean;
        expected_tone: string;
    };

    // Custom Rubric
    custom_rubric?: {
        enabled: boolean;
        instructions: string;
    };

    // Semantic Judge (Usually default, but can be configured)
    ai_judge?: {
        enabled: boolean;
        strictness?: number;
    };

    // Allow flexible keys so TypeScript doesn't crash on unknown JSON fields
    [key: string]: any;
}

// --- Table Row Interfaces ---

// Table: projects
export interface Project {
    id: string;
    name: string;
    description: string | null;
    user_id: string;
    current_version_id: string | null;
    openai_api_key: string | null; // encrypted API key for this project
    created_at: string;
    updated_at: string;
}

// Table: prompt_versions
export interface PromptVersion {
    id: string;
    project_id: string;
    version_number: number;
    system_prompt: string;
    model_config: ModelConfig;
    evaluation_config: EvaluationConfig | null;
    is_active: boolean;
    label: string | null;
    created_at: string;
}

// Table: test_cases
export interface TestCase {
    id: string;
    project_id: string;
    input_text: string;
    expected_output: string | null;
    created_at: string;
    updated_at: string;
}

// Table: test_runs
export interface TestRun {
    id: string;
    project_id: string;
    system_prompt: string;
    model: string;
    model_config: ModelConfig;
    status: 'pending' | 'running' | 'completed' | 'failed';
    total_cases: number;
    passed_cases: number;
    failed_cases: number;
    created_at: string;
    completed_at: string | null;
}

// Table: test_results
export interface TestResult {
    id: string;
    run_id: string;
    case_id: string;
    input_used: string;
    actual_output: string | null;
    expected_output: string | null;
    status: 'pass' | 'fail' | 'error' | 'success'; // Handle 'success' from legacy data
    latency_ms: number | null;
    tokens_used: number | null;
    judge_tokens: number | null; // tokens used by AI judge
    error_message: string | null;
    grading_feedback: string | null;
    created_at: string;
}

// Table: test_jobs (async job queue for test runs)
export interface TestJob {
    id: string;
    project_id: string;
    suite_id: string | null;
    run_id: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message: string | null;
    created_at: string;
    updated_at: string;
}

// Table: profiles
export interface Profile {
    id: string; // uuid, PK, references auth.users
    email: string;
    full_name: string | null; // user's display name
    created_at: string; // timestamp
}

// --- Supabase Client Helper Types ---

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: Project;
                Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
            };
            prompt_versions: {
                Row: PromptVersion;
                Insert: Omit<PromptVersion, 'id' | 'created_at'>;
                Update: Partial<Omit<PromptVersion, 'id' | 'created_at'>>;
            };
            test_cases: {
                Row: TestCase;
                Insert: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<TestCase, 'id' | 'created_at' | 'updated_at'>>;
            };
            test_runs: {
                Row: TestRun;
                Insert: Omit<TestRun, 'id' | 'created_at' | 'completed_at'>;
                Update: Partial<Omit<TestRun, 'id' | 'created_at'>>;
            };
            test_results: {
                Row: TestResult;
                Insert: Omit<TestResult, 'id' | 'created_at'>;
                Update: Partial<Omit<TestResult, 'id' | 'created_at'>>;
            };
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'id'>;
                Update: Partial<Omit<Profile, 'id'>>;
            };
            test_jobs: {
                Row: TestJob;
                Insert: Omit<TestJob, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<TestJob, 'id' | 'created_at' | 'updated_at'>>;
            };
        };
    };
}