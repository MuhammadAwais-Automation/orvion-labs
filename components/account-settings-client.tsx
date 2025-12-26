'use client'

import { useState } from 'react'
import { Check, Loader2, Lock, User, Eye, EyeOff, AlertCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from '@/app/actions'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

// Password validation rules
function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    if (password.length < 8) errors.push("At least 8 characters")
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter")
    if (!/[0-9]/.test(password)) errors.push("At least one number")
    return { valid: errors.length === 0, errors }
}

interface AccountSettingsClientProps {
    initialFullName: string
}

export function AccountSettingsClient({ initialFullName }: AccountSettingsClientProps) {
    // Profile State
    const [fullName, setFullName] = useState(initialFullName)
    const [isSavingProfile, setIsSavingProfile] = useState(false)

    // Password State
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    // Handle Profile Update
    const handleProfileUpdate = async () => {
        if (!fullName.trim()) {
            toast.error('Name cannot be empty')
            return
        }

        setIsSavingProfile(true)
        const result = await updateProfile(fullName.trim())
        setIsSavingProfile(false)

        if (result.success) {
            toast.success('Profile updated successfully!')
        } else {
            toast.error(result.error || 'Failed to update profile')
        }
    }

    // Handle Password Change
    const handlePasswordChange = async () => {
        setPasswordError(null)

        // Validate password strength
        const { valid, errors } = validatePassword(newPassword)
        if (!valid) {
            setPasswordError(`Requirements: ${errors.join(', ')}`)
            return
        }

        // Check passwords match
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }

        setIsSavingPassword(true)

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
            setIsSavingPassword(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Profile Section Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-cyan-400" />
                        Profile Information
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Update your personal information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Full Name
                        </label>
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="bg-black/40 border-white/10 text-white"
                        />
                    </div>
                    <Button
                        onClick={handleProfileUpdate}
                        disabled={isSavingProfile}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                        {isSavingProfile ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" /> Update Profile</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Security Section Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-cyan-400" />
                        Change Password
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Update your account password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-black/40 border-white/10 text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Confirm New Password
                        </label>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`bg-black/40 border-white/10 text-white ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500/50' : ''
                                }`}
                        />
                    </div>

                    {/* Password Requirements */}
                    {newPassword && (
                        <div className="p-3 bg-slate-900/50 border border-white/5 rounded-lg text-xs space-y-1">
                            <p className="text-slate-400 font-medium mb-2">Password Requirements:</p>
                            <p className={newPassword.length >= 8 ? 'text-green-400' : 'text-slate-500'}>
                                {newPassword.length >= 8 ? <Check className="w-3 h-3 inline mr-1" /> : '○ '} At least 8 characters
                            </p>
                            <p className={/[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-slate-500'}>
                                {/[A-Z]/.test(newPassword) ? <Check className="w-3 h-3 inline mr-1" /> : '○ '} At least one uppercase
                            </p>
                            <p className={/[0-9]/.test(newPassword) ? 'text-green-400' : 'text-slate-500'}>
                                {/[0-9]/.test(newPassword) ? <Check className="w-3 h-3 inline mr-1" /> : '○ '} At least one number
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {passwordError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {passwordError}
                        </div>
                    )}

                    <Button
                        onClick={handlePasswordChange}
                        disabled={isSavingPassword || !newPassword || !confirmPassword}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                        {isSavingPassword ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                        ) : (
                            <><Lock className="w-4 h-4 mr-2" /> Update Password</>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
