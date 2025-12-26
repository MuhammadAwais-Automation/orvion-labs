'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    createTestCase,
    importTestCases,
    deleteTestCase,
    updateTestCase
} from '@/app/actions'
import { TestCase } from './types'

/**
 * useTestCases - CRUD Operations Only
 * 
 * Responsibility: Add, Update, Delete, Import test cases.
 * No state management, no Realtime, just action wrappers.
 */
export function useTestCases(projectId: string) {
    const router = useRouter()

    const handleAddTestCase = async (input: string, expected: string): Promise<boolean> => {
        if (!input.trim()) {
            toast.error('Input is required')
            return false
        }

        const formData = new FormData()
        formData.append('project_id', projectId)
        formData.append('input_text', input)
        formData.append('expected_output', expected || '')

        try {
            const result = await createTestCase(formData)
            if (result.success) {
                toast.success('Test case added')
                router.refresh()
                return true
            } else {
                toast.error(result.error || 'Failed to add test case')
                return false
            }
        } catch (error) {
            toast.error('Failed to add test case')
            return false
        }
    }

    const handleUpdateTestCase = async (id: string, input: string, expected: string): Promise<boolean> => {
        const formData = new FormData()
        formData.append('id', id)
        formData.append('input_text', input)
        formData.append('expected_output', expected)

        try {
            const result = await updateTestCase(formData)
            if (result.success) {
                toast.success('Test case updated')
                router.refresh()
                return true
            } else {
                toast.error(result.error || 'Failed to update test case')
                return false
            }
        } catch (error) {
            toast.error('Failed to update test case')
            return false
        }
    }

    const handleImportTests = async (json: string): Promise<boolean> => {
        try {
            const cases = JSON.parse(json)
            const result = await importTestCases(projectId, cases)
            if (result.success) {
                toast.success(`Imported ${cases.length} test cases`)
                router.refresh()
                return true
            } else {
                toast.error(result.error || 'Import failed')
                return false
            }
        } catch (error) {
            toast.error('Invalid JSON or import failed')
            return false
        }
    }

    const handleDeleteTestCase = async (id: string): Promise<boolean> => {
        try {
            const result = await deleteTestCase(id)
            if (result.success) {
                toast.success('Test case deleted')
                router.refresh()
                return true
            } else {
                toast.error(result.error || 'Failed to delete test case')
                return false
            }
        } catch (error) {
            toast.error('Failed to delete test case')
            return false
        }
    }

    return {
        handleAddTestCase,
        handleUpdateTestCase,
        handleImportTests,
        handleDeleteTestCase
    }
}
