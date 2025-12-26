'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
    text: string
}

export function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0 border-white/10 hover:bg-white/10"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-400" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </Button>
    )
}
