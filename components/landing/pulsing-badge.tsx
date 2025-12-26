'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function PulsingBadge() {
    const [text, setText] = useState("Systems Online")

    useEffect(() => {
        const interval = setInterval(() => {
            setText(prev => prev === "Systems Online" ? "Scans Active" : "Systems Online")
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-cyan-500/30 text-cyan-400 text-sm font-medium mx-auto lg:mx-0 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        >
            <span className="relative flex h-2 w-2">
                <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inline-flex h-full w-full rounded-full bg-cyan-400"
                ></motion.span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <motion.span
                key={text}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="tracking-wide min-w-[100px]"
            >
                {text}
            </motion.span>
        </motion.div>
    )
}
