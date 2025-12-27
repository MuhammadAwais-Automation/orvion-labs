'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { generateExpectedOutput } from '@/app/actions'

interface TestCaseDialogsProps {
    projectId: string
    showAddDialog: boolean
    setShowAddDialog: (show: boolean) => void
    showEditDialog: boolean
    setShowEditDialog: (show: boolean) => void
    showImportDialog: boolean
    setShowImportDialog: (show: boolean) => void
    onAdd: (input: string, expected: string) => Promise<boolean>
    onEdit: (id: string, input: string, expected: string) => Promise<boolean>
    onImport: (json: string) => Promise<boolean>
    editData?: { id: string, input: string, expected: string }
}

export function TestCaseDialogs({
    projectId,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showImportDialog,
    setShowImportDialog,
    onAdd,
    onEdit,
    onImport,
    editData
}: TestCaseDialogsProps) {
    const [newTestCase, setNewTestCase] = useState({ input: '', expected: '' })
    const [editForm, setEditForm] = useState(editData || { id: '', input: '', expected: '' })
    const [importJson, setImportJson] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    // Sync editForm with editData when it changes
    if (editData && editData.id !== editForm.id) {
        setEditForm(editData)
    }

    const handleGenerate = async (input: string, mode: 'add' | 'edit') => {
        if (!input.trim()) {
            toast.error('Enter input first')
            return
        }
        setIsGenerating(true)
        const result = await generateExpectedOutput(projectId, input)
        if (result.success && result.text) {
            if (mode === 'add') {
                setNewTestCase(prev => ({ ...prev, expected: result.text! }))
            } else {
                setEditForm(prev => ({ ...prev, expected: result.text! }))
            }
            toast.success('Expected output generated!')
        } else {
            toast.error(result.error || 'Generation failed')
        }
        setIsGenerating(false)
    }

    return (
        <>
            {/* Add Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="bg-white dark:bg-[#0c0c0e] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 rounded-2xl md:rounded-3xl p-0 overflow-hidden w-[calc(100%-2rem)] max-w-lg shadow-2xl mx-auto">
                    <DialogHeader className="p-5 md:p-8 pb-3 md:pb-4">
                        <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Add Test Case</DialogTitle>
                    </DialogHeader>
                    <div className="px-5 md:px-8 py-3 md:py-4 space-y-4 md:space-y-6">
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Input (Required)</label>
                            <Textarea
                                value={newTestCase.input}
                                onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                                placeholder="User input..."
                                className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-xl md:rounded-2xl min-h-[100px] md:min-h-[120px] p-3 md:p-4 focus-visible:ring-indigo-500/30 font-medium placeholder:text-slate-400 text-sm"
                            />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Expected Output (Optional)</label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={isGenerating || !newTestCase.input.trim()}
                                    onClick={() => handleGenerate(newTestCase.input, 'add')}
                                    className="h-7 md:h-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-500/5 px-2 md:px-3 rounded-lg md:rounded-xl transition-all"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3 mr-1.5" />
                                    )}
                                    Auto-Generate
                                </Button>
                            </div>
                            <Textarea
                                value={newTestCase.expected}
                                onChange={(e) => setNewTestCase({ ...newTestCase, expected: e.target.value })}
                                placeholder="Expected AI response..."
                                className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-xl md:rounded-2xl min-h-[100px] md:min-h-[120px] p-3 md:p-4 focus-visible:ring-indigo-500/30 font-medium placeholder:text-slate-400 text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="p-5 md:p-8 pt-3 md:pt-4 pb-6 md:pb-10 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowAddDialog(false)}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold h-11 md:h-12 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                const success = await onAdd(newTestCase.input, newTestCase.expected)
                                if (success) {
                                    setShowAddDialog(false)
                                    setNewTestCase({ input: '', expected: '' })
                                }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-11 md:h-12 px-8 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] dark:shadow-[0_4px_12px_rgba(79,70,229,0.15)] w-full sm:w-auto"
                        >
                            Add Case
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="bg-white dark:bg-[#0c0c0e] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 rounded-2xl md:rounded-3xl p-0 overflow-hidden w-[calc(100%-2rem)] max-w-lg shadow-2xl mx-auto">
                    <DialogHeader className="p-5 md:p-8 pb-3 md:pb-4">
                        <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Test Case</DialogTitle>
                    </DialogHeader>
                    <div className="px-5 md:px-8 py-3 md:py-4 space-y-4 md:space-y-6">
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Input (Required)</label>
                            <Textarea
                                value={editForm.input}
                                onChange={(e) => setEditForm({ ...editForm, input: e.target.value })}
                                className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-xl md:rounded-2xl min-h-[100px] md:min-h-[120px] p-3 md:p-4 focus-visible:ring-indigo-500/30 font-medium text-sm"
                            />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Expected Output (Optional)</label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={isGenerating || !editForm.input.trim()}
                                    onClick={() => handleGenerate(editForm.input, 'edit')}
                                    className="h-7 md:h-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-500/5 px-2 md:px-3 rounded-lg md:rounded-xl transition-all"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3 mr-1.5" />
                                    )}
                                    Auto-Generate
                                </Button>
                            </div>
                            <Textarea
                                value={editForm.expected}
                                onChange={(e) => setEditForm({ ...editForm, expected: e.target.value })}
                                className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-xl md:rounded-2xl min-h-[100px] md:min-h-[120px] p-3 md:p-4 focus-visible:ring-indigo-500/30 font-medium text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="p-5 md:p-8 pt-3 md:pt-4 pb-6 md:pb-10 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowEditDialog(false)}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold h-11 md:h-12 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                const success = await onEdit(editForm.id, editForm.input, editForm.expected)
                                if (success) setShowEditDialog(false)
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-11 md:h-12 px-8 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] dark:shadow-[0_4px_12px_rgba(79,70,229,0.15)] w-full sm:w-auto"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogContent className="bg-white dark:bg-[#0c0c0e] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 rounded-2xl md:rounded-3xl p-0 overflow-hidden w-[calc(100%-2rem)] max-w-lg shadow-2xl mx-auto">
                    <DialogHeader className="p-5 md:p-8 pb-3 md:pb-4">
                        <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Import Test Cases</DialogTitle>
                    </DialogHeader>
                    <div className="px-5 md:px-8 py-3 md:py-4 space-y-3 md:space-y-4">
                        <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed">
                            Paste a JSON array of test cases. format: <code className="text-cyan-600 dark:text-cyan-500 font-bold">[ {'{ "input": "...", "expected_output": "..." }'} ]</code>
                        </p>
                        <Textarea
                            value={importJson}
                            onChange={(e) => setImportJson(e.target.value)}
                            placeholder='[ { "input": "hello", "expected_output": "world" } ]'
                            className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-xl md:rounded-2xl min-h-[160px] md:min-h-[220px] p-4 md:p-6 font-mono text-[11px] md:text-xs focus-visible:ring-indigo-500/30 leading-relaxed scrollbar-thin-hover"
                        />
                    </div>
                    <DialogFooter className="p-5 md:p-8 pt-3 md:pt-4 pb-6 md:pb-10 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowImportDialog(false)}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold h-11 md:h-12 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                const success = await onImport(importJson)
                                if (success) {
                                    setShowImportDialog(false)
                                    setImportJson('')
                                }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-11 md:h-12 px-8 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] dark:shadow-[0_4px_12px_rgba(79,70,229,0.15)] w-full sm:w-auto"
                        >
                            Import
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
