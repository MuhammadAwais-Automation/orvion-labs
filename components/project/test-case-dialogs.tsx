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
                <DialogContent className="bg-[#18181b] border-white/10 text-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-white">Add Test Case</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Input (Required)</label>
                            <Textarea
                                value={newTestCase.input}
                                onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                                placeholder="User input..."
                                className="bg-black/40 border-white/10 text-white min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">Expected Output (Optional)</label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={isGenerating || !newTestCase.input.trim()}
                                    onClick={() => handleGenerate(newTestCase.input, 'add')}
                                    className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3 mr-1" />
                                    )}
                                    Auto-Generate
                                </Button>
                            </div>
                            <Textarea
                                value={newTestCase.expected}
                                onChange={(e) => setNewTestCase({ ...newTestCase, expected: e.target.value })}
                                placeholder="Expected AI response..."
                                className="bg-black/40 border-white/10 text-white min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowAddDialog(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button onClick={async () => {
                            const success = await onAdd(newTestCase.input, newTestCase.expected)
                            if (success) {
                                setShowAddDialog(false)
                                setNewTestCase({ input: '', expected: '' })
                            }
                        }} className="bg-cyan-600 hover:bg-cyan-700 text-white">Add Case</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="bg-[#18181b] border-white/10 text-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Test Case</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Input (Required)</label>
                            <Textarea
                                value={editForm.input}
                                onChange={(e) => setEditForm({ ...editForm, input: e.target.value })}
                                className="bg-black/40 border-white/10 text-white min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">Expected Output (Optional)</label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={isGenerating || !editForm.input.trim()}
                                    onClick={() => handleGenerate(editForm.input, 'edit')}
                                    className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3 mr-1" />
                                    )}
                                    Auto-Generate
                                </Button>
                            </div>
                            <Textarea
                                value={editForm.expected}
                                onChange={(e) => setEditForm({ ...editForm, expected: e.target.value })}
                                className="bg-black/40 border-white/10 text-white min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowEditDialog(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button onClick={async () => {
                            const success = await onEdit(editForm.id, editForm.input, editForm.expected)
                            if (success) setShowEditDialog(false)
                        }} className="bg-cyan-600 hover:bg-cyan-700 text-white">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogContent className="bg-[#18181b] border-white/10 text-slate-200">
                    <DialogHeader>
                        <DialogTitle className="text-white">Import Test Cases</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-xs text-slate-400">
                            Paste a JSON array of test cases. format: <code className="text-cyan-500">[ {'{ "input": "...", "expected_output": "..." }'} ]</code>
                        </p>
                        <Textarea
                            value={importJson}
                            onChange={(e) => setImportJson(e.target.value)}
                            placeholder='[ { "input": "hello", "expected_output": "world" } ]'
                            className="bg-black/40 border-white/10 text-white min-h-[200px] font-mono text-xs"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowImportDialog(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button onClick={async () => {
                            const success = await onImport(importJson)
                            if (success) {
                                setShowImportDialog(false)
                                setImportJson('')
                            }
                        }} className="bg-cyan-600 hover:bg-cyan-700 text-white">Import</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
