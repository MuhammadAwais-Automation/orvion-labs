import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
    title: 'Verify Your Email - Orvion Labs',
    description: 'Check your email to complete your account setup',
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl space-y-6 text-center">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Check Your Email
                        </h1>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm">
                            We've sent a verification link to your email address.
                            Please click the link to activate your account.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 text-left space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                            Next Steps:
                        </p>
                        <ol className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <span>Open your email inbox</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <span>Find the email from <strong>Orvion Labs</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <span>Click the <strong>verification link</strong></span>
                            </li>
                        </ol>
                    </div>

                    {/* Note */}
                    <p className="text-xs text-slate-400 dark:text-zinc-500">
                        Didn't receive the email? Check your spam folder or try signing up again.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button asChild variant="outline" className="flex-1">
                            <Link href="/login">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </Button>
                        <Button asChild className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
                            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                                <Mail className="w-4 h-4 mr-2" />
                                Open Gmail
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 dark:text-zinc-600 mt-6">
                    Having trouble? Contact support at <a href="mailto:support@orvionlabs.com" className="text-cyan-600 hover:underline">support@orvionlabs.com</a>
                </p>
            </div>
        </div>
    )
}
