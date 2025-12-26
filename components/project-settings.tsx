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
import { cn } from '@/lib/utils'
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
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#09090b] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-8 space-y-6">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <Save className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Project Settings</h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1">
                        Manage your project configuration and account preferences
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-8 scrollbar-thin-hover">
                <div className="max-w-4xl space-y-8">
                    {/* General Settings */}
                    <Card className="bg-white dark:bg-white/[0.01] border-2 border-slate-200 dark:border-white/[0.05] rounded-3xl shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-lg font-black tracking-tight text-slate-900 dark:text-white">General Settings</CardTitle>
                            <CardDescription className="text-slate-500 font-medium">
                                Update your project's basic information and identity.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Project Name</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter project name..."
                                    className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-2xl h-12 px-4 focus-visible:ring-indigo-500/30 font-medium"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Description</label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What does this project do?"
                                    className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-2xl min-h-[120px] p-4 focus-visible:ring-indigo-500/30 font-medium leading-relaxed"
                                />
                            </div>
                            <div className="pt-2 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-12 px-8 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] dark:shadow-[0_4px_12px_rgba(79,70,229,0.15)] flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isSaving ? 'Updating...' : 'Save Changes'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="bg-rose-50/50 dark:bg-rose-500/5 border-2 border-rose-100 dark:border-rose-500/10 rounded-3xl overflow-hidden shadow-sm">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <CardTitle className="text-lg font-black tracking-tight text-rose-600 dark:text-rose-400">Danger Zone</CardTitle>
                            </div>
                            <CardDescription className="text-rose-500/60 font-medium ml-11">
                                Critical actions that cannot be undone. Please proceed with extreme caution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white dark:bg-[#0c0c0e]/40 border border-rose-200 dark:border-rose-500/20">
                                <div className="space-y-1">
                                    <h3 className="text-slate-900 dark:text-white font-black tracking-tight">Delete Project</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        Permanently remove this project and all its data.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="bg-rose-500 hover:bg-rose-600 font-black h-11 px-6 rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2 group transition-all"
                                >
                                    <Trash2 className="w-4 h-4 group-hover:shake" />
                                    Delete Project
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-white dark:bg-[#0c0c0e] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 rounded-3xl p-0 overflow-hidden max-w-lg shadow-2xl">
                    <DialogHeader className="p-8 pb-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-sm mt-2">
                            This action <span className="text-rose-600 font-bold">cannot be undone</span>. This will permanently delete the project
                            <span className="font-black text-slate-900 dark:text-white mx-1">"{initialName}"</span>
                            and all its data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="px-8 py-4 space-y-6">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
                            Please type <span className="text-rose-600 dark:text-rose-400 font-black px-1.5 py-0.5 bg-rose-500/5 rounded-md">"{initialName}"</span> to confirm.
                        </p>
                        <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-2xl h-12 px-4 focus-visible:ring-rose-500/30 font-medium placeholder:text-slate-400"
                            placeholder="Project name..."
                        />
                    </div>
                    <DialogFooter className="p-8 pt-4 pb-10 flex gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(false)}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold h-12 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteConfirmation !== initialName || isDeleting}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-black h-12 px-8 rounded-xl shadow-[0_4px_12px_rgba(244,63,94,0.3)] dark:shadow-[0_4px_12px_rgba(244,63,94,0.15)] disabled:opacity-50 disabled:shadow-none"
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                'I understand, delete project'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
