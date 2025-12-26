'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchCheck } from 'lucide-react'

export function InfiniteTestLoop() {
    const [step, setStep] = useState(0)

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                setStep(0) // Reset
                await new Promise(r => setTimeout(r, 500))
                setStep(1) // Type line 1
                await new Promise(r => setTimeout(r, 1500))
                setStep(2) // Type line 2
                await new Promise(r => setTimeout(r, 1500))
                setStep(3) // Scan
                await new Promise(r => setTimeout(r, 1000))
                setStep(4) // Success
                await new Promise(r => setTimeout(r, 3000))
            }
        }
        sequence()
    }, [])

    return (
        <div className="w-full max-w-lg bg-slate-950/90 backdrop-blur-xl rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm relative z-10">
            {/* Window Controls */}
            <div className="h-10 border-b border-slate-800 flex items-center px-4 gap-2 bg-slate-900/50">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <div className="ml-auto text-xs text-slate-500">test-runner.ts</div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 h-64 relative">
                <div className="space-y-2">
                    {step >= 1 && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                            <span className="text-slate-500">{'>'}</span>
                            <span className="text-cyan-400">Running regression checks...</span>
                        </motion.div>
                    )}
                    {step >= 2 && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                            <span className="text-slate-500">{'>'}</span>
                            <span className="text-purple-400">Analyzing output vectors...</span>
                        </motion.div>
                    )}
                </div>

                {/* Scan Effect */}
                <AnimatePresence>
                    {step === 3 && (
                        <motion.div
                            initial={{ top: 0, opacity: 0 }}
                            animate={{ top: "100%", opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "linear" }}
                            className="absolute left-0 right-0 h-px bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent h-20" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success Badge */}
                <AnimatePresence>
                    {step === 4 && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-30"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                                <div className="relative bg-slate-900 border border-green-500/50 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <SearchCheck className="w-4 h-4 text-slate-900" />
                                    </div>
                                    <span className="text-green-400 font-bold tracking-wide">TEST PASSED</span>
                                </div>
                                {/* Particles */}
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: 0, y: 0, opacity: 1 }}
                                        animate={{
                                            x: (Math.random() - 0.5) * 100,
                                            y: (Math.random() - 0.5) * 100,
                                            opacity: 0
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-400 rounded-full"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
