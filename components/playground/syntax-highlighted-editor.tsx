'use client'

import { useRef, useEffect, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface SyntaxHighlightedEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export function SyntaxHighlightedEditor({
    value,
    onChange,
    placeholder = '',
    className,
    disabled = false
}: SyntaxHighlightedEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const highlightRef = useRef<HTMLDivElement>(null)

    // Sync scroll between textarea and highlight layer
    const handleScroll = useCallback(() => {
        if (textareaRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = textareaRef.current.scrollTop
            highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
        }
    }, [])

    // Highlight {{variables}} in the content
    const highlightedContent = useMemo(() => {
        if (!value) {
            return <span className="text-slate-400/60">{placeholder}</span>
        }

        // Split by variable pattern {{...}}
        const parts = value.split(/(\{\{[^}]*\}\})/g)

        return parts.map((part, index) => {
            // Check if this part is a variable
            if (/^\{\{[^}]*\}\}$/.test(part)) {
                return (
                    <span
                        key={index}
                        className="bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded px-0.5 font-semibold"
                    >
                        {part}
                    </span>
                )
            }
            // Regular text - preserve whitespace and newlines
            return <span key={index}>{part}</span>
        })
    }, [value, placeholder])

    return (
        <div className={cn("relative w-full h-full", className)}>
            {/* Highlight Layer - visible, shows colored text */}
            <div
                ref={highlightRef}
                className="absolute inset-0 overflow-auto pointer-events-none whitespace-pre-wrap break-words px-4 py-3 text-sm leading-relaxed text-slate-800 dark:text-slate-300"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-hidden="true"
            >
                {highlightedContent}
            </div>

            {/* Input Layer - transparent text, handles actual input */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                placeholder=""
                disabled={disabled}
                spellCheck={false}
                className={cn(
                    "absolute inset-0 w-full h-full resize-none bg-transparent",
                    "px-4 py-3 text-sm leading-relaxed",
                    "text-transparent caret-slate-800 dark:caret-slate-200",
                    "border-0 outline-none focus:ring-0 focus-visible:ring-0",
                    "selection:bg-cyan-500/30",
                    disabled && "cursor-not-allowed opacity-50"
                )}
                style={{ fontFamily: 'var(--font-mono)' }}
            />
        </div>
    )
}
