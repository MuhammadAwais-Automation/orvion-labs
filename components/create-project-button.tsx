'use client'

import { useState } from 'react'
import { createProject } from '@/app/actions'
import { X, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function CreateProjectButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createProject(formData)

        if (result.error) {
            setError(result.error)
            setIsLoading(false)
        } else {
            setIsOpen(false)
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white font-black uppercase tracking-widest text-xs h-12 px-6 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="w-5 h-5 mr-2" />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 max-w-lg shadow-2xl">
                <DialogHeader className="space-y-4 mb-4">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-[1.25rem] border border-cyan-500/20 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <DialogTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create Project</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-zinc-500 font-medium pt-1">
                            Build a new workspace for your prompt engineering.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-500 ml-1">
                                Project Name
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="h-12 bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-2xl focus-visible:ring-cyan-500/30 transition-all font-medium placeholder:text-slate-400"
                                placeholder="e.g. Customer Support v2"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-500 ml-1">
                                Description (Optional)
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={3}
                                className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-2xl focus-visible:ring-cyan-500/30 transition-all font-medium placeholder:text-slate-400 resize-none p-4"
                                placeholder="Testing prompts for customer support chatbot..."
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/50 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-2">
                            <X className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-zinc-200 shadow-xl transition-all"
                        >
                            {isLoading ? 'Creating Workspace...' : 'Create Workspace'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
