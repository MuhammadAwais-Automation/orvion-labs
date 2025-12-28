// Re-export all actions for backwards compatibility
// Components can continue to import from '@/app/actions'

export {
    createProject,
    updateProject,
    deleteProject
} from './project-actions';

export {
    savePromptVersion,
    updateActiveVersion,
    getVersionHistory,
    switchActiveVersion,
    deletePromptVersion,
    updateEvaluationConfig,
    getVersionComparison
} from './version-actions';

export {
    createTestCase,
    importTestCases,
    deleteTestCase,
    updateTestCase
} from './test-case-actions';

export {
    createTestRun,
    finalizeTestRun,
    runBatchTests,
    getTestResults,
    getTestRun,
    getLatestTestRun,
    getTestRunHistory
} from './test-runner-actions';

export {
    gradeResult,
    simulateChat,
    generateExpectedOutput
} from './ai-actions';

export {
    getProjectAnalytics,
    getAuditResults,
    updateProfile
} from './analytics-actions';
