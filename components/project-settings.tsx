'use client'

import { useState } from 'react'
import { Save, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { updateProject, deleteProject } from '@/app/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProjectSettingsProps {
    projectId: string
    projectName: string
    projectDescription: string
}

export function ProjectSettings({
    projectId,
    projectName: initialName,
    projectDescription: initialDescription,
}: ProjectSettingsProps) {
    const [name, setName] = useState(initialName)
    const [description, setDescription] = useState(initialDescription)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState('')
    const router = useRouter()

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Project name is required')
            return
        }

        setIsSaving(true)
        const formData = new FormData()
        formData.append('id', projectId)
        formData.append('name', name)
        formData.append('description', description)

        try {
            const result = await updateProject(formData)
            if (result.success) {
                toast.success('Project updated successfully')
                router.refresh()
            } else {
                toast.error('Failed to update project')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (deleteConfirmation !== name) {
            return
        }

        setIsDeleting(true)
        try {
            await deleteProject(projectId)
            toast.success('Project deleted')
            // Redirect handled by server action, but client-side push is safer for UX
            router.push('/')
        } catch (error) {
            toast.error('Failed to delete project')
            setIsDeleting(false)
        }
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-950 p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Project Settings</h1>
                <p className="text-slate-400 text-sm">
                    Manage your project configuration and danger zone
                </p>
            </div>

            <div className="space-y-6 max-w-3xl">
                {/* General Settings */}
                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white">General Settings</CardTitle>
                        <CardDescription className="text-slate-400">
                            Update your project's identity
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Project Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white min-h-[100px]"
                            />
                        </div>
                        <div className="pt-2">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="bg-red-900/10 border-red-900/50">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            <CardTitle>Danger Zone</CardTitle>
                        </div>
                        <CardDescription className="text-red-400/70">
                            Irreversible actions for this project
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border border-red-900/30 rounded-lg bg-red-950/30">
                            <div>
                                <h3 className="text-white font-medium">Delete Project</h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    Permanently remove this project and all its data. This cannot be undone.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Project
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-slate-900 border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently delete the project
                            <span className="font-bold text-white mx-1">{initialName}</span>
                            and remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-slate-300">
                            Please type <span className="font-mono text-red-400">{initialName}</span> to confirm.
                        </p>
                        <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="bg-slate-950 border-slate-700 text-white"
                            placeholder="Type project name"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            className="border-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteConfirmation !== initialName || isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'I understand, delete this project'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
