'use client'

import React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, User, ArrowRight, Check, Loader2, Hexagon, Triangle, Box, AlertCircle, Eye, EyeOff } from "lucide-react"

// Hooks & Utils
import { useAuthForm } from "@/hooks/use-auth-form"

// Components
import { Button } from "@/components/ui/button"
import { AuthVisuals } from "./auth/auth-visuals"

export function AuthForm() {
    const {
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
        handleSubmit
    } = useAuthForm()

    return (
        <div className="min-h-screen w-full flex bg-slate-950 text-white overflow-hidden">
            {/* Left Column: Form (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 lg:px-20 pt-20 pb-10 relative z-10 bg-slate-950 border-r border-slate-900">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-3 tracking-tight">
                        {mode === "signin" ? "Welcome back." : "Create an account."}
                    </h1>
                    <p className="text-slate-400">
                        {mode === "signin"
                            ? "Enter your credentials to access the workspace."
                            : "Join elite engineering teams shipping AI with confidence."}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-900/50 rounded-xl mb-12 border border-slate-800 relative">
                    {(["signin", "signup"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setMode(tab)}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-200 ${mode === tab ? "text-white" : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {mode === tab && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-slate-800 rounded-lg shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 capitalize">{tab === "signin" ? "Sign In" : "Sign Up"}</span>
                        </button>
                    ))}
                </div>

                {/* Form */}
                <motion.form
                    action={handleSubmit}
                    className="space-y-5"
                    animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <AnimatePresence mode="popLayout">
                        {mode === "signup" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="name@company.com"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    {/* Confirm Password (Signup only) */}
                    <AnimatePresence mode="popLayout">
                        {mode === "signup" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        className={`w-full bg-slate-900/50 border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${password && confirmPassword && password !== confirmPassword
                                            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                                            : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/50'
                                            }`}
                                    />
                                </div>

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="p-3 bg-slate-900/30 border border-slate-800 rounded-lg">
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
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md flex items-center gap-3 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                        >
                            <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-0.5 leading-none">Handshake Failed</span>
                                <span className="text-sm font-bold tracking-tight leading-tight">{error}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Success Message (Signup) */}
                    {isSuccess && mode === "signup" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex items-center gap-3 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        >
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 flex-shrink-0">
                                <Check className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-0.5 leading-none">Identity Verified</span>
                                <span className="text-sm font-bold tracking-tight leading-tight">Check your email to confirm your account.</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Forgot Password Link (Sign In only) */}
                    {mode === "signin" && (
                        <div className="text-right">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            disabled={isLoading || isSuccess}
                            className={`w-full h-12 text-base font-semibold rounded-xl transition-all duration-500 overflow-hidden relative ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25"
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </motion.div>
                                ) : isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check className="w-5 h-5" />
                                        <span>Success</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="default"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </motion.form>

                {/* Social Proof */}
                <div className="mt-auto pt-12">
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-4">Trusted by engineers at</p>
                    <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2">
                            <Hexagon className="w-5 h-5" />
                            <span className="font-bold text-sm">ACME</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Triangle className="w-5 h-5" />
                            <span className="font-bold text-sm">NEXUS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Box className="w-5 h-5" />
                            <span className="font-bold text-sm">VERTEX</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Visuals (60%) */}
            <AuthVisuals />
        </div>
    )
}
