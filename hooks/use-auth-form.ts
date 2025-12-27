'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { login, signup } from '@/app/login/actions'
import { validatePassword } from '@/utils/auth-validation'

export function useAuthForm() {
    const [mode, setMode] = useState<"signin" | "signup">("signin")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const router = useRouter()

    // Reset form when switching modes
    useEffect(() => {
        setPassword("")
        setConfirmPassword("")
        setError(null)
        setValidationErrors([])
        setIsSuccess(false)
    }, [mode])

    const handleSubmit = async (formData: FormData) => {
        setError(null)
        setValidationErrors([])

        // Client-side validation for signup
        if (mode === "signup") {
            const { valid, errors } = validatePassword(password)
            if (!valid) {
                setValidationErrors(errors)
                toast.error("Password does not meet requirements")
                return
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match")
                toast.error("Passwords do not match")
                return
            }
        }

        setIsLoading(true)

        try {
            if (mode === "signin") {
                const result = await login(formData)

                // If login was successful, the server action will redirect.
                // If we reach here, it means it didn't redirect or returned an error.
                if (result?.error) {
                    toast.error(result.error)
                    setError(result.error)
                    setIsLoading(false)
                    return
                }

                // Success path (if not redirected yet)
                setIsSuccess(true)
                toast.success('Welcome back!')
            } else {
                const result = await signup(formData)
                if (result?.error) {
                    toast.error(result.error)
                    setError(result.error)
                    setIsLoading(false)
                    return
                }

                setIsSuccess(true)
                toast.success('Check your email to confirm account!')
                setTimeout(() => {
                    router.push('/verify-email')
                }, 2000)
            }
        } catch (err: any) {
            // Check if this is a Next.js redirect error
            if (err.message === 'NEXT_REDIRECT' || err.digest?.includes('NEXT_REDIRECT')) {
                // This is expected during a successful login redirect
                // We keep isLoading true to let the overlay stay until the page changes
                return
            }

            console.error('Auth Error:', err)
            toast.error(err.message || 'Something went wrong. Please try again.')
            setError(err.message)
            setIsLoading(false)
        }
    }

    return {
        mode,
        setMode,
        isLoading,
        isSuccess,
        error,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        validationErrors,
        handleSubmit
    }
}
