'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, Check, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    if (password.length < 8) errors.push("At least 8 characters")
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter")
    if (!/[0-9]/.test(password)) errors.push("At least one number")
    return { valid: errors.length === 0, errors }
}

export function SecuritySection() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    const { valid, errors } = validatePassword(newPassword)

    const handlePasswordChange = async () => {
        setPasswordError(null)

        if (!valid) {
            setPasswordError(`Requirements: ${errors.join(', ')}`)
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }

        setIsSaving(true)

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                setPasswordError(error.message)
                toast.error(error.message)
            } else {
                toast.success('Password updated successfully!')
                setNewPassword('')
                setConfirmPassword('')
            }
        } catch (err: any) {
            setPasswordError(err.message || 'Failed to update password')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Security</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your account security settings</p>
            </div>

            {/* Password Change Form */}
            <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">Update your account password</p>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500 outline-none py-2 pr-10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium">
                        Confirm Password
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full bg-transparent border-b ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500/50' : 'border-gray-200 dark:border-white/10'} focus:border-cyan-500 dark:focus:border-cyan-500 outline-none py-2 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-all`}
                    />
                </div>

                {/* Password Requirements */}
                {newPassword && (
                    <div className="p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2">Password Requirements:</p>
                        <div className="space-y-1.5">
                            <p className={`text-xs flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                                {newPassword.length >= 8 ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                                At least 8 characters
                            </p>
                            <p className={`text-xs flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                                {/[A-Z]/.test(newPassword) ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                                At least one uppercase letter
                            </p>
                            <p className={`text-xs flex items-center gap-2 ${/[0-9]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                                {/[0-9]/.test(newPassword) ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                                At least one number
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {passwordError && (
                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {passwordError}
                    </div>
                )}

                {/* Update Button */}
                <div className="pt-2">
                    <Button
                        onClick={handlePasswordChange}
                        disabled={isSaving || !newPassword || !confirmPassword}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 mr-2" />
                                Update Password
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
