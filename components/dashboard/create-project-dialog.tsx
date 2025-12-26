'use client'

import { useState } from 'react'
import { createProject } from '@/app/actions'
import { Plus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogTrigger,
} from '@/components/ui/dialog'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { toast } from 'sonner'

export function CreateProjectDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await createProject(formData)

        if (result.error) {
            toast.error(result.error)
            setIsLoading(false)
        } else {
            toast.success('Project created successfully')
            setOpen(false)
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogPrimitive.Portal>
                {/* Overlay */}
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />

                {/* Content */}
                <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-6">

                    {/* Close Button */}
                    <DialogPrimitive.Close className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </DialogPrimitive.Close>

                    {/* Header */}
                    <div className="mb-6">
                        <DialogPrimitive.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                            Create New Project
                        </DialogPrimitive.Title>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="My AI Prompt Tests"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Testing prompts for customer support chatbot..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Project
                            </Button>
                        </div>
                    </form>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </Dialog>
    )
}
