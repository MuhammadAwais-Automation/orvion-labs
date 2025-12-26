'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CodeRain } from './code-rain'

export function AuthVisuals() {
    return (
        <div className="hidden lg:block w-[60%] relative bg-slate-950 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black z-0" />

            {/* Falling Code Rain Effect */}
            <CodeRain />

            {/* Floating Glass Card */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                {/* Radial Gradient behind card */}
                <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="p-1 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 shadow-2xl"
                >
                    <div className="bg-slate-950/80 rounded-xl p-6 flex items-center gap-4 border border-white/5 min-w-[320px]">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                            <Check className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400 font-mono mb-1">Status Check</div>
                            <div className="text-lg font-bold text-white tracking-tight">Production Deploy Verified</div>
                        </div>
                        <div className="ml-auto">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
