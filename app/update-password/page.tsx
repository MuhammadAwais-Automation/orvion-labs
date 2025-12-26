'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Check, Loader2, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

// Password validation rules
function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
        errors.push("At least 8 characters")
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("At least one uppercase letter")
    }
    if (!/[0-9]/.test(password)) {
        errors.push("At least one number")
    }

    return { valid: errors.length === 0, errors }
}

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingSession, setIsCheckingSession] = useState(true)
    const [hasSession, setHasSession] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Check for existing session or handle recovery token from URL hash
    useEffect(() => {
        const checkSession = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            // Check if we have a session from the callback
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                setHasSession(true)
                setIsCheckingSession(false)
                return
            }

            // Check for hash params (recovery flow uses hash fragments)
            if (typeof window !== 'undefined' && window.location.hash) {
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')
                const type = hashParams.get('type')

                if (accessToken && type === 'recovery') {
                    // Set the session from recovery tokens
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || ''
                    })

                    if (!error) {
                        setHasSession(true)
                        // Clean up URL
                        window.history.replaceState({}, document.title, window.location.pathname)
                    } else {
                        setError('Failed to verify recovery link. Please request a new one.')
                    }
                }
            }

            setIsCheckingSession(false)
        }

        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validate password strength
        const { valid, errors } = validatePassword(password)
        if (!valid) {
            setError(`Password requirements: ${errors.join(', ')}`)
            return
        }

        // Check passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) {
                setError(updateError.message)
                toast.error(updateError.message)
                setIsLoading(false)
                return
            }

            toast.success('Password updated successfully!')

            // Redirect to dashboard
            setTimeout(() => {
                router.push('/projects')
            }, 1000)

        } catch (err: any) {
            setError(err.message || 'Something went wrong')
            toast.error('Failed to update password')
            setIsLoading(false)
        }
    }

    // Show loading while checking session
    if (isCheckingSession) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
                    <p className="text-slate-400">Verifying your recovery link...</p>
                </div>
            </div>
        )
    }

    // Show error if no session
    if (!hasSession) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Invalid or Expired Link</h1>
                    <p className="text-slate-400 mb-6">
                        This password recovery link is invalid or has expired. Please request a new one.
                    </p>
                    <Button
                        onClick={() => router.push('/forgot-password')}
                        className="bg-cyan-600 hover:bg-cyan-700"
                    >
                        Request New Link
                    </Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
                    <p className="text-slate-400">
                        Choose a strong password to secure your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className={`w-full bg-slate-900/50 border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${confirmPassword && password !== confirmPassword
                                    ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                                    : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/50'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-slate-900/30 border border-slate-800 rounded-lg"
                        >
                            <p className="text-xs text-slate-400 mb-2 font-medium">Password Requirements:</p>
                            <ul className="space-y-1 text-xs">
                                <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-400' : 'text-slate-500'}`}>
                                    {password.length >= 8 ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                                    At least 8 characters
                                </li>
                                <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-slate-500'}`}>
                                    {/[A-Z]/.test(password) ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                                    At least one uppercase letter
                                </li>
                                <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-400' : 'text-slate-500'}`}>
                                    {/[0-9]/.test(password) ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                                    At least one number
                                </li>
                            </ul>
                        </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                Update Password
                            </span>
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    )
}
