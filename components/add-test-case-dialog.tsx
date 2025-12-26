'use client'

import { useState } from 'react'
import { createTestCase } from '@/app/actions'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AddTestCaseDialogProps {
    projectId: string
}

export function AddTestCaseDialog({ projectId }: AddTestCaseDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        formData.append('project_id', projectId)

        const result = await createTestCase(formData)

        if (result.error) {
            setError(result.error)
            toast.error('Failed to create test case', {
                description: result.error
            })
            setIsLoading(false)
        } else {
            toast.success('Test case created successfully!')
            e.currentTarget?.reset()
            setIsLoading(false)
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Test Case
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Test Case</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Test case name"
                        />
                    </div>
                    <div>
                        <label htmlFor="input_text" className="block text-sm font-medium text-gray-300 mb-2">
                            Input Text *
                        </label>
                        <textarea
                            id="input_text"
                            name="input_text"
                            required
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Input for the AI model"
                        />
                    </div>
                    <div>
                        <label htmlFor="expected_output" className="block text-sm font-medium text-gray-300 mb-2">
                            Expected Output (Optional)
                        </label>
                        <textarea
                            id="expected_output"
                            name="expected_output"
                            rows={3}
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
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
