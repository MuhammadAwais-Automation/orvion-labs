'use client'

import { useState } from 'react'
import { User, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateProfile } from '@/app/actions'
import { toast } from 'sonner'

interface GeneralSectionProps {
    initialFullName: string
    email: string
    userId: string
}

export function GeneralSection({ initialFullName, email, userId }: GeneralSectionProps) {
    const [fullName, setFullName] = useState(initialFullName)
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleSave = async () => {
        if (!fullName.trim()) {
            toast.error('Name cannot be empty')
            return
        }

        setIsSaving(true)
        const result = await updateProfile(fullName.trim())
        setIsSaving(false)

        if (result.success) {
            toast.success('Profile updated successfully!')
        } else {
            toast.error(result.error || 'Failed to update profile')
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(userId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('User ID copied!')
    }

    // Get initials for avatar
    const initials = (fullName || email)
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">General Settings</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your personal information</p>
            </div>

            {/* Avatar Section */}
            <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 border border-gray-200 dark:border-white/10">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                {initials}
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <User className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{fullName || 'User'}</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{email}</p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 space-y-6 shadow-sm">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">Personal Information</h3>

                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500 outline-none py-2 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors"
                    />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-2 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                    />
                </div>

                {/* User ID */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium">
                        User ID
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userId}
                            readOnly
                            className="flex-1 bg-transparent border-b border-gray-200 dark:border-white/10 py-2 text-gray-400 dark:text-zinc-500 font-mono text-xs cursor-default"
                        />
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || fullName === initialFullName}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
