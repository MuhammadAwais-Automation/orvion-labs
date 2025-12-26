'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, Fingerprint, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthLoadingOverlayProps {
    isVisible: boolean
    mode: 'signin' | 'signup'
}

export function AuthLoadingOverlay({ isVisible, mode }: AuthLoadingOverlayProps) {
    const [step, setStep] = useState(0)

    const steps = mode === 'signin'
        ? [
            'Initializing secure channel...',
            'Verifying identity handshake...',
            'Authorizing workspace access...',
            'Decrypting session tokens...'
        ]
        : [
            'Generating cryptographic keys...',
            'Registering secure identity...',
            'Configuring workspace environment...',
            'Finalizing secure handshake...'
        ]

    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
            }, 800)
            return () => clearInterval(interval)
        } else {
            setStep(0)
        }
    }, [isVisible, steps.length])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl"
                >
                    {/* Animated Mesh Gradients */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 50, 0],
                                y: [0, -50, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[120px] rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                x: [0, -80, 0],
                                y: [0, 80, 0]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-500/10 blur-[150px] rounded-full"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Central Scanner Animation */}
                        <div className="relative w-32 h-32 mb-12">
                            {/* Rotating Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-2 border border-purple-500/20 rounded-full"
                            />

                            {/* Scanning Beam */}
                            <motion.div
                                animate={{
                                    top: ['0%', '100%', '0%'],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)] z-20"
                            />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 1.2, opacity: 0 }}
                                        className="text-cyan-400"
                                    >
                                        {step === 0 && <Shield className="w-10 h-10" />}
                                        {step === 1 && <Fingerprint className="w-10 h-10" />}
                                        {step === 2 && <Lock className="w-10 h-10" />}
                                        {step >= 3 && <Loader2 className="w-10 h-10 animate-spin" />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Terminal Text */}
                        <div className="space-y-2 text-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-bold text-white tracking-tight"
                            >
                                {mode === 'signin' ? 'Authenticating' : 'Creating Account'}
                            </motion.h2>

                            <div className="h-6 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={step}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-cyan-500/70 font-mono text-sm uppercase tracking-widest"
                                    >
                                        {steps[step]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-8 w-64 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
