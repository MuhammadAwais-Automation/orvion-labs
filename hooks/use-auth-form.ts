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
                if (result?.error) {
                    toast.error(result.error)
                    setError(result.error)
                    setIsLoading(false)
                    return
                }
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
                    router.push('/')
                }, 2000)
            }
        } catch (err: any) {
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
