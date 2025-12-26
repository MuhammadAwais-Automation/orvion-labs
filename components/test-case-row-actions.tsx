'use client'

import { useState } from 'react'
import { deleteTestCase, updateTestCase } from '@/app/actions'
import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface TestCase {
    id: string
    name: string
    input_text: string
    expected_output: string | null
}

interface TestCaseRowActionsProps {
    testCase: TestCase
    projectId: string
}

export function TestCaseRowActions({ testCase, projectId }: TestCaseRowActionsProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${testCase.name}"? This action cannot be undone.`
        )

        if (!confirmed) return

        setIsLoading(true)
        const result = await deleteTestCase(testCase.id)
        setIsLoading(false)

        if (result.error) {
            toast.error('Failed to delete test case', {
                description: result.error
            })
        } else {
            toast.success('Test case deleted successfully')
            window.location.reload()
        }
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        formData.append('test_case_id', testCase.id)

        const result = await updateTestCase(formData)

        if (result.error) {
            setError(result.error)
            toast.error('Failed to update test case', {
                description: result.error
            })
            setIsLoading(false)
        } else {
            toast.success('Test case updated successfully!')
            setIsEditOpen(false)
            setIsLoading(false)
            window.location.reload()
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Test Case</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="edit-name"
                                name="name"
                                required
                                defaultValue={testCase.name}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Test case name"
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-input_text" className="block text-sm font-medium text-gray-300 mb-2">
                                Input Text *
                            </label>
                            <textarea
                                id="edit-input_text"
                                name="input_text"
                                required
                                rows={3}
                                defaultValue={testCase.input_text}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Input for the AI model"
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-expected_output" className="block text-sm font-medium text-gray-300 mb-2">
                                Expected Output (Optional)
                            </label>
                            <textarea
                                id="edit-expected_output"
                                name="expected_output"
                                rows={3}
                                defaultValue={testCase.expected_output || ''}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Expected response"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsEditOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
