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
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
            {/* Left: Greeting */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                        Welcome back, {formattedName}
                    </span>
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm md:text-base font-light tracking-wide">
                    Here's what's happening with your prompt engineering projects.
                </p>
            </div>

            {/* Right: Clock + Actions */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                {/* Clock Only - Buttons Removed */}
                <div className="px-3 md:px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300" suppressHydrationWarning>
                    {currentTime && (
                        <>
                            <span className="hidden sm:inline">{format(currentTime, 'EEE, MMM d')} • </span>
                            {format(currentTime, 'HH:mm:ss')}
                        </>
                    )}
                    {!currentTime && '--:--:--'}
                </div>
            </div>
        </motion.div>
    )
}
