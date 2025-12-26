'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Loader2, Check, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const searchParams = useSearchParams()

    // Check for error from callback redirect
    useEffect(() => {
        const error = searchParams.get('error')
        const reason = searchParams.get('reason')

        if (error === 'expired') {
            if (reason?.includes('code verifier')) {
                toast.error('Please open the reset link in the same browser where you requested it', {
                    duration: 6000
                })
            } else {
                toast.error('Your reset link has expired. Please request a new one.')
            }
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error('Please enter your email')
            return
        }

        setIsLoading(true)

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/update-password`
            })

            if (error) {
                console.error('Password reset error:', error)
                // Check for rate limit error
                if (error.message.includes('security purposes') || error.message.includes('seconds')) {
                    toast.error('Please wait before requesting another reset email')
                    setIsLoading(false)
                    return
                }
            }

            // Always show success (security best practice - don't reveal if email exists)
            setIsSuccess(true)
            setIsLoading(false)
        } catch (err: any) {
            // Check for rate limit in catch
            if (err?.message?.includes('security purposes') || err?.message?.includes('seconds')) {
                toast.error('Please wait 30 seconds before trying again')
                setIsLoading(false)
                return
            }
            // Still show success for security (other errors)
            setIsSuccess(true)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back Link */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                            <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h1 className="text-3xl font-bold">Reset Password</h1>
                    </div>
                    <p className="text-slate-400">
                        Enter your email address and we'll send you a secure link to reset your password.
                    </p>
                </div>

                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 text-center">Check your inbox</h3>
                        <p className="text-sm text-slate-400 text-center">
                            If an account exists for <span className="text-white font-medium">{email}</span>,
                            a recovery email has been sent.
                        </p>
                        <p className="text-xs text-slate-500 text-center mt-4">
                            Didn't receive it? Check your spam folder or try again.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@company.com"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                'Send Recovery Link'
                            )}
                        </Button>
                    </form>
                )}
            </motion.div>
        </div>
    )
}
