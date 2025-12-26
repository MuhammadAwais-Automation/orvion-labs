// Shared Types for Test Suite Hooks

export interface TestCase {
    id: string
    project_id: string
    input_text: string
    expected_output: string | null
    created_at: string
}

export interface TestResult {
    id: string
    case_id: string
    actual_output: string
    expected_output: string | null
    status: 'success' | 'error'
    latency_ms: number
    tokens_used: number
    error_message?: string
    generation_cost?: number
    judge_cost?: number
    total_cost?: number
}

export interface TestRunState {
    isRunning: boolean
    progress: { current: number; total: number }
    results: Map<string, TestResult>
}

export interface TestStats {
    passRate: number | null
    avgLatency: number | null
    completedCount: number
    passedCount: number
}
