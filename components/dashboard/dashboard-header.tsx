'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

interface DashboardHeaderProps {
    userName?: string
    userEmail?: string
}

export function DashboardHeader({ userName, userEmail }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)

    useEffect(() => {
        // Only set time after client-side mount to avoid hydration mismatch
        setCurrentTime(new Date())

        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Use full name from database, fallback to email username, then 'User'
    const displayName = userName || userEmail?.split('@')[0] || 'User'

    // Properly capitalize each word (for names like "John Doe" or "awais mushtaq")
    const formattedName = displayName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2"
        >
            {/* Left: Greeting */}
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-500 ml-1 mb-2">Command Center</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                    Welcome, {formattedName.split(' ')[0]}.
                </h1>
                <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium tracking-wide ml-1">
                    Your workspace is optimized and ready for deployment.
                </p>
            </div>

            {/* Right: Clock + Status Indicator */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-sm" suppressHydrationWarning>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-xs font-bold font-mono text-slate-600 dark:text-zinc-400">
                            {currentTime && format(currentTime, 'HH:mm:ss')}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
