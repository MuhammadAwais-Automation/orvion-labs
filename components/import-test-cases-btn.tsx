'use client'

import { useState, useRef } from 'react'
import { importTestCases } from '@/app/actions'
import { FileUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImportTestCasesBtnProps {
    projectId: string
}

export function ImportTestCasesBtn({ projectId }: ImportTestCasesBtnProps) {
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        // Reset input for next time
        e.target.value = ''

        if (!file.name.endsWith('.json')) {
            toast.error('Invalid file type', {
                description: 'Please select a JSON file'
            })
            return
        }

        setIsLoading(true)

        try {
            const text = await file.text()
            const data = JSON.parse(text)

            // Validate structure
            if (!Array.isArray(data)) {
                toast.error('Invalid JSON structure', {
                    description: 'JSON must be an array of test cases'
                })
                setIsLoading(false)
                return
            }

            if (data.length === 0) {
                toast.error('Empty JSON file', {
                    description: 'JSON array contains no test cases'
                })
                setIsLoading(false)
                return
            }

            // Check first item for required fields
            if (!data[0].input) {
                toast.error('Invalid test case format', {
                    description: 'Each test case must have an "input" field'
                })
                setIsLoading(false)
                return
            }

            // Call server action
            const result = await importTestCases(projectId, data)

            setIsLoading(false)

            if (result.error) {
                toast.error('Import failed', {
                    description: result.error
                })
            } else {
                toast.success(`Successfully imported ${result.count} test cases!`)
                window.location.reload()
            }
        } catch (error: any) {
            setIsLoading(false)
            if (error instanceof SyntaxError) {
                toast.error('Invalid JSON format', {
                    description: 'Please check your JSON syntax'
                })
            } else {
                toast.error('Import failed', {
                    description: error.message || 'Failed to import test cases'
                })
            }
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
            />
            <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                    </>
                ) : (
                    <>
                        <FileUp className="w-4 h-4" />
                        Import JSON
                    </>
                )}
            </Button>
        </>
    )
}
